import assert from 'node:assert/strict';
import { STORAGE_KEYS } from '../src/core/config.js';
import { loadSave, migrateProgress, resolveLanguage, saveProgress } from '../src/core/storage.js';

class MemoryStorage {
  constructor(seed = {}) { this.map = new Map(Object.entries(seed)); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
}

const legacyProgress = {
  light: 37,
  owned: { capybara: 2, orca: 1 },
  behaviors: { 'capy-rest': true, 'orca-hunt': true },
  traces: { mythic: 45 },
  quizWins: 12,
  explorations: 9,
  partyGames: 4,
  partyBest: 1320,
  claimed: { q1: true },
};

const storage = new MemoryStorage({
  [STORAGE_KEYS.progress]: JSON.stringify(legacyProgress),
  [STORAGE_KEYS.language]: 'en',
  [STORAGE_KEYS.partyNickname]: 'Explorer',
  [STORAGE_KEYS.partyPlayer]: 'player-123',
});

const loaded = loadSave(storage);
assert.equal(loaded.language, 'en');
assert.equal(loaded.progress.light, 37);
assert.equal(loaded.progress.owned.orca, 1);
assert.equal(loaded.progress.partyBest, 1320);
assert.equal(loaded.partyNickname, 'Explorer');
assert.equal(loaded.partyPlayer, 'player-123');

const migrated = migrateProgress({ light: 10, owned: { fox: 1 } });
assert.equal(migrated.light, 10);
assert.equal(migrated.owned.fox, 1);
assert.equal(migrated.owned.capybara, 1);
assert.equal(migrated.quizWins, 0);

saveProgress(loaded.progress, storage);
const roundTrip = JSON.parse(storage.getItem(STORAGE_KEYS.progress));
assert.deepEqual(roundTrip, loaded.progress);

assert.equal(resolveLanguage('?lang=ko', storage), 'ko');
assert.equal(resolveLanguage('?lang=en', storage), 'en');
assert.equal(resolveLanguage('', storage), 'en');

console.log('storage compatibility checks passed');
