---
'@sb1/indeks-css': patch
'@sb1/indeks-react': minor
---

Chip: feiltilstand og skrivebeskyttet for alle fire chip-varianter

Etter design-spec. Skrevet én gang i `chip.css` og gjelder derfor button chip, removable chip, radio chip og checkbox chip likt.

- **Feil, uvalgt**: rød kant (`border-danger-default`). Den visuelle 2px-kanten lages med 1px `border-color` + `inset box-shadow`, samme oppskrift som TextField, TextArea, Select og Checkbox, slik at kanten ikke reflower chip-raden når validering slår inn.
- **Feil, valgt**: `fill-danger-default` med `foreground-inverse-default` på tekst og indikator. Kanten kollapses til fyllfargen. Hover og active bruker `-hover`/`-active`-variantene.
- **Skrivebeskyttet**: `fill-interactive-read-only`, `border-main-default` og `foreground-main-read-only` — samme grå flate for valgt og uvalgt. Nedtonet fyll, ikke `opacity`.

Tilstanden kan komme fra chipen selv, fra gruppen (`ix-radio-group`/`ix-checkbox-group` med `data-variant="chip"`) eller fra en multiselect-combobox i feil/skrivebeskyttet tilstand — chipene arver feltets `data-state` uten at du setter noe på dem.

`Chip` og `RemovableChip` får to nye props: `error` og `readOnly`. `readOnly` setter `aria-disabled` og kortslutter `onClick`/`onRemove`, siden en `<button>` ikke har native read-only.

Kjent avvik dokumentert som issue i tilgjengelighetstabellen: `--ix-color-border-danger-default` gir ca. 2,5:1 mot hvitt, under 3:1 i SC 1.4.11. Tokenet er hus-standard for feilkant i fem komponenter og gjennomgås samlet.
