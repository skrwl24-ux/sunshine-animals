import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../game-data.js', import.meta.url), 'utf8');
const sandbox = {
  window: {},
  document: {
    addEventListener() {},
    querySelectorAll() { return []; },
  },
};
vm.runInNewContext(source, sandbox);
globalThis.GAME_DATA = sandbox.window.GAME_DATA;

assert.equal(GAME_DATA.animals.length, 165, 'main game-data must retain 165 animals');
assert.equal(GAME_DATA.quizzes.length, 100, 'main game-data must retain 100 bilingual quizzes');

const { animals, animalCounts } = await import('../src/recovered/animals/index.js');
const { getQuizPool } = await import('../src/features/quiz/engine.js');

assert.ok(animals.length >= 165, 'readable build must expose every main animal plus recovered detail records');
assert.equal(new Set(animals.map((animal) => animal.id)).size, animals.length, 'readable animal IDs must be unique');
assert.ok(getQuizPool('ko').length >= 100, 'Korean readable quiz pool must preserve 100 main quizzes');
assert.ok(getQuizPool('en').length >= 100, 'English readable quiz pool must preserve 100 main quizzes');
assert.equal(animalCounts.recovered, 65, '65 detailed animals recovered from deployment must remain intact');
console.log('main data integration tests passed');
