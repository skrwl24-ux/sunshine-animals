# Sunshine Animals live deployment recovery notes

Source checked: `Sunshine_Animals_Deploy_Original_2026-09-01` recovered from the live `chatgpt.site` deployment.

## Important source status

The recovered ZIP is a compiled frontend deployment, not the lost pre-build React/TypeScript repository. The readable project in this branch must therefore be reconstructed incrementally while the compiled deployment remains the compatibility reference.

## Storage contract recovered from the deployed bundle

Do not rename or reset these keys without an explicit migration:

- `animal-discovery-v3`: main progress JSON
- `sunshine-language`: `ko` or `en`
- `sunshine-party-nickname`: party leaderboard nickname
- `sunshine-party-player`: persistent player UUID used by party/rescue score APIs

### `animal-discovery-v3` fields

- `light`
- `owned`
- `behaviors`
- `traces`
- `quizWins`
- `explorations`
- `partyGames`
- `partyBest`
- `claimed`

Recovered defaults include Light of Nature `5`, owned `{ capybara: 1 }`, and behavior `{ "capy-rest": true }`.

## Language behavior

- `?lang=en` forces English.
- `?lang=ko` forces Korean in the reconstructed project.
- Without a query parameter, the saved `sunshine-language` preference is used.
- The deployed bundle contains Korean-to-English UI text mappings plus English animal metadata. Reconstruction should move these into explicit locale modules rather than DOM text replacement.

## Recovered gameplay constants

- Animal Party: 1 Light of Nature per 200 points.
- Animal Rescue: 1 Light of Nature per 500 points.
- Rescue timer: 30 seconds.
- Quiz correct answers add Light of Nature and quiz-win progress.

## Recovered hatching contract

- Forest Egg: 5 Light of Nature, one hatch.
- Radiant Egg: 10 Light of Nature, one hatch.
- 5 Forest Eggs: 25 Light of Nature.
- 5 Radiant Eggs: 50 Light of Nature.
- Forest single thresholds: `[45, 75, 93]` for Rare / Epic / Legendary.
- Radiant single thresholds: `[25, 55, 83]` for Rare / Epic / Legendary.
- Five-hatch thresholds: `[35, 65, 88]` for Rare / Epic / Legendary.
- Rolls below the first threshold are Common.
- Mythic animals are not directly selected by the recovered egg roll.
- `puffer` is excluded from normal egg rarity pools.
- Each hatch increments `explorations` and `owned[animalId]`, preserving duplicates.
- When Light of Nature is insufficient, the game offers Animal Quiz, Animal Party, and Animal Rescue.
- The deployed bundle applies a temporary quiz-related `+5` roll boost per boost unit. It is not persisted, so the readable engine keeps it as an optional runtime parameter only.

## Safety rule for reconstruction

1. Keep the original compiled deployment backup unchanged.
2. Rebuild one feature at a time in readable modules.
3. Verify storage compatibility before replacing a feature.
4. Verify Korean and English together.
5. Do not call the live site deployed until the actual deployment target has been updated and checked.
