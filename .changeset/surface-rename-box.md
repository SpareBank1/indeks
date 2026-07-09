---
"@sb1/indeks-utils": patch
"@sb1/indeks-css": patch
"@sb1/indeks-react": patch
---

Renamer `Box` til `Surface`, og ferdigstiller og dokumenterer komponenten. `Surface` er en enkel visuell flate for gruppering av innhold — bevisst enklere enn `Card` (ingen elevation eller klikk-affordanse), og bygget i sin helhet på utility-klasser med et godt React-API på toppen.

Nytt:

- **Statusfarge via `data-status`.** `.ix-surface` gir nå main-flaten alene, og statusfargene (`info`/`success`/`warning`/`danger`) settes med `data-status` i HTML og `status`-prop i React — samme status-system som `Message` (`--ix-color-status-*`). Erstatter den tidligere `surfaceColor`-propen / `.ix-color-surface-*`-klassene på flaten.
- **`radius`-prop** på `Surface` og tilhørende `ix-radius-*`-utility-klasser (`xs`/`sm`/`md`/`lg`/`xl`/`pill`/`circle`) i `@sb1/indeks-utils`, basert på de eksisterende border-radius-tokenene.
- **`direction`-prop** (`row`/`column`, standard `column`) for å legge innhold ved siden av hverandre uten egen CSS.

**Breaking:** `Box`-eksporten er fjernet fra `@sb1/indeks-react` — bruk `Surface` i stedet, og CSS-klassen `.ix-box` er erstattet av `.ix-surface`. `surfaceColor`-propen er byttet ut med `status` (`neutral`/`info`/`success`/`warning`/`danger`); `neutral` gir den nøytrale main-flaten.
