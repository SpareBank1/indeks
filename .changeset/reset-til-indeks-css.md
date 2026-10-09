---
'@sb1/indeks-utils': minor
'@sb1/indeks-css': minor
---

Resetten er flyttet fra `@sb1/indeks-utils` til `@sb1/indeks-css`, og utilities lastes nå etter komponentene. Utility-klasser kan dermed overstyre komponentene. Bruker du `@sb1/indeks-utils` alene, får du ikke lenger resetten.

CDN-fila `index.css` er nå en liste med imports: tokens, `components.css` og utils. URL-en er den samme som før.
