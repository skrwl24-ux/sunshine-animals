import assert from 'node:assert/strict';
import { applyCorrectAnswer, checkAnswer, getQuizPool, pickQuestion } from '../src/features/quiz/engine.js';

assert.equal(getQuizPool('ko').length, 44);
assert.equal(getQuizPool('en').length, 24);

const koPool = getQuizPool('ko');
const first = koPool[0];
assert.equal(checkAnswer(first, first.c), true);
assert.equal(checkAnswer(first, (Number(first.c) + 1) % 3), false);

const next = pickQuestion('ko', first.key, () => 0);
assert.notEqual(next.key, first.key);

const progress = applyCorrectAnswer({ light: 7, quizWins: 3, owned: { capybara: 1 } });
assert.equal(progress.light, 8);
assert.equal(progress.quizWins, 4);
assert.deepEqual(progress.owned, { capybara: 1 });

console.log('quiz-engine regression checks passed');
