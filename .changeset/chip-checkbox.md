---
"@sb1/indeks-css": patch
"@sb1/indeks-react": patch
---

Legg til Checkbox chip — en gruppe chips der brukeren kan velge ett eller flere alternativer samtidig. Gjenbruker `ix-checkbox-group` (role=group, name-propagering, htmlFor-kobling og ARIA) med pill-styling via `data-variant="chip"` og firkant-indikator (tom firkant → fylt med hake + aksent på valgt). React via `<CheckboxGroup variant="chip" legend="…">` med `<CheckboxButton value="…" label="…">` (`value` er et array — flervalg). CSS via `ix-checkbox-group[data-variant="chip"]` (+ `data-size="sm"`). `CheckboxGroup` fikk `variant`/`size`-props som chip-wrapperne låser. Ingen ny ARIA-logikk eller hardkodet tekst — `legend`/`label` er påkrevde i18n-props.
