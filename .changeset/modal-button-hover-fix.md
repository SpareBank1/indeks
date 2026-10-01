---
"@sb1/indeks-css": patch
---

Fikser 1px-hopp på knapper i modal ved første hover i Chromium. Problemet skyldes at modal-animasjonens `scale()` trigger subpixel-artefakter når nettleseren oppretter GPU-lag ved hover. Løst ved å tvinge GPU-lag fra start med `transform: translateZ(0)` på elementer i `.ix-modal__button-group`.

Endrer også button fra `transition: all` til eksplisitte properties (`background-color`, `border-color`, `box-shadow`, `outline-color`, `opacity`) for bedre ytelse og forutsigbarhet.
