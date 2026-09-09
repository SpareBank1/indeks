---
"@sb1/indeks-tokens": minor
"@sb1/indeks-utils": minor
---

Status-foreground-settet er fullført, og foreground er koblet inn i status-kaskaden.

**Nye tokens fra Figma.** `--ix-color-foreground-info-default` og `--ix-color-foreground-warning-default` finnes nå, i tillegg til `success` og `danger`. Lysmodus bruker `-600`-nivået, mørkmodus `-400` — samme nivå som de eksisterende. Util-klassene `ix-color-foreground-info-default` og `ix-color-foreground-warning-default` genereres automatisk.

**Ny variabel `--ix-color-status-foreground`.** Den settes av `[data-status]` sammen med resten av `--ix-color-status-*`, slik at en komponent kan hente tekst-/ikonfargen for sin status uten å velge token selv. Util-klassen `ix-color-status-foreground` leser den. `neutral` — og elementer uten `data-status` — får `foreground-main-default`, siden det ikke finnes en `foreground-neutral-*`.

**Merk hvor fargene er trygge.** De er kalibrert for vanlig bakgrunn (6.7–7.6:1 mot hvit) og for `status-surface` (5.4–6.5:1), men ikke for pastell-fyllet `fill-*-subtle`: der gir `info` 4.49:1 og `success` 4.36:1, som bryter WCAG 1.4.3 (4.5:1). Bruk `foreground-main-default` på subtle fyll. Kombinasjonen med `surface-*-active` er også stram (4.36–4.87:1).
