import unittest
from unittest.mock import Mock
from openai.types.chat import ChatCompletionMessage
from gismo_2026_fall_hackathon.solar_queries import execute_tool
from gismo_2026_fall_hackathon.solar_assistant import answer_question


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


if __name__ == '__main__':
    unittest.main()
