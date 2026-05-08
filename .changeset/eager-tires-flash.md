---
'@sb1/indeks-tokens': minor
'@sb1/indeks-utils': minor
'@sb1/indeks-css': minor
---

Inline `@sb1/indeks-tokens` og `@sb1/indeks-utils` i den bygde CSS-filen
(`dist/npm/index.css`). Konsumenter trenger nå kun å installere
`@sb1/indeks-css` — tokens og utils er ikke lenger separate
`dependencies`, men er bundlet inn i hoved-CSS-en.

Dette forenkler også oppsett av VSCode-autocomplete: peker man til
`node_modules/@sb1/indeks-css/dist/npm/index.css`, får man alle
klassenavn og CSS-variabler i én fil.

CDN-bygget er uendret — det beholder fortsatt `@import` mot
`cdn.sparebank1.no/indeks/tokens/<v>/index.css` og tilsvarende for utils
slik at nettleseren kan parallellaste og cache dem granulært.

Bundle-størrelsen for `@sb1/indeks-css`-npm-pakken øker fra ~21 KB til
~130 KB fordi tokens (~37 KB) og utils (~72 KB) nå inngår. Brotli-
komprimert leveranse i produksjon tar seg av størrelsen.
