---
"@sb1/indeks-css": minor
"@sb1/indeks-web": minor
---

Én hook per del og ingen `:where()` i radio-group (ADR-DS-009).

Breaking: `ix-radio-button`, `ix-radio-button__input` og `ix-radio-button__label` er fjernet. Radio styles bare inni `ix-radio-group` eller `.ix-radio-group`, og klassene gjør ingen skade i markupen. `ix-radio-group` finner labelen i inputens forelder.
