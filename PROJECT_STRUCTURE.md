# Sunshine Animals readable project structure

This branch is a safe reconstruction workspace for the recovered live deployment.

## Ground truth

The attached `Sunshine_Animals_Deploy_Original_2026-09-01` archive is a compiled live-deployment backup, not the lost pre-build React/TypeScript source repository. Data in `src/recovered/` was extracted from that deployed JavaScript bundle without filling missing content from general knowledge.

## Current structure

- `legacy/` — preserved simple repository version used before the live ZIP was audited.
- `src/core/config.js` — live storage keys and stable constants.
- `src/core/storage.js` — non-destructive compatibility layer for existing browser saves.
- `src/core/i18n.js` — hand-maintained readable i18n helpers; recovered dictionary lives separately.
- `src/recovered/animals/` — 65 animals recovered from the live bundle and split by rarity.
- `src/recovered/quizzes.js` — recovered Korean/English quiz banks.
- `src/recovered/quests.js` — recovered quest conditions and rewards.
- `src/recovered/progression.js` — rarity style, stars, duplicate-card upgrade rules, signature moments and premium assets.
- `src/recovered/translations.js` — recovered Korean→English UI dictionary.
- `tests/storage-compatibility.test.mjs` — save-format regression contract.
- `tests/recovered-data.test.mjs` — recovered data counts and unique-ID audit.

## Audited recovered counts

- Animals: 65 total = 22 Common + 17 Rare + 14 Epic + 10 Legendary + 2 Mythic.
- Korean quizzes: 44 = 16 choice + 14 OX + 14 close-up.
- English quizzes: 24 = 8 choice + 8 OX + 8 close-up.
- Quests: 7.
- Duplicate-card upgrade tiers: 4.

The Korean and English quiz banks are not the same size in the recovered deployment. Do not silently invent translations to equalize them; complete English coverage only as an explicit future content update.

## Save compatibility

Preserve these existing live keys:

- `animal-discovery-v3`
- `sunshine-language`
- `sunshine-party-nickname`
- `sunshine-party-player`

Inside `animal-discovery-v3`, preserve at least `light`, `owned`, `behaviors`, `traces`, `quizWins`, `explorations`, `partyGames`, `partyBest`, and `claimed`.

## Next reconstruction step

Rebuild the user-facing code by feature, importing only from `src/recovered/` and `src/core/`:

1. shared app shell / language switch / Light of Nature balance
2. hatch flow
3. collection / animal detail
4. quiz engine
5. Animal Party
6. Animal Rescue
7. quests and duplicate-card progression

Do not merge to `main` or claim deployment until regression checks pass and the actual deployment target is available and verified.
