import { loadSave, migrateSave, saveProgress } from '../core/storage.js';

let state = migrateSave(loadSave());
const listeners = new Set();

export function getState() {
  return state;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setState(patch) {
  state = { ...state, ...patch };
  saveProgress(state);
  listeners.forEach((listener) => listener(state));
}

export function updateState(updater) {
  const next = updater(state);
  setState(next);
}
