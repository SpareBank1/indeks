---
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

Gjør klikkbart `Card` tydelig på touch. Tidligere signaliserte `.ix-card--clickable` klikkbarhet kun via `:hover`, som ikke finnes på mobil — et klikkbart kort så da identisk ut med et statisk. Nå bærer klikkbart kort affordansen i hviletilstand: permanent skygge (`--ix-card-shadow`) og en chevron, med pressed-feedback på `:active` og fokusring på `:focus-visible`. `prefers-reduced-motion` respekteres.

React-wrapperen `<Card>` rendrer nå et ekte semantisk element — `<a>` ved `href`, `<button>` ved `onClick`, ellers `<div>` — i stedet for en `<div>` med `role`/`onClick`/`window.location.href`. Dette gir korrekt rolle, tastaturstøtte og fokus gratis, og fjerner den tidligere `javascript:`-XSS-risikoen.
