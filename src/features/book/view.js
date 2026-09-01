import { BOOK_FILTERS, findAnimal, getBookAnimals, getBookStats } from './engine.js';

let activeFilter = 'all';
const rarityEn = Object.freeze({ 일반:'Common', 희귀:'Rare', 특별:'Epic', 전설:'Legendary', 환상:'Mythic' });
function text(language, ko, en) { return language === 'en' ? en : ko; }
function rarityName(language, rarity) { return language === 'en' ? (rarityEn[rarity] || rarity) : rarity; }
function animalName(language, animal) { return language === 'en' && animal.nameEn ? animal.nameEn : animal.name; }
function imageMarkup(animal, name, className='book-image') {
  return animal.image ? `<img class="${className}" src="${animal.image}" alt="${name}" loading="lazy" />` : `<div class="${className} silhouette" aria-label="${name}">${animal.emoji || '🐾'}</div>`;
}

export function renderBook(root, state, handlers) {
  const language = state.language === 'en' ? 'en' : 'ko';
  const stats = getBookStats(state.progress.owned);
  const items = getBookAnimals({ owned: state.progress.owned, filter: activeFilter });
  root.innerHTML = `<div class="feature-shell"><header class="feature-header"><button type="button" class="back-button" data-action="home">← ${text(language,'홈','Home')}</button><div class="resource-pill"><span>📖</span><span>${text(language,'발견','Discovered')}</span><strong>${stats.discovered}/${stats.total}</strong></div></header><section class="feature-title"><span>📖</span><div><h1>${text(language,'나의 동물도감','My Animal Collection')}</h1><p>${text(language,'발견한 동물과 중복 카드 수를 확인하세요.','See discovered animals and duplicate card counts.')}</p></div></section><div class="book-filters">${BOOK_FILTERS.map((filter)=>`<button type="button" data-filter="${filter}" class="${activeFilter===filter?'active':''}">${filter==='all'?text(language,'전체','All'):rarityName(language,filter)}</button>`).join('')}</div><section class="book-grid">${items.map((animal)=>renderCard(animal,language)).join('')}</section><div id="book-detail"></div></div>`;
  root.querySelector('[data-action="home"]')?.addEventListener('click', handlers.onHome);
  root.querySelectorAll('[data-filter]').forEach((button)=>button.addEventListener('click',()=>{activeFilter=button.dataset.filter;handlers.onRefresh();}));
  root.querySelectorAll('[data-animal]').forEach((button)=>button.addEventListener('click',()=>{const animal=findAnimal(button.dataset.animal);if(animal)renderDetail(root.querySelector('#book-detail'),animal,state.progress.owned?.[animal.id]||0,language);}));
}

function renderCard(animal, language) {
  if (!animal.discovered) return `<button type="button" class="book-card locked" aria-label="${text(language,'아직 발견하지 못한 동물','Undiscovered animal')}" disabled><div class="book-image silhouette">${animal.emoji||'🐾'}</div><strong>???</strong><small>${rarityName(language,animal.rarity)}</small><span>🔒</span></button>`;
  const name=animalName(language,animal);
  return `<button type="button" class="book-card rarity-${animal.rarity}" data-animal="${animal.id}">${imageMarkup(animal,name)}<strong>${name}</strong><small>${rarityName(language,animal.rarity)}</small><span class="duplicate-count">×${animal.count}</span></button>`;
}

function renderDetail(target, animal, count, language) {
  const name=animalName(language,animal);
  const habitat=language==='en'?(animal.habitatEn||animal.habitat):(animal.habitat||'');
  const fact=language==='en'?(animal.factEn||animal.fact):(animal.fact||'');
  target.innerHTML=`<div class="book-modal" role="dialog" aria-modal="true"><div class="book-dialog"><button type="button" class="close-detail" aria-label="${text(language,'닫기','Close')}">×</button>${imageMarkup(animal,name,'book-image')}<div><p class="eyebrow">${rarityName(language,animal.rarity)}</p><h2>${name}</h2><p><strong>${text(language,'보유 수','Copies')}:</strong> ${count}</p><p><strong>${text(language,'서식지','Habitat')}:</strong> ${habitat||text(language,'정보 없음','Not recovered')}</p><p>${fact||text(language,'설명 정보가 아직 복구되지 않았어요.','Detailed metadata has not been recovered yet.')}</p>${Array.isArray(animal.behaviors)&&animal.behaviors.length?`<h3>${text(language,'행동','Behaviors')}</h3><ul>${animal.behaviors.map((b)=>`<li><strong>${b.name}</strong> — ${b.fact||''}</li>`).join('')}</ul>`:''}${language==='en'&&(!animal.habitatEn||!animal.factEn)?'<p class="source-note">The English animal name was recovered where available. Some habitat, fact, and behavior text exists only in the recovered Korean deployment data, so it is shown without inventing unsupported source text.</p>':''}</div></div></div>`;
  target.querySelector('.close-detail')?.addEventListener('click',()=>{target.innerHTML='';});
  target.querySelector('.book-modal')?.addEventListener('click',(event)=>{if(event.target.classList.contains('book-modal'))target.innerHTML='';});
}
export function resetBookFilter(){activeFilter='all';}
