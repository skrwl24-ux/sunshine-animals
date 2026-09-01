import { loadSave, saveLanguage, saveProgress } from '../core/storage.js';

let state = loadSave();
const listeners = new Set();

export function getState() {
  return state;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((listener) => listener(state));
}

export function setProgress(patch) {
  const nextProgress = {
    ...state.progress,
    ...patch,
  };
  state = {
    ...state,
    progress: saveProgress(nextProgress),
  };
  notify();
}

export function setLanguageState(language) {
  const normalized = saveLanguage(language);
  state = { ...state, language: normalized };
  notify();
  return normalized;
}

export function replaceState(nextState) {
  state = nextState;
  notify();
}
