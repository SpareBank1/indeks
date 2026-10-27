---
"@sb1/indeks-css": minor
---

Ingen `:where()` i dropdown-menu, message, pagination, popover og progress-bar (ADR-DS-009). Delene har samme BEM-klasser som før, men reglene har nå spesifisitet over 0, så de vinner over vertens elementregler.
