---
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

Ny Row-komponent for informasjon, navigasjon og handlinger i lister. Raden har Leading, Content (tittel, subtitle og description), Trailing og navigasjonsikon, og alle unntatt tittelen kan utelates.

Hele raden kan være én lenke eller knapp (`href` eller `onClick` i React, `.ix-row__action` i HTML), eller være passiv med én kontroll i `trailingControl` (`.ix-row__control`). React-typene hindrer at de to kombineres. Router-lenker settes med `linkAs` og `linkProps`, og `titleId` lar en kontroll vise til raden med `aria-describedby`. `Row.Leading` gir ikon, ikon på flate med valgfritt badge-ikon, illustrasjon eller bilde, og `Row.TrailingLabel` gir verdi med subtitle eller Tag.
