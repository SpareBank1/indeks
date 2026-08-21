---
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

Ny komponent: Pagination

Pagination brukes for å dele inn større mengder innhold i flere sider og gjøre det enklere å navigere mellom dem. Komponenten viser sidetall, forrige/neste-knapper og ellipsis ved mange sider.

**CSS-klasser:**
- `.ix-pagination` — rot-nav-element
- `.ix-pagination__list` — liste med knapper
- `.ix-pagination__button` — sideknapp
- `.ix-pagination__ellipsis` — ellipsis-element

**React-komponent:**
- `<Pagination>` med props for `page`, `count`, `onPageChange`, `siblingCount`, `boundaryCount`, `prevNextTexts`, og i18n-labels
