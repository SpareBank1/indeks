---
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
"@sb1/indeks-web": minor
---

Prototype, ikke for release: én hook per del og ingen `:where()` i checkbox, checkbox-group, chip, card og modal.

Breaking: `ix-checkbox--disabled` og `ix-card--clickable` er fjernet. Bruk `disabled` på inputen og `data-clickable` på kortet. `ix-checkbox__input` og `ix-checkbox__label` styles ikke lenger, men gjør ingen skade i markupen.
