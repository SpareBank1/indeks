# @sb1/indeks-web

Web components for Indeks designsystemet. Komponenter som fungerer i alle rammeverk — og uten rammeverk.

## 📦 Del av Indeks

Denne pakken er en del av [Indeks designsystemet](https://github.com/SpareBank1/indeks). Komponentene bruker CSS-klasser fra `@sb1/indeks-css`, som må lastes separat.

## 📥 Installasjon

### Via CDN (anbefalt)

```html
<!-- Last inn CSS -->
<link rel="stylesheet" href="https://cdn.sparebank1.no/indeks/css/<versjon>.css" />

<!-- Last inn og registrer web components -->
<script type="module" src="https://cdn.sparebank1.no/indeks/web/<versjon>/index.js"></script>
```

Etter at scriptet er lastet inn er alle komponenter tilgjengelige som HTML-elementer:

```html
<ix-field>
    <label>E-postadresse</label>
    <input type="email" name="email" />
    <span data-field="error"></span>
</ix-field>
```

### Via npm

```bash
npm install @sb1/indeks-web @sb1/indeks-css
```

```js
import '@sb1/indeks-css';
import '@sb1/indeks-web'; // registrerer alle custom elements
```

---

## 🧩 Bidra — lage nye web components

### Når hører noe hjemme i `indeks-web`?

En komponent hører hjemme her når **begge** disse er sanne:

1. **Rammeverk-agnostisk behov** — komponenten skal fungere i prosjekter som ikke bruker React, f.eks. Vue, Angular, vanilla JS eller server-rendered HTML.

2. **Ingen god native HTML-ekvivalent** — behovet kan ikke løses ved å bare legge CSS-klasser på et eksisterende HTML-element. Det mangler enten et passende element, eller koblingen mellom flere elementer er kompleks nok til at en komponent gir reell verdi.

Dersom behovet kun finnes i React-kontekst, hører komponenten hjemme i `indeks-react`. Dersom styling alene er nok, er en CSS-klasse i `indeks-css` riktig nivå.

---

### Designprinsipper

#### Enhance, ikke erstatt native HTML

Web components i denne pakken wrapper eller kobler native HTML-elementer — de erstatter dem ikke. Det betyr at:

- Nettleserens native atferd (validering, fokushåndtering, form-tilstand) forblir intakt.
- Alle native attributter (`required`, `disabled`, `name`, `value`, osv.) settes direkte på det native elementet av forfatteren.
- Komponenten bidrar med det som mangler: ARIA-koblinger, reaktiv tilstand, og koordinering mellom flere elementer.

#### Light DOM — ikke Shadow DOM

Komponentene bruker ikke Shadow DOM. Årsaken er todelt:

- CSS fra `@sb1/indeks-css` må nå inn til alle delelementer uten at forfatteren trenger å konfigurere noe.
- ARIA-attributter som `aria-describedby` og `aria-labelledby` refererer til IDer. Disse IDene må eksistere i det samme DOM-treet som elementene de kobler — noe Shadow DOM bryter.

#### `data-[komponent]="rolle"` som slot-konvensjon

Siden Shadow DOM-slots ikke brukes, identifiserer komponenter delelementer via `data-`-attributter:

```
data-[komponentnavn]="rolle"
```

For en komponent som heter `IxField` (`ix-field`) ser det slik ut:

```html
<ix-field>
    <label>Navn</label>
    <span data-field="description">Fullt navn som det står i passet</span>
    <input type="text" name="name" />
    <span data-field="error"></span>
</ix-field>
```

Bruk `slot`-attributtet til Shadow DOM-innhold er et reservert nøkkelord knytt til Shadow DOM. `data-[komponent]` er eksplisitt egendefinert og kolliderer ikke med noe nettleser-API.

---

### Slik lager du en ny komponent

#### 1. Filstruktur

```
lib/
└── components/
    └── [navn]/
        └── Ix[Navn].ts
```

Eksempel for en ny `IxTooltip`:

```
lib/
└── components/
    └── tooltip/
        └── IxTooltip.ts
```

#### 2. Klassen

Extend `HTMLElement` direkte. Ikke bruk basisklasser eller hjelpefunksjoner med mindre det er et dokumentert mønster i pakken.

```ts
export class IxTooltip extends HTMLElement {
    connectedCallback(): void {
        // Sett opp koblingene her
    }

    disconnectedCallback(): void {
        // Rydd opp observers og event listeners her
    }
}
```

`connectedCallback` kalles når elementet kobles til DOM. `disconnectedCallback` kalles når det fjernes — rydd alltid opp `MutationObserver`, `ResizeObserver` og event listeners her for å unngå minnelekkasje.

#### 3. Registrer i `index.ts`

```ts
// index.ts
import { IxTooltip } from './lib/components/tooltip/IxTooltip.js';

customElements.define('ix-tooltip', IxTooltip);

export { IxTooltip };
```

Navnekonvensjon: klassen heter `Ix[PascalCase]`, custom element-taggen heter `ix-[kebab-case]`.

---

### CSS

Komponenter skal bruke eksisterende CSS-klasser fra `@sb1/indeks-css`. Ikke bundle CSS inn i JS-en, og ikke skriv komponent-spesifikk CSS i denne pakken — CSS-en hører hjemme i `indeks-css`.

Legg til CSS-klasser på elementer i `connectedCallback`:

```ts
this.classList.add('ix-input-wrapper');
```

---

### Bygg og verifiser

```bash
# npm-bygg (med TypeScript-typer)
pnpm --filter @sb1/indeks-web build

# CDN-bygg (minifisert, self-contained bundle)
pnpm --filter @sb1/indeks-web build:cdn
```

`build` produserer `dist/npm/index.js` og `dist/npm/index.d.ts`.
`build:cdn` produserer `dist/cdn/index.js` — en minifisert ESM-bundle klar for opplasting til CDN.

---

## 🔗 Relaterte pakker

- [@sb1/indeks-css](https://www.npmjs.com/package/@sb1/indeks-css) — CSS-styling (kreves på siden)
- [@sb1/indeks-react](https://www.npmjs.com/package/@sb1/indeks-react) — React-komponenter
- [@sb1/indeks-tokens](https://www.npmjs.com/package/@sb1/indeks-tokens) — Design tokens

## 📚 Dokumentasjon

Full dokumentasjon finnes på:

**[Midlertidig lenke Indeks](https://automatic-meme-yv23n9e.pages.github.io/)**

## 📄 Lisens

MIT
