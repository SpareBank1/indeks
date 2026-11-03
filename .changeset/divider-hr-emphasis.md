---
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

Divider rendres nå som `<hr>` og har fått varianten Emphasis (`variant="emphasis"` i React, `data-variant="emphasis"` i HTML) for et tydeligere skille. `.ix-divider` tegner streken med `border-top` og nullstiller resten av kanten, så den gir én strek også på `<hr>`.

Migrering: Divider tar ikke lenger barn, og `size` er fjernet fordi den ikke gjorde noe. Bruker du `<Divider>` med innhold, flytt innholdet ut. Trenger du et annet element enn `<hr>`, bruk `as`. Elementet får da `role="separator"`.
