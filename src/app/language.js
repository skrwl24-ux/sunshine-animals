import { setState, getState } from './state.js';

export function resolveLanguage() {
  const requested = new URLSearchParams(location.search).get('lang');
  if (requested === 'ko' || requested === 'en') return requested;
  return getState().language === 'en' ? 'en' : 'ko';
}

export function setLanguage(language) {
  const next = language === 'en' ? 'en' : 'ko';
  setState({ language: next });
  document.documentElement.lang = next;
  return next;
}
