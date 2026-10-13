---
"@sb1/indeks-css": patch
---

Endrer `transition: var(--ix-transition-all)` til eksplisitte transition-properties i alle komponenter. Dette gir bedre ytelse (nettleseren slipper å sjekke alle properties) og forutsigbarhet (unngår uventede animasjoner ved fremtidige CSS-endringer).
