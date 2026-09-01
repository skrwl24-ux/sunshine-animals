import { HATCH_OPTIONS, hatchMany, highestRarity } from './engine.js';
import { setProgress } from '../../app/state.js';

const ASSET_BASE='https://cute-animal-gacha.skrwl24.chatgpt.site';
let lastResult = null;
let lastOptionId = null;
let busy = false;

function text(language, ko, en) { return language === 'en' ? en : ko; }
function rarityLabel(language, rarity) {
  if (language !== 'en') return rarity;
  return ({ 일반:'Common', 희귀:'Rare', 특별:'Epic', 전설:'Legendary', 환상:'Mythic' })[rarity] || rarity;
}
function animalName(language, animal) { return language === 'en' && animal.nameEn ? animal.nameEn : animal.name; }
function animalVisual(animal, name) {
  return animal.image ? `<img src="${animal.image}" alt="${name}" loading="lazy" />` : `<div class="result-placeholder" aria-label="${name}">${animal.emoji || '🐾'}</div>`;
}
function optionButton(id, title, detail, image) {
  return `<button class="hatch-option" type="button" data-hatch="${id}"><img src="${image}" alt="" /><strong>${title}</strong><small>${detail}</small></button>`;
}
function eggAsset(kind){return `${ASSET_BASE}${kind==='radiant'?'/aurora-egg.png':'/forest-opal-egg.png'}`;}
function resultMarkup(language) {
  if (!lastResult || !lastOptionId) return '';
  const option = HATCH_OPTIONS[lastOptionId];
  const rarity = highestRarity(lastResult);
  return `<div class="hatch-results rarity-${rarity}">
    <h2>${option.count === 5 ? text(language,'알 5개 부화 완료!','Five Eggs Hatched!') : text(language,'알에서 동물 카드 발견!','Animal Card Discovered!')}</h2>
    <div class="result-grid">${lastResult.map(({ animal, duplicate }) => {
      const name = animalName(language, animal);
      return `<article class="result-card">${animalVisual(animal,name)}<span>${animal.emoji || '🐾'}</span><strong>${name}</strong><small>${rarityLabel(language,animal.rarity)} · ${duplicate ? text(language,'중복 카드 +1','Duplicate Card +1') : text(language,'새 동물!','New Animal!')}</small></article>`;
    }).join('')}</div>
    <button class="again-button" type="button" data-again>${text(language,option.count===5?'5개 다시 뽑기':'다시 뽑기',option.count===5?'Hatch 5 Again':'Hatch Again')}</button>
  </div>`;
}
export function clearHatchResult(){ lastResult=null; lastOptionId=null; busy=false; }

export function renderHatching(root,state,handlers){
  const language=state.language==='en'?'en':'ko'; const progress=state.progress;
  root.innerHTML=`<div class="feature-shell"><header class="feature-header"><button type="button" class="back-button" data-action="home">← ${text(language,'홈','Home')}</button><div class="resource-pill"><span>🌿</span><span>${text(language,'자연의 빛','Light of Nature')}</span><strong>${progress.light}</strong></div></header><section class="feature-title"><span>🥚</span><div><h1>${text(language,'알 부화','Hatch Eggs')}</h1><p>${text(language,'자연의 빛으로 새로운 동물 친구를 만나보세요.','Use Light of Nature to meet a new animal friend.')}</p></div></section><section class="hatch-grid">${optionButton('forest1',text(language,'숲의 알','Forest Egg'),text(language,'🌿 5개 · 1회 부화','🌿 5 · 1 hatch'),eggAsset('forest'))}${optionButton('radiant1',text(language,'빛나는 알','Radiant Egg'),text(language,'🌿 10개 · 희귀 확률 UP','🌿 10 · Higher rare chance'),eggAsset('radiant'))}${optionButton('forest5',text(language,'숲의 알 5회','5 Forest Eggs'),text(language,'🌿 25개 · 결과 5장','🌿 25 · 5 results'),eggAsset('forest'))}${optionButton('radiant5',text(language,'빛나는 알 5회','5 Radiant Eggs'),text(language,'🌿 50개 · 희귀 확률 UP','🌿 50 · Higher rare chance'),eggAsset('radiant'))}</section><div id="hatch-feedback" class="hatch-feedback">${resultMarkup(language)}</div></div>`;
  root.querySelector('[data-action="home"]')?.addEventListener('click',()=>{clearHatchResult();handlers.onHome();});
  root.querySelectorAll('[data-hatch]').forEach((button)=>button.addEventListener('click',()=>performHatch(root,state,button.dataset.hatch,handlers)));
  root.querySelector('[data-again]')?.addEventListener('click',()=>{const optionId=lastOptionId;clearHatchResult();performHatch(root,state,optionId,handlers);});
}

function performHatch(root,state,optionId,handlers){
  if(busy) return;
  const language=state.language==='en'?'en':'ko'; const option=HATCH_OPTIONS[optionId]; const progress=state.progress; const feedback=root.querySelector('#hatch-feedback');
  if(progress.light<option.cost){
    clearHatchResult(); const missing=option.cost-progress.light;
    feedback.innerHTML=`<div class="insufficient-light"><h2>${text(language,`자연의 빛이 ${missing}개 부족해요.`,`You need ${missing} more Light of Nature.`)}</h2><p>${text(language,'원하는 방법으로 자연의 빛을 더 모을 수 있어요.','Choose a way to earn more Light of Nature.')}</p><div class="light-choice-grid"><button type="button" data-earn="quiz">🧠 ${text(language,'동물 퀴즈 풀기','Play Animal Quiz')}</button><button type="button" data-earn="party">🎉 ${text(language,'애니멀 파티 하기','Play Animal Party')}</button><button type="button" data-earn="rescue">🛟 ${text(language,'애니멀 구조대 하기','Play Animal Rescue')}</button><button type="button" data-earn="back">↩ ${text(language,'돌아가기','Go Back')}</button></div></div>`;
    feedback.querySelectorAll('[data-earn]').forEach((button)=>button.addEventListener('click',()=>{const target=button.dataset.earn;if(target==='back'){feedback.innerHTML='';return;}handlers.onFeature(target);})); return;
  }
  busy=true; const eggImage=eggAsset(option.egg);
  feedback.innerHTML=`<div class="hatch-stage"><img src="${eggImage}" alt="${text(language,'부화 중인 알','Hatching egg')}"></div>`;
  const {owned,results}=hatchMany({egg:option.egg,count:option.count,owned:progress.owned});
  lastResult=results; lastOptionId=optionId;
  setTimeout(()=>{ busy=false; setProgress({light:progress.light-option.cost,owned,explorations:Number(progress.explorations||0)+option.count}); },900);
}
