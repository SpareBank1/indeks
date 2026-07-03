---
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

Gjør det tydelig at et `Card` er klikkbart, også på touch. Før viste `.ix-card--clickable` at kortet var klikkbart kun ved `:hover` — men hover finnes ikke på mobil, så et klikkbart kort så helt likt ut som et statisk. Nå har klikkbart kort alltid en synlig chevron som viser at det kan trykkes. Kortet er flatt (ingen skygge): `:hover` gir en bakgrunnstone, `:active` viser at kortet trykkes (viktig på touch, der `:hover` mangler), og `:focus-visible` gir en fokusring. Hover-overgangen er konsistent for alle klikkbare varianter — også `<a>` — uavhengig av global anker-styling (f.eks. en `a { transition: color }`-regel fra en CSS-reset). `prefers-reduced-motion` respekteres.

React-wrapperen `<Card>` rendrer nå et ekte semantisk element — `<a>` ved `href`, `<button>` ved `onClick`, ellers `<div>` — i stedet for en `<div>` med `role`/`onClick`/`window.location.href`. Dette gir korrekt rolle, tastaturstøtte og fokus gratis, og fjerner den tidligere `javascript:`-XSS-risikoen.
