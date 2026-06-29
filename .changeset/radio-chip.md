---
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

Legg til Radio chip — en gruppe chips der brukeren velger nøyaktig ett alternativ. Gjenbruker `ix-radio-group` (role=radiogroup, name-synkronisering, piltast-navigasjon og ARIA) med pill-styling via `data-variant="chip"` og sirkel-indikator (tom sirkel → fylt prikk + aksent på valgt). React via `<RadioChipGroup legend="…">` med `<RadioChip value="…" label="…">`. CSS via `ix-radio-group[data-variant="chip"]` (+ `data-size="sm"`). Ingen ny ARIA-logikk eller hardkodet tekst — `legend`/`label` er påkrevde i18n-props.
