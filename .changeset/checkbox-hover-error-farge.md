---
"@sb1/indeks-css": patch
---

Fikser at hover-fargen på Checkbox forble blå (interaktiv) når checkboxen er i feil-tilstand (`aria-invalid="true"`), i stedet for å beholde den røde error-fargen.

**Rotårsak:** Den generelle hover-regelen for Checkbox har høyere CSS-spesifisitet (0,3,2) enn error-regelen (0,2,2), så hover overstyrte alltid boks/kant-fargen tilbake til blått uansett `aria-invalid`. Samme spesifisitetsfelle var allerede løst for RadioGroup og for CheckboxGroup sin chip-variant, men mangelen på et tilsvarende mønster på selve `.ix-checkbox` gjorde at feilen besto der.

**Fiksen:** Nye hover-ved-error-regler (for både uncheck og checked/indeterminate) med høyere spesifisitet enn de generelle hover-reglene, som speiler mønsteret i `radio-group.css` og `checkbox-group.css`.
