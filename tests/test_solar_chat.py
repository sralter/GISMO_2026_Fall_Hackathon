import unittest
import json
import numpy as np
import pandas as pd
from unittest.mock import Mock
from openai.types.chat import ChatCompletionMessage
from gismo_2026_fall_hackathon.solar_queries import execute_tool, attach_solar_metrics
from gismo_2026_fall_hackathon.solar_assistant import answer_question, previous_query


def inventory():
    return {key: {'building_id': key, 'roof_area_m2': area, 'roof_exposure': exposure}
            for key, area, exposure in [('1', 500., 10.), ('2', 600., None), ('3', 700., 10.)]}


def response(content=None, name=None, arguments='{}'):
    message = ChatCompletionMessage(role='assistant', content=content,
        tool_calls=[{'id': 'call_1', 'type': 'function', 'function': {'name': name, 'arguments': arguments}}] if name else None)
    return Mock(choices=[Mock(message=message)])


class QueryTests(unittest.TestCase):
    def test_count_boundaries_and_filters(self):
        result = execute_tool('count_buildings', {'roof_area_above_m2': 500}, inventory())
        self.assertEqual(result['total_matches'], 2)
        self.assertEqual(result['records'], [])
        mapped = execute_tool('count_buildings', {'roof_area_above_m2': 500}, inventory(), include_count_records=True)
        self.assertEqual([row['building_id'] for row in mapped['records']], ['2', '3'])
        self.assertEqual(mapped['total_matches'], result['total_matches'])
        self.assertEqual(result['measured_roofs'], 2)
        self.assertEqual(execute_tool('count_buildings', {'roof_area_above_m2': 500, 'exposure_above': 5}, inventory())['total_matches'], 1)
        self.assertEqual(execute_tool('count_buildings', {'exposure_above': 10}, inventory())['total_matches'], 0)

    def test_rank_missing_ties_and_cap(self):
        result = execute_tool('get_top_buildings', {'metric': 'roof_exposure', 'limit': 1}, inventory())
        self.assertEqual(result['total_matches'], 2)
        self.assertEqual([row['building_id'] for row in result['records']], ['1'])
        result = execute_tool('get_top_buildings', {'metric': 'roof_area_m2', 'limit': 20}, inventory())
        self.assertEqual([row['building_id'] for row in result['records']], ['3', '2', '1'])
        rows = {str(i): {'building_id': str(i), 'roof_area_m2': i, 'roof_exposure': None} for i in range(30)}
        result = execute_tool('get_top_buildings', {'metric': 'roof_area_m2', 'limit': 20}, rows)
        self.assertEqual(len(result['records']), 20)
        self.assertEqual(result['total_matches'], 30)
        self.assertEqual(execute_tool('get_top_buildings', {'metric': 'roof_exposure', 'limit': 5}, rows)['records'], [])

    def test_validation(self):
        for name, args in [('run_python', {}), ('count_buildings', []), ('count_buildings', {'x': 1}),
                           ('count_buildings', {'roof_area_above_m2': float('nan')}),
                           ('count_buildings', {'exposure_above': True}),
                           ('get_top_buildings', {'metric': 'facade', 'limit': 5}),
                           ('get_top_buildings', {'metric': 'roof_area_m2', 'limit': True}),
                           ('get_top_buildings', {'metric': 'roof_area_m2', 'limit': 21}),
                           ('get_building_details', {'building_id': 'missing'})]:
            with self.subTest(name=name, args=args), self.assertRaises(ValueError):
                execute_tool(name, args, inventory())
        self.assertEqual(execute_tool('get_building_details', {'building_id': '2'}, inventory())['records'][0]['building_id'], '2')

    def test_model_tools_and_followups(self):
        client = Mock()
        client.chat.completions.create.side_effect = [response(name='count_buildings', arguments='{"roof_area_above_m2":500}'), response('There are 2 buildings.')]
        original = []
        answer, history, results = answer_question(client, 'local', 'Count roofs', original, inventory())
        self.assertEqual(original, [])
        self.assertEqual(results[0]['total_matches'], 2)
        self.assertEqual(history[-2]['role'], 'tool')
        client.chat.completions.create.side_effect = [response('Roof area is geometric.')]
        _, followup, _ = answer_question(client, 'local', 'What does area mean?', history, inventory())
        self.assertEqual(followup[:len(history)], history)
        self.assertEqual(answer, 'There are 2 buildings.')

    def test_malformed_calls_limit_and_failure_leave_history_unchanged(self):
        client = Mock()
        client.chat.completions.create.side_effect = [response(name='count_buildings', arguments='{'), response('Please try again.')]
        _, history, results = answer_question(client, 'local', 'Count', [], inventory())
        self.assertEqual(results, [])
        self.assertIn('error', history[-2]['content'])
        client.chat.completions.create.side_effect = None
        client.chat.completions.create.return_value = response(name='count_buildings')
        with self.assertRaisesRegex(ValueError, 'five-request'):
            answer_question(client, 'local', 'Count', [], inventory())
        original = [{'role': 'user', 'content': 'Earlier'}]
        client.chat.completions.create.side_effect = ConnectionError('offline')
        with self.assertRaises(ConnectionError):
            answer_question(client, 'local', 'Count', original, inventory())
        self.assertEqual(len(original), 1)


class CalculatedQueryTests(unittest.TestCase):
    def inventory(self):
        return {str(i): {'building_id': str(i), 'roof_area_m2': 2000. if i <= 5 else 500.,
                         'roof_exposure': None, 'annual_kwh_m2': float(i * 100),
                         'irradiance_w_m2': float(i * 100)} for i in range(1, 11)}

    def test_combined_irradiance_and_breakdown(self):
        result = execute_tool('count_buildings', {'roof_area_above_m2': 1500,
                              'irradiance_above_w_m2': 494}, self.inventory())
        self.assertEqual(result['total_matches'], 1)
        self.assertEqual(result['condition_counts'], {'roof_area_above_m2': 5, 'irradiance_above_w_m2': 6})
        mapped = execute_tool('count_buildings', result['arguments'], self.inventory(), include_count_records=True)
        self.assertEqual([row['building_id'] for row in mapped['records']], ['5'])

    def test_scene_and_filtered_percentile_populations(self):
        args = {'roof_area_above_m2': 1000, 'top_percent': 20}
        scene = execute_tool('count_buildings', args, self.inventory())
        self.assertEqual(scene['total_matches'], 0)
        self.assertEqual(scene['percentile']['valid_population'], 10)
        self.assertEqual(scene['condition_counts']['top_percent'], 2)
        filtered = execute_tool('count_buildings', {**args, 'percentile_scope': 'filtered'}, self.inventory())
        self.assertEqual(filtered['total_matches'], 1)
        self.assertEqual(filtered['percentile']['valid_population'], 5)
        empty = execute_tool('count_buildings', {**args, 'roof_area_above_m2': 9999, 'percentile_scope': 'filtered'}, self.inventory())
        self.assertEqual(empty['total_matches'], 0)
        self.assertIsNone(empty['percentile']['cutoff'])

    def test_missing_data_ties_and_zero_irradiance(self):
        rows = self.inventory()
        for row in rows.values():
            row['annual_kwh_m2'] = 100.
            row['irradiance_w_m2'] = 0.
        rows['1']['annual_kwh_m2'] = None
        rows['2']['annual_kwh_m2'] = float('nan')
        result = execute_tool('count_buildings', {'top_percent': 10}, rows)
        self.assertEqual(result['total_matches'], 8)
        self.assertEqual(result['percentile']['valid_population'], 8)
        self.assertEqual(execute_tool('count_buildings', {'irradiance_above_w_m2': 0}, rows)['total_matches'], 0)
        for row in rows.values():
            row['irradiance_w_m2'] = None
        with self.assertRaisesRegex(ValueError, 'No valid'):
            execute_tool('count_buildings', {'irradiance_above_w_m2': 494}, rows)
        self.assertEqual(execute_tool('count_buildings', {'roof_area_above_m2': 1500}, rows)['total_matches'], 5)

    def test_followups_retain_filters_and_reject_changed_time(self):
        rows = self.inventory()
        first = execute_tool('count_buildings', {'roof_area_above_m2': 1500}, rows, context={'timestamp': 1})
        second = execute_tool('count_buildings', {'refine_previous': True, 'irradiance_above_w_m2': 494}, rows,
                              previous_query=first, context={'timestamp': 1})
        self.assertEqual(second['applied_filters'], {'roof_area_above_m2': 1500, 'irradiance_above_w_m2': 494})
        self.assertEqual(second['total_matches'], 1)
        with self.assertRaisesRegex(ValueError, 'time changed'):
            execute_tool('count_buildings', {'refine_previous': True, 'annual_above_kwh_m2': 0}, rows,
                         previous_query=second, context={'timestamp': 2})
        independent = execute_tool('count_buildings', {'irradiance_above_w_m2': 494}, rows)
        self.assertEqual(independent['total_matches'], 6)
        ranked = execute_tool('get_top_buildings', {'metric': 'annual_kwh_m2', 'limit': 3}, rows)
        subset = execute_tool('count_buildings', {'refine_previous': True, 'irradiance_above_w_m2': 900}, rows, previous_query=ranked)
        self.assertEqual(subset['total_matches'], 1)
        self.assertEqual(set(subset['base_building_ids']), {'8', '9', '10'})

    def test_join_ids_validity_and_exact_timestamp_without_mutation(self):
        rows = inventory()
        annual = pd.DataFrame({'doitt_id': [3, 1, 2], 'annual_kwh_m2': [300., 100., 200.], 'status': ['ok', 'ok', 'invalid']})
        daily = {'ids': np.array([3, 1, 2]), 'valid': np.array([True, False, True]),
                 'timestamps': np.array([1000, 2000]), 'irradiance': np.array([[30., 10., 20.], [300., 100., 200.]])}
        joined = attach_solar_metrics(rows, {'annual': annual, 'day': daily}, 2000)
        self.assertEqual(joined['3']['annual_kwh_m2'], 300.)
        self.assertIsNone(joined['2']['annual_kwh_m2'])
        self.assertEqual(joined['2']['irradiance_w_m2'], 200.)
        self.assertIsNone(joined['1']['irradiance_w_m2'])
        self.assertNotIn('annual_kwh_m2', rows['1'])
        unmatched = attach_solar_metrics(rows, {'annual': annual, 'day': daily}, 1500)
        self.assertTrue(all(row['irradiance_w_m2'] is None for row in unmatched.values()))

    def test_new_argument_validation(self):
        for args in [{'top_percent': 0}, {'top_percent': 101}, {'top_percent': True},
                     {'top_percent': float('inf')}, {'top_percent': 10, 'percentile_metric': []},
                     {'percentile_metric': 'annual_kwh_m2'}, {'top_percent': 10, 'percentile_scope': 'NYC'},
                     {'refine_previous': True}, {'refine_previous': 1},
                     {'irradiance_above_w_m2': -1}]:
            with self.subTest(args=args), self.assertRaises(ValueError):
                execute_tool('count_buildings', args, self.inventory())

    def test_existing_conversations_can_be_refined(self):
        legacy = {'tool': 'count_buildings', 'arguments': {'roof_area_above_m2': 1500},
                  'records': [], 'total_matches': 5}
        previous = previous_query([{'role': 'tool', 'content': json.dumps(legacy)}])
        refined = execute_tool('count_buildings', {'refine_previous': True, 'irradiance_above_w_m2': 494},
                               self.inventory(), previous_query=previous)
        self.assertEqual(refined['total_matches'], 1)
        self.assertEqual(refined['applied_filters']['roof_area_above_m2'], 1500)

    def test_multiturn_model_refinement_uses_saved_tool_filters(self):
        client = Mock()
        client.chat.completions.create.side_effect = [response(name='count_buildings', arguments='{"roof_area_above_m2":1500}'), response('Five roofs.')]
        _, history, _ = answer_question(client, 'local', 'Area above 1500?', [], self.inventory(), context={'timestamp': 1})
        client.chat.completions.create.side_effect = [response(name='count_buildings', arguments='{"refine_previous":true,"irradiance_above_w_m2":494}'), response('One of those roofs.')]
        _, _, results = answer_question(client, 'local', 'Of these, irradiance above 494?', history, self.inventory(), context={'timestamp': 1})
        self.assertEqual(results[0]['total_matches'], 1)
        self.assertEqual(results[0]['applied_filters']['roof_area_above_m2'], 1500)


if __name__ == '__main__':
    unittest.main()
