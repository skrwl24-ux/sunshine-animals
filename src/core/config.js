export const STORAGE_KEYS = Object.freeze({
  progress: 'animal-discovery-v3',
  language: 'sunshine-language',
  partyNickname: 'sunshine-party-nickname',
  partyPlayer: 'sunshine-party-player',
});

export const DEFAULT_PROGRESS = Object.freeze({
  light: 5,
  owned: Object.freeze({ capybara: 1 }),
  behaviors: Object.freeze({ 'capy-rest': true }),
  traces: Object.freeze({}),
  quizWins: 0,
  explorations: 0,
  partyGames: 0,
  partyBest: 0,
  claimed: Object.freeze({}),
});

export const DEFAULTS = Object.freeze({
  language: 'ko',
  progress: DEFAULT_PROGRESS,
});

export const EGG_COST = Object.freeze({
  forest: 5,
  radiant: 10,
});

export const PARTY_LIGHT_REWARD_SCORE = 200;
export const RESCUE_LIGHT_REWARD_SCORE = 500;
export const RESCUE_DURATION_SECONDS = 30;

export const LANGUAGES = Object.freeze(['ko', 'en']);

export const RARITY_NAMES = Object.freeze({
  ko: ['일반', '희귀', '특별', '전설', '환상'],
  en: ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'],
});
