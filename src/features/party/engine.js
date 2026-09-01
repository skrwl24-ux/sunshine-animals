import { animals } from '../../recovered/animals/index.js';
import { PARTY_LIGHT_REWARD_SCORE } from '../../core/config.js';

export const PARTY_DURATION_SECONDS = 60;
export const PARTY_PAIR_COUNT = 8;

export function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createPartyDeck(random = Math.random) {
  const selected = shuffle(animals.filter((animal) => animal.image), random).slice(0, PARTY_PAIR_COUNT);
  return shuffle(selected.flatMap((animal) => [
    { key: `${animal.id}-a`, animalId: animal.id, image: animal.image, emoji: animal.emoji, name: animal.name, nameEn: animal.nameEn },
    { key: `${animal.id}-b`, animalId: animal.id, image: animal.image, emoji: animal.emoji, name: animal.name, nameEn: animal.nameEn },
  ]), random);
}

export function scoreMatch(combo) { return combo >= 5 ? 200 : 100; }
export function lightRewardForScore(score) { return Math.floor(Math.max(0, Number(score) || 0) / PARTY_LIGHT_REWARD_SCORE); }
export function finishParty(progress, score) {
  const earnedLight = lightRewardForScore(score);
  return { ...progress, light: Number(progress.light || 0) + earnedLight, partyGames: Number(progress.partyGames || 0) + 1, partyBest: Math.max(Number(progress.partyBest || 0), Number(score) || 0) };
}
