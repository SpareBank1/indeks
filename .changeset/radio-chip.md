---
"@sb1/indeks-css": patch
"@sb1/indeks-react": patch
---

Legg til Radio chip — en gruppe chips der brukeren velger nøyaktig ett alternativ. Gjenbruker `ix-radio-group` (role=radiogroup, name-synkronisering, piltast-navigasjon og ARIA) med pill-styling via `data-variant="chip"` og sirkel-indikator (tom sirkel → fylt prikk + aksent på valgt). React via `<RadioGroup variant="chip" legend="…">` med `<RadioButton value="…" label="…">`. CSS via `ix-radio-group[data-variant="chip"]` (+ `data-size="sm"`). `RadioGroup` fikk `variant`/`size`-props. Ingen ny ARIA-logikk eller hardkodet tekst — `legend`/`label` er påkrevde i18n-props.
