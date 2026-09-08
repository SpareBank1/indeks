---
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
"@sb1/indeks-web": minor
---

Fjern «uten pil»-varianten av Popover — pilmarkøren vises nå alltid

**Breaking:** `arrow`-propen er fjernet fra `Popover` i `@sb1/indeks-react`, og attributtet `data-arrow="false"` på `<ix-popover>` har ingen effekt lenger. Fjern `arrow={false}` / `data-arrow="false"` fra kallene dine — popoveren får pil. Pilen er selve koblingen til trigger-elementet, og vi holder oss til én variant for konsistens.
