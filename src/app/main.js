import { getState, subscribe } from './state.js';
import { resolveLanguage, setLanguage, toggleLanguage } from './language.js';
import { renderHome } from './home.js';
import { renderHatching, clearHatchResult } from '../features/hatching/view.js';

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
      onHome() {
        currentFeature = 'home';
        render();
      },
      onFeature(feature) {
        openFeature(feature);
      },
    });
    return;
  }

  renderHome(root, state, {
    onToggleLanguage() {
      toggleLanguage();
    },
    onFeature(feature) {
      if (feature === 'hatch') {
        clearHatchResult();
        openFeature('hatch');
        return;
      }

      const language = getState().language;
      const messages = {
        ko: {
          quiz: '퀴즈 기능은 다음 단계에서 연결합니다.',
          book: '동물도감 기능은 다음 단계에서 연결합니다.',
          party: '애니멀 파티 기능은 다음 단계에서 연결합니다.',
          rescue: '애니멀 구조대 기능은 다음 단계에서 연결합니다.',
          quests: '특별 퀘스트 기능은 다음 단계에서 연결합니다.',
        },
        en: {
          quiz: 'Animal Quiz will be connected in the next step.',
          book: 'My Animal Collection will be connected in the next step.',
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
