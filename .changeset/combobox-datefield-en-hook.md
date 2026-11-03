---
"@sb1/indeks-css": minor
"@sb1/indeks-web": patch
---

Én hook per del og ingen `:where()` i combobox og date-field (ADR-DS-009).

Breaking: chips-wrapperen i combobox styles fra `data-field="chips"`, ikke `ix-combobox__chips`. Toggle, listbox og option styles bare fra BEM-klassene, ikke fra `role` eller `.ix-text-field > button`. `ix-combobox` finner inputen med `.ix-text-field > input`.
