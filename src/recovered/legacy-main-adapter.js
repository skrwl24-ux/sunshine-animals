function slug(value) {
  return String(value || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

const ASSET_BASE = 'https://cute-animal-gacha.skrwl24.chatgpt.site';
const NAME_ALIASES = Object.freeze({
  '아기 코끼리':'코끼리','수리부엉이':'올빼미','흰점박이복어':'복어','세발가락나무늘보':'나무늘보','카피바라':'카피바라','금조':'금조','넓적부리황새':'넓적부리황새','유리개구리':'유리개구리','액솔로틀':'아홀로틀'
});

function fallbackRarity(index) {
  if (index >= 160) return '환상';
  if (index >= 145) return '전설';
  if (index >= 120) return '특별';
  if (index >= 80) return '희귀';
  return '일반';
}

function externalizeAsset(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${ASSET_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function enrichRecoveredAnimals(existingAnimals = []) {
  const source = globalThis.GAME_DATA?.animals || [];
  const byKo = new Map(source.map((row,index)=>[row[0],{row,index}]));
  return existingAnimals.map((animal)=>{
    const match = byKo.get(animal.name) || byKo.get(NAME_ALIASES[animal.name]);
    return {
      ...animal,
      image: externalizeAsset(animal.image),
      nameEn: animal.nameEn || match?.row?.[1] || '',
      mainIndex: match?.index,
    };
  });
}

export function legacyAnimalExpansion(existingAnimals = []) {
  const source = globalThis.GAME_DATA?.animals || [];
  const extraRarity = globalThis.GAME_DATA?.extraRarity || {};
  const normalizedExisting = new Set(existingAnimals.flatMap((animal)=>[animal.name, NAME_ALIASES[animal.name]].filter(Boolean)));
  const existingEn = new Set(existingAnimals.map((animal) => animal.nameEn).filter(Boolean));
  return source.flatMap((row, index) => {
    const [name, nameEn, emoji] = row;
    if (normalizedExisting.has(name) || existingEn.has(nameEn)) return [];
    const rarity = extraRarity[index] || fallbackRarity(index);
    return [{
      id: `main-${index}-${slug(nameEn) || index}`,
      name,
      nameEn,
      emoji: emoji || '🐾',
      rarity,
      image: '',
      habitat: '',
      habitatEn: '',
      fact: '',
      factEn: '',
      behaviors: [],
      source: 'main-game-data',
    }];
  });
}

export function legacyQuizExpansion(language, existingPool = []) {
  const source = globalThis.GAME_DATA?.quizzes || [];
  const existingQuestions = new Set(existingPool.map((item) => item.q));
  const isEn = language === 'en';
  return source.flatMap((row, index) => {
    const q = isEn ? row[1] : row[0];
    const answers = isEn ? row.slice(5,8) : row.slice(2,5);
    if (!q || answers.length < 3 || existingQuestions.has(q)) return [];
    return [{ q, a: answers, c: 0, why: '', type: 'choice', key: `${language}:main:${index}`, source: 'main-game-data' }];
  });
}
