import { animals } from '../../recovered/animals/index.js';

const RARITY_ORDER = ['일반', '희귀', '특별', '전설', '환상'];

export const HATCH_OPTIONS = Object.freeze({
  forest1: { egg: 'forest', count: 1, cost: 5 },
  radiant1: { egg: 'radiant', count: 1, cost: 10 },
  forest5: { egg: 'forest', count: 5, cost: 25 },
  radiant5: { egg: 'radiant', count: 5, cost: 50 },
});

export function thresholdsFor({ egg, count }) {
  // Values recovered from the deployed bundle.
  if (count === 5) return [35, 65, 88];
  if (egg === 'radiant') return [25, 55, 83];
  return [45, 75, 93];
}

export function rarityFromRoll(roll, thresholds) {
  if (roll >= thresholds[2]) return '전설';
  if (roll >= thresholds[1]) return '특별';
  if (roll >= thresholds[0]) return '희귀';
  return '일반';
}

export function drawAnimal({ egg = 'forest', count = 1, quizBoost = 0, random = Math.random } = {}) {
  const thresholds = thresholdsFor({ egg, count });
  const roll = Math.min(99.99, random() * 100 + quizBoost * 5);
  const rarity = rarityFromRoll(roll, thresholds);
  const pool = animals.filter((animal) => animal.rarity === rarity && animal.id !== 'puffer');
  const fallback = animals.filter((animal) => animal.rarity === '일반');
  const candidates = pool.length ? pool : fallback;
  return candidates[Math.floor(random() * candidates.length)];
}

export function hatchMany({ egg, count, owned = {}, quizBoost = 0, random = Math.random }) {
  const nextOwned = { ...owned };
  const results = [];

  for (let index = 0; index < count; index += 1) {
    const animal = drawAnimal({ egg, count, quizBoost, random });
    const duplicate = Number(nextOwned[animal.id] || 0) > 0;
    nextOwned[animal.id] = Number(nextOwned[animal.id] || 0) + 1;
    results.push({ animal, duplicate });
  }

  return { owned: nextOwned, results };
}

export function highestRarity(results) {
  return results.reduce((best, result) => {
    const current = result.animal.rarity;
    return RARITY_ORDER.indexOf(current) > RARITY_ORDER.indexOf(best) ? current : best;
  }, '일반');
}
