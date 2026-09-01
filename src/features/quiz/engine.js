import { quizzes } from '../../recovered/quizzes.js';

const TYPE_ORDER = ['choice', 'ox', 'spot'];

function randomItem(items, random = Math.random) {
  return items[Math.floor(random() * items.length)];
}

export function getQuizPool(language = 'ko') {
  const lang = language === 'en' ? 'en' : 'ko';
  const source = quizzes[lang];
  return TYPE_ORDER.flatMap((type) => (source[type] || []).map((question, index) => ({
    ...question,
    type,
    key: `${lang}:${type}:${index}`,
  })));
}

export function pickQuestion(language = 'ko', previousKey = null, random = Math.random) {
  const pool = getQuizPool(language);
  const candidates = previousKey && pool.length > 1 ? pool.filter((q) => q.key !== previousKey) : pool;
  return randomItem(candidates, random);
}

export function getAnswers(question, language = 'ko') {
  if (question.type === 'ox') {
    return language === 'en' ? ['True', 'False'] : ['맞아요', '아니에요'];
  }
  return question.a || [];
}

export function checkAnswer(question, answerIndex) {
  return Number(answerIndex) === Number(question.c);
}

export function applyCorrectAnswer(progress) {
  return {
    ...progress,
    light: Number(progress.light || 0) + 1,
    quizWins: Number(progress.quizWins || 0) + 1,
  };
}
