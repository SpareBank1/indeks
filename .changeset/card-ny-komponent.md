---
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

Ny Card-komponent som erstatter den tidligere plassholderen. Card presenterer innhold og navigasjon i én klikkbar flate: hele kortet er én lenke (tittelen), og et navigasjonsikon viser intern (`arrow_forward`) eller ekstern (`open_in_new`) navigasjon.

- Varianter: `small` (med `appearance="default"` eller `"dashed"` og valgfri leading — ikon, ikon med bakgrunn eller illustrasjon), `large-vertical` og `large-horizontal` (med media, beskrivelse og tag).
- Ren HTML: `<div class="ix-card" data-variant="…">` med `.ix-card__link` inni `.ix-card__title`.
- React: `<Card href title subtitle variant … />`. Ved `external` er `externalLabel` påkrevd (skjult tekst, f.eks. «(åpnes i ny fane)»).

Den gamle Card-komponenten er fjernet. `children`, `chevronIcon`, `openInNewTab`, spacing-props og `Card.Action` finnes ikke lenger, og `href` og `title` er nå påkrevd. CSS-klassene `.ix-card--clickable` og `.ix-card__chevron` er fjernet. Bruk `Surface` (`<Surface border="default" radius="md">` / `.ix-surface`) der Card ble brukt som ren innholdsflate uten lenke.
