export const STORAGE_KEYS = Object.freeze({
  light: 'saLight',
  dust: 'saDust',
  owned: 'saOwned',
  language: 'saLang',
  imageCache: 'saImgCache',
});

export const DEFAULTS = Object.freeze({
  light: 53,
  dust: 0,
  language: 'ko',
});

export const EGG_COST = Object.freeze({
  forest: 5,
  radiant: 10,
});

export const LANGUAGES = Object.freeze(['ko', 'en']);

export const RARITY_NAMES = Object.freeze({
  ko: ['일반', '희귀', '특별', '전설', '환상'],
  en: ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'],
});
