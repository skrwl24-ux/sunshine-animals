import { getState, setLanguageState } from './state.js';

export function resolveLanguage() {
  const requested = new URLSearchParams(location.search).get('lang');
  if (requested === 'ko' || requested === 'en') return requested;
  return getState().language === 'en' ? 'en' : 'ko';
}

export function setLanguage(language) {
  const next = setLanguageState(language);
  document.documentElement.lang = next;
  return next;
}

export function toggleLanguage() {
  return setLanguage(getState().language === 'en' ? 'ko' : 'en');
}
