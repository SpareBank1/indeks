---
"@sb1/indeks-css": patch
"@sb1/indeks-web": patch
---

Fikser at Checkbox mister all tilstandsstyling (checked, indeterminate, aria-invalid, disabled, focus-visible) når den brukes med `description`, `errorMessage` eller `tooltip`.

**Rotårsak:** Checkbox sin CSS styler tilstander via nabokombinatoren `input + label`, som krever at `<label>` er en direkte, adjacent søster av `<input>`. `IxField._wire()` flyttet ubetinget enhver `<label>` inn i en nyopprettet `.ix-field__label-row`-div — også Checkbox sin egen label, som allerede lå riktig plassert som søster av input. Etter flyttingen matchet ikke lenger `input + label`-selektorene, og boks/hake/strek/feil-ramme/disabled-opasitet/fokus-ring sluttet å tegnes.

**Fiksen:**
- `IxField._wire()` lar nå en label som allerede er kontrollens adjacent søsken (Checkbox sitt mønster) stå urørt, i stedet for å flytte den inn i en label-row.
- `IxField._setupTooltipBtn()` setter i dette tilfellet tooltip-knappen inn som labelens neste søsken (ikke i en label-row), slik at `input + label`-koblingen forblir intakt.
- `.ix-checkbox` er endret fra kolonne- til rad-layout (med `label { flex: 1 1 auto }`) slik at en eventuell tooltip-knapp lander på samme linje som label-teksten, og checkbox-labelens klikkeflate fortsatt fyller tilgjengelig bredde.
