import { animals as common } from './common.js';
import { animals as rare } from './rare.js';
import { animals as epic } from './epic.js';
import { animals as legendary } from './legendary.js';
import { animals as mythic } from './mythic.js';

export const animals = [...common, ...rare, ...epic, ...legendary, ...mythic];

export const animalCounts = Object.freeze({
  total: animals.length,
  common: common.length,
  rare: rare.length,
  epic: epic.length,
  legendary: legendary.length,
  mythic: mythic.length,
});
