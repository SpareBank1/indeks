---
"@sb1/indeks-css": minor
"@sb1/indeks-react": patch
---

Én hook per del og ingen `:where()` i skjemafeltene (ADR-DS-009): field, label, form, validation-message, text-field, text-area, select og phone-number-field.

Breaking: `ix-text-field__input`, `ix-text-area__textarea`, `ix-field--disabled` og `ix-field--readonly` er fjernet. Bruk `.ix-text-field > input`, `.ix-text-area > textarea` og `data-disabled`/`data-readonly` på `ix-field`. Klassene gjør ingen skade om de står igjen i markupen.
