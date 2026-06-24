---
'@sb1/indeks-css': minor
---

Ny `data-badge`-variant på `ix-icon`

`<ix-icon data-badge>` rendrer ikonet som en badge — en glyf på en farget sirkel.
Selve elementet blir sirkelen, og glyfen flyttes til `::before` (to paint-lag fordi
ett `mask-image` kun gir ett lag). Variabler for tilpasning:
`--ix-icon-badge-background` (sirkel, default `currentColor`),
`--ix-icon-badge-foreground` (glyf, default `--ix-color-foreground-inverse-default`),
`--ix-icon-badge-size` (default 32px) og `--ix-icon-badge-glyph-size`
(default `--ix-font-size-lg`). Glyfen leser `--ii-icon-url`, så badgen virker både
navn/web-component-drevet og rent CSS-drevet. Settes `data-status` på elementet,
bruker sirkelen statusfargen (`--ix-color-status-fill`) automatisk.
