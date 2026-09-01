import assert from 'node:assert/strict';
import { animals } from '../src/recovered/animals/index.js';
import { getBookAnimals, getBookStats, isDiscovered } from '../src/features/book/engine.js';

const owned = { capybara: 2, penguin: 1 };
assert.equal(isDiscovered(owned, 'capybara'), true);
assert.equal(isDiscovered(owned, 'orca'), false);

const stats = getBookStats(owned);
assert.equal(stats.discovered, 2);
assert.equal(stats.total, animals.length);

const all = getBookAnimals({ owned, filter: 'all' });
assert.equal(all.length, animals.length);
assert.equal(all.find((animal) => animal.id === 'capybara').count, 2);
assert.equal(all.find((animal) => animal.id === 'capybara').discovered, true);

const common = getBookAnimals({ owned, filter: '일반' });
assert.ok(common.length > 0);
assert.ok(common.every((animal) => animal.rarity === '일반'));

console.log('book-engine regression checks passed');
