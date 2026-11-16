import assert from 'node:assert/strict';
import {test} from 'node:test';
import {roofColor, roofValues} from '../src/solar.ts';

test('fixed roof ramp distinguishes missing data and zero irradiance', () => {
  assert.deepEqual(roofColor(null, 1200), [160, 160, 160]);
  assert.deepEqual(roofColor(0, 1200), [255, 255, 0]);
  assert.deepEqual(roofColor(600, 1200), [255, 128, 0]);
  assert.deepEqual(roofColor(1200, 1200), [255, 0, 0]);
  assert.deepEqual(roofColor(1500, 1200), [255, 0, 0]);
});

test('timestamp lookup cannot display another day’s cached values', () => {
  const data = {ids: ['1'], annual: [1400], irradiance: [[500]], sunlit: [[.75]],
    valid: [true], timestamps: [1000]};
  assert.deepEqual(roofValues(data, 0, 0, 1000), {annual: 1400, instant: 500, sunlit: .75});
  assert.equal(roofValues(data, 0, 0, 2000).instant, null);
  assert.equal(roofValues(data, undefined, 0, 1000).annual, null);
  assert.equal(roofValues({...data, valid: [false]}, 0, 0, 1000).instant, null);
});
