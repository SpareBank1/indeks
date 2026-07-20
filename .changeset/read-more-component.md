---
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

Ny ReadMore-komponent — én frittstående vis/skjul-seksjon for utdypende, sekundær informasjon. Bygger på native `<details>`/`<summary>`, så tastatur, fokus og åpen/lukket-annonsering kommer gratis uten JavaScript eller ekstra ARIA. Til forskjell fra Accordion (en gruppe seksjoner) er ReadMore én enkelt seksjon med en venstrestilt label og chevron *foran* teksten.

- **CSS** (`@sb1/indeks-css`): `.ix-read-more` på `<details>` med `__label` (`<summary>`, chevron via `::before`) og `__content`. Hover/active-flate rundt labelen, `:focus-visible`-fokusring, 44 px touch-mål, og myk åpne/lukke-animasjon som progressiv forbedring (`::details-content` + `interpolate-size`) som respekterer `prefers-reduced-motion`.
- **React** (`@sb1/indeks-react`): `<ReadMore label="…" defaultOpen>…</ReadMore>` — en tynn `forwardRef`-wrapper over native `<details>`. `label` tar `ReactNode` (kan inneholde et prefiks-ikon), `children` er innholdet som avsløres, `defaultOpen` speiler `<details open>`. Ingen hardkodet tekst — all tekst sendes inn av konsumenten (i18n).
