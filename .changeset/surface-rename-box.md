---
"@sb1/indeks-utils": minor
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

Renamer `Box` til `Surface`, og ferdigstiller og dokumenterer komponenten. `Surface` er en enkel visuell flate for gruppering av innhold — bevisst enklere enn `Card` (ingen elevation eller klikk-affordanse), og bygget i sin helhet på utility-klasser med et godt React-API på toppen.

Nytt: `radius`-prop på `Surface` og tilhørende `ix-radius-*`-utility-klasser (`xs`/`sm`/`md`/`lg`/`xl`/`pill`/`circle`) i `@sb1/indeks-utils`, basert på de eksisterende border-radius-tokenene.

**Breaking:** `Box`-eksporten er fjernet fra `@sb1/indeks-react`. Bruk `Surface` i stedet — API-et er det samme, med tillegg av `radius`-prop. CSS-klassen `.ix-box` er erstattet av `.ix-surface`.
