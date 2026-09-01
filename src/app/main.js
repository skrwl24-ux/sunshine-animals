import { getState, subscribe } from './state.js';
import { resolveLanguage, setLanguage, toggleLanguage } from './language.js';
import { renderHome } from './home.js';

const root = document.getElementById('app');

function render() {
  renderHome(root, getState(), {
    onToggleLanguage() {
      toggleLanguage();
    },
    onFeature(feature) {
      const language = getState().language;
      const messages = {
        ko: {
          hatch: '알 부화 기능을 다음 단계에서 연결합니다.',
          quiz: '퀴즈 기능을 다음 단계에서 연결합니다.',
          book: '동물도감 기능을 다음 단계에서 연결합니다.',
          party: '애니멀 파티 기능을 다음 단계에서 연결합니다.',
          rescue: '애니멀 구조대 기능을 다음 단계에서 연결합니다.',
          quests: '특별 퀘스트 기능을 다음 단계에서 연결합니다.',
        },
        en: {
          hatch: 'Egg hatching will be connected in the next step.',
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
