import { animals } from '../../recovered/animals/index.js';
import { quests } from '../../recovered/quests.js';

export function discoveredCount(owned = {}) {
  return Object.values(owned).filter((count) => Number(count) > 0).length;
}

export function questProgress(quest, progress) {
  if (quest.metric === 'discoveredCount') return discoveredCount(progress.owned);
  return Number(progress[quest.metric] || 0);
}

export function questComplete(quest, progress) {
  return questProgress(quest, progress) >= quest.target;
}

export function questClaimed(quest, progress) {
  return Boolean(progress.claimed?.[quest.id]);
}

export function claimQuest(questId, progress) {
  const quest = quests.find((item) => item.id === questId);
  if (!quest || !questComplete(quest, progress) || questClaimed(quest, progress)) return { progress, claimed: false };
  const next = {
    ...progress,
    owned: { ...(progress.owned || {}) },
    claimed: { ...(progress.claimed || {}), [quest.id]: true },
  };
  if (quest.reward.type === 'light') next.light = Number(next.light || 0) + Number(quest.reward.amount || 0);
  if (quest.reward.type === 'animal') {
    const animalExists = animals.some((animal) => animal.id === quest.reward.animalId);
    if (animalExists) next.owned[quest.reward.animalId] = Number(next.owned[quest.reward.animalId] || 0) + 1;
  }
  return { progress: next, claimed: true, reward: quest.reward };
}
