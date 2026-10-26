---
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
"@sb1/indeks-web": minor
---

Én hook per del og ingen `:where()` i checkbox, checkbox-group, chip og modal (ADR-DS-009).

Breaking: `ix-checkbox--disabled` er fjernet. Bruk `disabled` på inputen. `ix-checkbox__input` og `ix-checkbox__label` styles ikke lenger, men gjør ingen skade i markupen.
