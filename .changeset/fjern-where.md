---
'@sb1/indeks-css': minor
---

Komponent-CSS-en bruker ikke lenger `:where()` rundt komponentens egen klasse. Komponentene vinner nå over vertens elementregler, som `a {}` og `h2 {}` i Docusaurus. Varianter og tilstander har høyere spesifisitet enn basisregelen.

Overstyrer du en komponent med én klasse, virker det fortsatt for basisregelen. For varianter og tilstander må du bruke samme selektor som indeks, eller tokens. Se ADR-DS-009.
