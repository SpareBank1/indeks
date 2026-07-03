---
'@sb1/indeks-css': minor
'@sb1/indeks-react': minor
---

Ny komponent: Accordion

Accordion viser og skjuler innhold i seksjoner. Den bygger på native `<details>`/`<summary>`, så tastatur (Tab, Enter/Space) og skjermleser-semantikk (disclosure med åpen/lukket-tilstand) fungerer uten ekstra ARIA — og uten JavaScript.

- Ren CSS: ingen web-komponent. Seksjonene er uavhengige (flere kan stå åpne samtidig). Den myke åpne/lukke-animasjonen er en progressiv CSS-enhancement (`interpolate-size` + `::details-content`); nettlesere uten støtte hopper bare åpent/lukket, fortsatt fullt funksjonelt.
- React-laget er et tynt, compound-API: `Accordion` (en `<div class="ix-accordion">`) med `Accordion.Item` (→ `<details>`), `Accordion.Header` (→ `<summary>`) og `Accordion.Content`. `defaultOpen` på `Accordion.Item` speiler native `<details open>`.
- Fullt brukbar uten React via klassene `.ix-accordion`, `.ix-accordion__item`, `.ix-accordion__header` og `.ix-accordion__content` på native `<details>`/`<summary>`.
- Visuelle states (default, hover, active, focus, expanded) er definert; en chevron roterer for å vise tilstand, og animasjonen respekterer `prefers-reduced-motion`. Fokusring kun på header.
- Bevisst avvik fra akseptansekriteriene: header er `<summary>` framfor `<button aria-expanded aria-controls>`. Native disclosure oppfyller samme intensjon (fokuserbar knapp, Enter/Space, annonsert tilstand) uten eksplisitt aria-kobling, siden innholdet ligger inne i samme `<details>`. Dokumentert i tilgjengelighets-tabellen.
