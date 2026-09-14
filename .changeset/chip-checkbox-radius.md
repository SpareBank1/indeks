---
"@sb1/indeks-css": patch
---

Checkbox chip er ikke lenger pilleformet. Etter design-spec bytter den til `--ix-border-radius-sm` (8px), mens radio chip beholder `--ix-border-radius-pill`. De tre andre chip-variantene er urørt.

Radien går nå via en intern variabel, `--ii-chip-radius`, som leses både av den passive regelen og av focus-regelen for gruppe-armene. Uten den kunne en fokusert checkbox chip fått pille-radius tilbake.
