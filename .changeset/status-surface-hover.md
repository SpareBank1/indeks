---
'@sb1/indeks-utils': patch
---

Legg til hover- og active-trinn for status-`surface`

`data-status` kobler nå også `--ix-color-status-surface-hover` og
`--ix-color-status-surface-active` (med tilhørende
`.ix-color-status-surface-hover`- og `.ix-color-status-surface-active`-utilities)
for hver status, slik at komponenter kan bruke hover-/active-trinnet av
status-`surface` uten å mappe det selv. Additiv endring — eksisterende variabler
er uendret.
