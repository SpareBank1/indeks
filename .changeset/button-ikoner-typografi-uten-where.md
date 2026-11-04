---
"@sb1/indeks-css": minor
---

Ingen `:where()` i Button, InteractiveIcon, Spinner, Tag, Icon, Surface og Heading (ADR-DS-009). Komponentene vinner nå over vertens elementregler, for eksempel `a { color }` på en lenke med `ix-button`. Utility-klasser på ytterste element vinner fortsatt, bortsett fra der en størrelse eller variant setter samme egenskap, for eksempel `font-size` på `.ix-heading[data-size]`.

Breaking: `--ix-message-icon-size` heter nå `--ii-message-icon-size` og er intern.
