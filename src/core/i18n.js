export const TEXT = Object.freeze({
  ko: {
    light: '자연의 빛',
    forestEgg: '숲의 알',
    radiantEgg: '빛나는 알',
    discoveryBook: '동물도감',
    animalParty: '애니멀 파티',
    animalRescue: '애니멀 구조대',
    specialQuests: '특별 퀘스트',
    rescueSuccess: '구조 성공!',
    rescueFailed: '구조 실패!',
  },
  en: {
    light: 'Light of Nature',
    forestEgg: 'Forest Egg',
    radiantEgg: 'Radiant Egg',
    discoveryBook: 'My Discovery Book',
    animalParty: 'Animal Party',
    animalRescue: 'Animal Rescue',
    specialQuests: 'Special Quests',
    rescueSuccess: 'Rescue Success!',
    rescueFailed: 'Rescue Failed!',
  },
});

export function t(language, key) {
  const lang = language === 'en' ? 'en' : 'ko';
  return TEXT[lang][key] ?? key;
}

export function bilingual(ko, en) {
  return { ko, en };
}
