---
"@sb1/indeks-css": patch
---

Ny release av `@sb1/indeks-css`, `@sb1/indeks-web` og `@sb1/indeks-react` (fixed-gruppen) slik at taggene deres peker på en commit som inneholder `tsc`-fiksen fra `@sb1/indeks-tokens@0.8.1`. Taggene for 0.18.0 peker på en commit der `build:types` feilet (`sh: 1: tsc: not found`), noe som gjør at CDN-sync ikke klarer å bygge dem. Ingen endring i publisert output.
