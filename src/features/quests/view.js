import { quests } from '../../recovered/quests.js';
import { claimQuest, questClaimed, questComplete, questProgress } from './engine.js';
import { setProgress } from '../../app/state.js';

function text(language, ko, en) { return language === 'en' ? en : ko; }
function rewardText(language, reward) {
  if (reward.type === 'light') return `🌿 ${text(language,'자연의 빛','Light of Nature')} +${reward.amount}`;
  return `🐾 ${text(language,'동물 카드','Animal Card')}: ${reward.animalId}`;
}

export function renderQuests(root, state, handlers) {
  const language = state.language === 'en' ? 'en' : 'ko';
  root.innerHTML = `<div class="feature-shell">
    <header class="feature-header"><button class="back-button" data-home>← ${text(language,'홈','Home')}</button><div class="resource-pill">🌿 <span>${text(language,'자연의 빛','Light of Nature')}</span><strong>${state.progress.light}</strong></div></header>
    <section class="feature-title"><span>📜</span><div><h1>${text(language,'특별 퀘스트','Special Quests')}</h1><p>${text(language,'도전하고 게임 속 무료 보상을 받아보세요.','Complete challenges and claim free in-game rewards.')}</p></div></section>
    <section class="quest-list">${quests.map((quest) => {
      const value = questProgress(quest, state.progress);
      const complete = questComplete(quest, state.progress);
      const claimed = questClaimed(quest, state.progress);
      const title = language === 'en' ? quest.id.replace(/([A-Z])/g,' $1').replace(/^./, (m)=>m.toUpperCase()) : quest.titleKo;
      const goal = language === 'en' ? `${quest.metric}: ${quest.target}` : quest.goalKo;
      return `<article class="quest-card ${complete ? 'complete' : ''}"><div><span class="quest-kicker">${title}</span><h3>${goal}</h3><p>${Math.min(value, quest.target)} / ${quest.target}</p><div class="quest-progress"><i style="width:${Math.min(100,(value/quest.target)*100)}%"></i></div><small>${rewardText(language, quest.reward)}</small></div><button type="button" data-claim="${quest.id}" ${!complete || claimed ? 'disabled' : ''}>${claimed ? text(language,'보상 받음','Claimed') : text(language,'보상 받기','Claim Reward')}</button></article>`;
    }).join('')}</section>
    <p class="source-note">${text(language,'자연의 빛과 카드는 게임 속 무료 보상이며 현금 가치가 없습니다.','Light of Nature and cards are free in-game rewards with no cash value.')}</p>
  </div>`;
  root.querySelector('[data-home]')?.addEventListener('click', handlers.onHome);
  root.querySelectorAll('[data-claim]').forEach((button) => button.addEventListener('click', () => {
    const result = claimQuest(button.dataset.claim, state.progress);
    if (!result.claimed) return;
    setProgress(result.progress);
    handlers.onRefresh();
  }));
}
