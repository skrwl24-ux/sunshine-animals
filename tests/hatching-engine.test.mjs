import assert from 'node:assert/strict';
import { HATCH_OPTIONS, thresholdsFor, rarityFromRoll, hatchMany } from '../src/features/hatching/engine.js';

assert.deepEqual(HATCH_OPTIONS.forest1, { egg: 'forest', count: 1, cost: 5 });
assert.deepEqual(HATCH_OPTIONS.radiant1, { egg: 'radiant', count: 1, cost: 10 });
assert.deepEqual(HATCH_OPTIONS.forest5, { egg: 'forest', count: 5, cost: 25 });
assert.deepEqual(HATCH_OPTIONS.radiant5, { egg: 'radiant', count: 5, cost: 50 });

assert.deepEqual(thresholdsFor({ egg: 'forest', count: 1 }), [45, 75, 93]);
assert.deepEqual(thresholdsFor({ egg: 'radiant', count: 1 }), [25, 55, 83]);
assert.deepEqual(thresholdsFor({ egg: 'forest', count: 5 }), [35, 65, 88]);
assert.deepEqual(thresholdsFor({ egg: 'radiant', count: 5 }), [35, 65, 88]);

assert.equal(rarityFromRoll(0, [45, 75, 93]), '일반');
assert.equal(rarityFromRoll(45, [45, 75, 93]), '희귀');
assert.equal(rarityFromRoll(75, [45, 75, 93]), '특별');
assert.equal(rarityFromRoll(93, [45, 75, 93]), '전설');

const sequence = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let cursor = 0;
const random = () => sequence[cursor++ % sequence.length];
const result = hatchMany({ egg: 'forest', count: 5, owned: { capybara: 1 }, random });
assert.equal(result.results.length, 5);
assert.equal(Object.values(result.owned).reduce((sum, count) => sum + Number(count || 0), 0), 6);

console.log('hatching-engine regression checks passed');
