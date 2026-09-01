import { DEFAULTS, STORAGE_KEYS } from './config.js';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function loadSave() {
  return {
    light: Number(localStorage.getItem(STORAGE_KEYS.light) ?? DEFAULTS.light),
    dust: Number(localStorage.getItem(STORAGE_KEYS.dust) ?? DEFAULTS.dust),
    owned: readJson(STORAGE_KEYS.owned, {}),
    language: localStorage.getItem(STORAGE_KEYS.language) || DEFAULTS.language,
    imageCache: readJson(STORAGE_KEYS.imageCache, {}),
  };
}

export function saveProgress(state) {
  localStorage.setItem(STORAGE_KEYS.light, String(state.light));
  localStorage.setItem(STORAGE_KEYS.dust, String(state.dust));
  localStorage.setItem(STORAGE_KEYS.owned, JSON.stringify(state.owned || {}));
  localStorage.setItem(STORAGE_KEYS.language, state.language || DEFAULTS.language);
  if (state.imageCache) {
    localStorage.setItem(STORAGE_KEYS.imageCache, JSON.stringify(state.imageCache));
  }
}

export function migrateSave(state) {
  // 현재 저장 키를 그대로 유지한다. 새 필드는 여기에서 비파괴적으로 추가한다.
  return {
    light: Number.isFinite(state.light) ? state.light : DEFAULTS.light,
    dust: Number.isFinite(state.dust) ? state.dust : DEFAULTS.dust,
    owned: state.owned && typeof state.owned === 'object' ? state.owned : {},
    language: state.language === 'en' ? 'en' : 'ko',
    imageCache: state.imageCache && typeof state.imageCache === 'object' ? state.imageCache : {},
  };
}
