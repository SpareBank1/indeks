---
"@sb1/indeks-web": minor
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

Legg til CheckboxGroup — en gruppe relaterte checkboxer der flere kan velges samtidig. Ny `<ix-checkbox-group>`-web component eier ARIA-limet (role=group, legend via `aria-labelledby`, description/error via `aria-describedby`, `aria-invalid` på host, id+`htmlFor`-kobling, disabled/readonly-propagering med per-knapp-bevaring og observer for dynamisk tilføyde valg). React via `<CheckboxGroup legend="…">` med `<CheckboxButton value="…" label="…">`; `value` er et array (flervalg). Bruker `role="group"` framfor `<fieldset>` for å unngå Safari-layoutbugger, på linje med RadioGroup. CSS via `ix-checkbox-group` (container/legend/description/error/items + disabled/readonly-tilstand); checkbox-itemene gjenbruker eksisterende `.ix-checkbox`-styling. Ingen hardkodet tekst — `legend`/`label` er påkrevde i18n-props.

Checkbox-CSS støtter nå også naken `<input type="checkbox">` inni `.ix-checkbox` — `.ix-checkbox__input`-klassen på inputen er valgfri (dual-targeting, som radio-group). Rettet samtidig en feil der deaktivert checkbox-label refererte et udefinert token (`--ix-color-foreground-main-readonly`); deaktiverte labels får nå korrekt dempet farge via `--ix-color-foreground-main-read-only`.

Checkbox-indikatoren tegnes nå med CSS-pseudo-elementer på `<label>` (boks + hake/strek via `mask-image`), togglet av nabo-kombinatoren `input:checked`/`:indeterminate` — samme modell som radio-group. Det dekorative `.ix-checkbox__box`-spanet er fjernet, og `.ix-checkbox__label`-spanet er erstattet av en ren `<label>` som søsken til inputen (`.ix-checkbox__label` beholdes som valgfri styling-hook). Strukturen er nå `<div class="ix-checkbox"><input type="checkbox"><label></label></div>`. Konsumenter som skrev egne `.ix-checkbox`-spans i håndskrevet HTML må oppdatere markupen til denne flate strukturen.
