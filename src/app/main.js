import { getState, subscribe } from './state.js';
import { resolveLanguage, setLanguage, toggleLanguage } from './language.js';
import { renderHome } from './home.js';
import { renderHatching, clearHatchResult } from '../features/hatching/view.js';
import { renderBook, resetBookFilter } from '../features/book/view.js';
import { renderQuiz, clearQuizState } from '../features/quiz/view.js';
import { renderParty, stopPartyTimer } from '../features/party/view.js';
import { renderRescue, stopRescueTimer } from '../features/rescue/view.js';
import { renderQuests } from '../features/quests/view.js';

const root = document.getElementById('app');
let currentFeature = 'home';

function cleanupFeature() {
  stopPartyTimer();
  stopRescueTimer();
}

function openFeature(feature) {
  cleanupFeature();
  currentFeature = feature;
  render();
}

function goHome() {
  cleanupFeature();
  currentFeature = 'home';
  render();
}

function render() {
  const state = getState();

  if (currentFeature === 'hatch') {
    renderHatching(root, state, { onHome: goHome, onFeature: openFeature });
    return;
  }
  if (currentFeature === 'book') {
    renderBook(root, state, { onHome: goHome, onRefresh: render });
    return;
  }
  if (currentFeature === 'quiz') {
    renderQuiz(root, state, { onHome: goHome, onRefresh: render });
    return;
  }
  if (currentFeature === 'party') {
    renderParty(root, state, { onHome: goHome, onReplay: () => openFeature('party') });
    return;
  }
  if (currentFeature === 'rescue') {
    renderRescue(root, state, { onHome: goHome, onReplay: () => openFeature('rescue') });
    return;
  }
  if (currentFeature === 'quests') {
    renderQuests(root, state, { onHome: goHome, onRefresh: render });
    return;
  }

  renderHome(root, state, {
    onToggleLanguage() { toggleLanguage(); },
    onFeature(feature) {
      if (feature === 'hatch') clearHatchResult();
      if (feature === 'book') resetBookFilter();
      if (feature === 'quiz') clearQuizState();
      openFeature(feature);
    },
  });
}

setLanguage(resolveLanguage());
subscribe(render);
render();
