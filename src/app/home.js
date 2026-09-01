import { animals } from '../recovered/animals/index.js';
import { translations } from '../recovered/translations.js';

function tr(language, text) {
  if (language !== 'en') return text;
  return translations.base[text] || translations.hatchingAndMessages[text] || text;
}

function ownedCount(owned = {}) {
  return Object.values(owned).filter((count) => Number(count) > 0).length;
}

export function renderHome(root, state, handlers) {
  const language = state.language === 'en' ? 'en' : 'ko';
  const progress = state.progress;
  const discovered = ownedCount(progress.owned);

  root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">SUNSHINE ANIMALS</p>
          <h1>${language === 'en' ? 'Nature Discovery Adventure' : '자연 발견 모험'}</h1>
        </div>
        <div class="top-actions">
          <div class="resource-pill" aria-label="${tr(language, '자연의 빛')}">
            <span>🌿</span>
            <span>${tr(language, '자연의 빛')}</span>
            <strong>${progress.light}</strong>
          </div>
          <button class="language-button" type="button" data-action="language">
            ${language === 'en' ? '🇰🇷 한국어' : '🌎 English'}
          </button>
        </div>
      </header>

      <main>
        <section class="hero-card">
          <div>
            <p class="eyebrow">${language === 'en' ? 'Readable development build' : '읽기 쉬운 개발 버전'}</p>
            <h2>${language === 'en' ? 'Meet animals, learn facts, and collect Light of Nature.' : '동물을 만나고, 퀴즈를 풀고, 자연의 빛을 모아보세요.'}</h2>
            <p class="muted">${language === 'en' ? 'This screen already uses the recovered live save contract.' : '이 화면은 실제 배포본에서 복구한 저장 구조를 그대로 사용합니다.'}</p>
          </div>
          <div class="discovery-stat">
            <span>${tr(language, '나의 도감')}</span>
            <strong>${discovered} / ${animals.length}</strong>
          </div>
        </section>

        <section class="menu-grid" aria-label="${tr(language, '선샤인 애니멀즈 주요 메뉴')}">
          ${menuCard('🥚', tr(language, '알 부화'), language === 'en' ? 'Forest Egg · Radiant Egg' : '숲의 알 · 빛나는 알', 'hatch')}
          ${menuCard('❓', tr(language, '동물 퀴즈'), language === 'en' ? 'Earn Light of Nature' : '정답을 맞혀 자연의 빛 획득', 'quiz')}
          ${menuCard('📖', tr(language, '나의 동물도감'), language === 'en' ? 'See discovered animals' : '발견한 동물 확인', 'book')}
          ${menuCard('🎉', tr(language, '애니멀 파티'), language === 'en' ? 'Match animal cards' : '같은 동물 카드 찾기', 'party')}
          ${menuCard('🛟', tr(language, '애니멀 구조대'), language === 'en' ? 'Rescue the target animal' : '목표 동물을 찾아 구조', 'rescue')}
          ${menuCard('📜', tr(language, '특별 퀘스트'), language === 'en' ? 'Track progress and rewards' : '진행도와 보상 확인', 'quests')}
        </section>

        <section class="status-card">
          <h3>${language === 'en' ? 'Recovered progress' : '복구된 진행 기록'}</h3>
          <div class="status-grid">
            ${statusItem(language === 'en' ? 'Quiz wins' : '퀴즈 정답', progress.quizWins)}
            ${statusItem(language === 'en' ? 'Explorations' : '탐험 횟수', progress.explorations)}
            ${statusItem(language === 'en' ? 'Party games' : '파티 플레이', progress.partyGames)}
            ${statusItem(language === 'en' ? 'Party best' : '파티 최고점수', progress.partyBest)}
          </div>
        </section>
      </main>
    </div>
  `;

  root.querySelector('[data-action="language"]')?.addEventListener('click', handlers.onToggleLanguage);
  root.querySelectorAll('[data-feature]').forEach((button) => {
    button.addEventListener('click', () => handlers.onFeature(button.dataset.feature));
  });
}

function menuCard(icon, title, description, feature) {
  return `<button class="menu-card" type="button" data-feature="${feature}">
    <span class="menu-icon">${icon}</span>
    <strong>${title}</strong>
    <small>${description}</small>
  </button>`;
}

function statusItem(label, value) {
  return `<div class="status-item"><span>${label}</span><strong>${Number(value) || 0}</strong></div>`;
}
