---
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

Tag er redesignet til å bruke `data-status`-farge-kaskaden (samme mønster som Message, ProgressBar m.fl.) i stedet for BEM-modifikatorer. Farge velges nå med `data-status` (`neutral | info | success | warning | danger`), visuell profil med `data-variant` (`emphasis | subtle`) og størrelse med `data-size` (`sm | lg`). I React er dette henholdsvis `variant`-, `type`- og `size`-props. Emphasis bruker invers tekst på mettet flate; subtle bruker mørk tekst på pastell-flate med farget border — begge profiler verifisert mot WCAG 1.4.3 (4.5:1). Tag er nå polymorf via `as`-prop (Aksel `OverridableComponent`-mønster) slik at den kan rendres som f.eks. `<a>` eller `<button>` ved behov.
