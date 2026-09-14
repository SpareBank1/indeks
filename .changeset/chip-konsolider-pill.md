---
"@sb1/indeks-css": patch
---

Samle chip-pillen i `components/chip.css`. Ingen visuell endring er tilsiktet — pillens form, størrelser, fyll, kant og tilstander er identiske før og etter.

Tidligere bygget `radio-group.css` og `checkbox-group.css` hver sin kopi av pillen, uten å bruke `.ix-chip`. Nå eier `chip.css` pillen for alle fire chip-typene, og gruppefilene beholder bare indikator-geometrien som faktisk er ulik (radio: ring + prikk, checkbox: boks + glyf).

For konsumenter som overstyrer chip-styling med egen CSS: selektorene for radio- og checkbox-chip har fått ett klassenivå mer spesifisitet (`[data-variant='chip']` ligger utenfor `:where()`), så en overstyring kan trenge én klasse mer for å vinne.
