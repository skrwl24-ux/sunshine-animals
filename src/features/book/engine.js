import { animals } from '../../recovered/animals/index.js';

export const BOOK_FILTERS = Object.freeze(['all','일반','희귀','특별','전설','환상']);

export function getOwnedCount(owned = {}, animalId) {
  return Math.max(0, Number(owned?.[animalId] || 0));
}

export function isDiscovered(owned = {}, animalId) {
  return getOwnedCount(owned, animalId) > 0;
}

export function getBookAnimals({ owned = {}, filter = 'all' } = {}) {
  return animals
    .filter((animal) => filter === 'all' || animal.rarity === filter)
    .map((animal) => ({
      ...animal,
      count: getOwnedCount(owned, animal.id),
      discovered: isDiscovered(owned, animal.id),
    }));
}

export function getBookStats(owned = {}) {
  const discovered = animals.filter((animal) => isDiscovered(owned, animal.id)).length;
  return { discovered, total: animals.length };
}

export function findAnimal(animalId) {
  return animals.find((animal) => animal.id === animalId) || null;
}
