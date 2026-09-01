import { DEFAULT_PROGRESS, STORAGE_KEYS } from './config.js';

function cloneDefaultProgress() {
  return {
    light: DEFAULT_PROGRESS.light,
    owned: { ...DEFAULT_PROGRESS.owned },
    behaviors: { ...DEFAULT_PROGRESS.behaviors },
    traces: { ...DEFAULT_PROGRESS.traces },
    quizWins: DEFAULT_PROGRESS.quizWins,
    explorations: DEFAULT_PROGRESS.explorations,
    partyGames: DEFAULT_PROGRESS.partyGames,
    partyBest: DEFAULT_PROGRESS.partyBest,
    claimed: { ...DEFAULT_PROGRESS.claimed },
  };
}

function safeObject(value, fallback = {}) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : fallback;
}

export function migrateProgress(rawProgress) {
  const base = cloneDefaultProgress();
  const source = safeObject(rawProgress, {});

  return {
    light: Number.isFinite(Number(source.light)) ? Number(source.light) : base.light,
    owned: { ...base.owned, ...safeObject(source.owned) },
    behaviors: { ...base.behaviors, ...safeObject(source.behaviors) },
    traces: { ...base.traces, ...safeObject(source.traces) },
    quizWins: Number.isFinite(Number(source.quizWins)) ? Number(source.quizWins) : base.quizWins,
    explorations: Number.isFinite(Number(source.explorations)) ? Number(source.explorations) : base.explorations,
    partyGames: Number.isFinite(Number(source.partyGames)) ? Number(source.partyGames) : base.partyGames,
    partyBest: Number.isFinite(Number(source.partyBest)) ? Number(source.partyBest) : base.partyBest,
    claimed: { ...base.claimed, ...safeObject(source.claimed) },
  };
}

export function resolveLanguage(search = window.location.search, storage = localStorage) {
  const params = new URLSearchParams(search);
  if (params.get('lang') === 'en') return 'en';
  if (params.get('lang') === 'ko') return 'ko';
  return storage.getItem(STORAGE_KEYS.language) === 'en' ? 'en' : 'ko';
}

export function loadSave(storage = localStorage) {
  let progress = cloneDefaultProgress();

  try {
    const raw = storage.getItem(STORAGE_KEYS.progress);
    if (raw) progress = migrateProgress(JSON.parse(raw));
  } catch {
    progress = cloneDefaultProgress();
  }

  return {
    language: storage.getItem(STORAGE_KEYS.language) === 'en' ? 'en' : 'ko',
    partyNickname: storage.getItem(STORAGE_KEYS.partyNickname) || '',
    partyPlayer: storage.getItem(STORAGE_KEYS.partyPlayer) || '',
    progress,
  };
}

export function saveProgress(progress, storage = localStorage) {
  const migrated = migrateProgress(progress);
  storage.setItem(STORAGE_KEYS.progress, JSON.stringify(migrated));
  return migrated;
}

export function saveLanguage(language, storage = localStorage) {
  const normalized = language === 'en' ? 'en' : 'ko';
  storage.setItem(STORAGE_KEYS.language, normalized);
  return normalized;
}

export function savePartyNickname(nickname, storage = localStorage) {
  storage.setItem(STORAGE_KEYS.partyNickname, String(nickname || ''));
}

export function ensurePartyPlayerId(storage = localStorage, createId = () => crypto.randomUUID()) {
  let playerId = storage.getItem(STORAGE_KEYS.partyPlayer);
  if (!playerId) {
    playerId = createId();
    storage.setItem(STORAGE_KEYS.partyPlayer, playerId);
  }
  return playerId;
}
