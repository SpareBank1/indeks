---
"@sb1/indeks-css": patch
---

Juster farger på valgt tilstand for alle chip-varianter etter design:

- Kant på valgt chip bruker nå `--ix-color-component-button-secondary-border-*` i stedet for `--ix-color-fill-main-default`.
- Valgt chip beholder aksentfargen i hover og active (`--ix-color-fill-main-subtle-hover` / `-active`) — tidligere falt en valgt radio- eller checkbox-chip tilbake til nøytralt fyll ved hover.
- Removable chip går fra fylt aksentfarge med lys tekst til samme lyse aksent-fyll som radio- og checkbox-chip. Dette gjelder også chips i multiselect-combobox, som gjenbruker `.ix-chip[data-removable]`.
