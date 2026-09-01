import assert from 'node:assert/strict';
import { animals, animalCounts } from '../src/recovered/animals/index.js';
import { quizzes } from '../src/recovered/quizzes.js';
import { quests } from '../src/recovered/quests.js';
import { progression } from '../src/recovered/progression.js';

assert.equal(animalCounts.total, 65);
assert.deepEqual(
  [animalCounts.common, animalCounts.rare, animalCounts.epic, animalCounts.legendary, animalCounts.mythic],
  [22, 17, 14, 10, 2],
);
assert.equal(new Set(animals.map((animal) => animal.id)).size, 65, 'animal ids must be unique');
assert.equal(quizzes.ko.choice.length, 16);
assert.equal(quizzes.ko.ox.length, 14);
assert.equal(quizzes.ko.spot.length, 14);
assert.equal(quizzes.en.choice.length, 8);
assert.equal(quizzes.en.ox.length, 8);
assert.equal(quizzes.en.spot.length, 8);
assert.equal(quests.length, 7);
assert.equal(progression.upgrades.length, 4);
console.log('Recovered live-deployment data matches audited counts.');
