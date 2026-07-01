---
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

Card: statusfarge, stiplet kant og byttbart chevron-ikon.

- **`status`-prop** (`info`/`success`/`warning`/`danger`) gir statustema — farget fyll og
  kant — via `data-status`, samme system som `InteractiveIcon` og `Message`. Ett attributt
  setter hele det koherente uttrykket (fyll + kant + hover/active).
- **`border="dashed"`** gir stiplet kantlinje (`.ix-card--dashed`). Kort har fortsatt
  kantlinje som standard, uten ekstra klasser.
- **`chevronIcon`-prop** lar deg bytte affordanse-chevronen på klikkbart kort. Chevronen er
  nå et ekte `ix-icon` (klassen `.ix-card__chevron`) med `pil-hoyre` som standard, i stedet
  for et hardkodet tegn.

Chevron-varianter for sammenligning beholdes: `.ix-card--chevron-badge` (farget sirkel) og
`.ix-card--chevron-shadow` (skygge med løft).
