---
"@sb1/indeks-css": patch
"@sb1/indeks-web": patch
---

Fikser at Checkbox mistet all tilstandsstyling (checked, indeterminate, feil, disabled, fokus) når den brukes med `description`, `errorMessage` eller `tooltip`. `<ix-field>` flyttet labelen bort fra inputen, så `input + label`-selektorene sluttet å treffe. Labelen blir nå stående, og tooltip-knappen legges rett etter den.
