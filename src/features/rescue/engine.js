import { animals } from '../../recovered/animals/index.js';
import { RESCUE_DURATION_SECONDS, RESCUE_LIGHT_REWARD_SCORE } from '../../core/config.js';

export { RESCUE_DURATION_SECONDS };
export const RESCUE_GRID_SIZE = 16;

export function randomAnimals(count = RESCUE_GRID_SIZE, random = Math.random) {
  const pool = [...animals].filter((animal) => animal.image);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

export function rescueScore(combo) {
  return combo >= 5 ? 200 : 100;
}

export function lightRewardForRescue(score) {
  return Math.floor(Math.max(0, Number(score) || 0) / RESCUE_LIGHT_REWARD_SCORE);
}

export function applyRescueReward(progress, score) {
  const reward = lightRewardForRescue(score);
  return { ...progress, light: Number(progress.light || 0) + reward };
}

export function reactionAverage(reactions = []) {
  if (!reactions.length) return 0;
  return reactions.reduce((sum, value) => sum + value, 0) / reactions.length;
}
