---
"@sb1/indeks-css": patch
"@sb1/indeks-react": patch
---

Fikser chevron-ikonet i Select som hadde feil farge i dark mode. Ikonet bruker nå CSS mask i stedet for background-image, slik at fargen følger `currentColor` og oppdateres korrekt ved bytte av fargemodus.

**HTML-brukere:** Select må nå wrappes i `<div class="ix-select-wrapper">` for at chevron-ikonet skal vises.
