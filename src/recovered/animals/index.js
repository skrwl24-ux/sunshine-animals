import { animals as common } from './common.js';
import { animals as rare } from './rare.js';
import { animals as epic } from './epic.js';
import { animals as legendary } from './legendary.js';
import { animals as mythic } from './mythic.js';
import { enrichRecoveredAnimals, legacyAnimalExpansion } from '../legacy-main-adapter.js';

const rawRecoveredAnimals = [...common, ...rare, ...epic, ...legendary, ...mythic];
export const recoveredAnimals = enrichRecoveredAnimals(rawRecoveredAnimals);
export const expansionAnimals = legacyAnimalExpansion(recoveredAnimals);
export const animals = [...recoveredAnimals, ...expansionAnimals];

export const animalCounts = Object.freeze({
  total: animals.length,
  recovered: recoveredAnimals.length,
  expansion: expansionAnimals.length,
  common: animals.filter((animal) => animal.rarity === '일반').length,
  rare: animals.filter((animal) => animal.rarity === '희귀').length,
  epic: animals.filter((animal) => animal.rarity === '특별').length,
  legendary: animals.filter((animal) => animal.rarity === '전설').length,
  mythic: animals.filter((animal) => animal.rarity === '환상').length,
});
