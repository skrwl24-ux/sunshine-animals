import { getState, subscribe } from './state.js';
import { resolveLanguage, setLanguage, toggleLanguage } from './language.js';
import { renderHome } from './home.js';
import { renderHatching, clearHatchResult } from '../features/hatching/view.js';
import { renderBook, resetBookFilter } from '../features/book/view.js';
import { renderQuiz, clearQuizState } from '../features/quiz/view.js';

const root = document.getElementById('app');
let currentFeature = 'home';

function openFeature(feature) {
  currentFeature = feature;
  render();
}

function render() {
  const state = getState();

  if (currentFeature === 'hatch') {
    renderHatching(root, state, {
      onHome() { currentFeature = 'home'; render(); },
      onFeature(feature) { openFeature(feature); },
    });
    return;
  }

  if (currentFeature === 'book') {
    renderBook(root, state, {
      onHome() { currentFeature = 'home'; render(); },
      onRefresh() { render(); },
    });
    return;
  }

  if (currentFeature === 'quiz') {
    renderQuiz(root, state, {
      onHome() { currentFeature = 'home'; render(); },
      onRefresh() { render(); },
    });
    return;
  }

  renderHome(root, state, {
    onToggleLanguage() { toggleLanguage(); },
    onFeature(feature) {
      if (feature === 'hatch') {
        clearHatchResult();
        openFeature('hatch');
        return;
      }
      if (feature === 'book') {
        resetBookFilter();
        openFeature('book');
        return;
      }
      if (feature === 'quiz') {
        clearQuizState();
        openFeature('quiz');
        return;
      }

      const language = getState().language;
      const messages = {
        ko: {
          party: '애니멀 파티 기능은 다음 단계에서 연결합니다.',
          rescue: '애니멀 구조대 기능은 다음 단계에서 연결합니다.',
          quests: '특별 퀘스트 기능은 다음 단계에서 연결합니다.',
        },
        en: {
          party: 'Animal Party will be connected in the next step.',
          rescue: 'Animal Rescue will be connected in the next step.',
          quests: 'Special Quests will be connected in the next step.',
        },
      };
      window.alert(messages[language === 'en' ? 'en' : 'ko'][feature]);
    },
  });
}

setLanguage(resolveLanguage());
subscribe(render);
render();
