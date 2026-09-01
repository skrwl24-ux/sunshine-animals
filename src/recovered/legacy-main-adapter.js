function slug(value) {
  return String(value || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

function fallbackRarity(index) {
  if (index >= 160) return '환상';
  if (index >= 145) return '전설';
  if (index >= 120) return '특별';
  if (index >= 80) return '희귀';
  return '일반';
}

export function legacyAnimalExpansion(existingAnimals = []) {
  const source = globalThis.GAME_DATA?.animals || [];
  const extraRarity = globalThis.GAME_DATA?.extraRarity || {};
  const existingKo = new Set(existingAnimals.map((animal) => animal.name));
  const existingEn = new Set(existingAnimals.map((animal) => animal.nameEn).filter(Boolean));
  return source.flatMap((row, index) => {
    const [name, nameEn, emoji] = row;
    if (existingKo.has(name) || existingEn.has(nameEn)) return [];
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
