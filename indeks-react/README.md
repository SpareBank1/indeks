# @sb1/indeks-react

React-komponenter for Indeks designsystemet. Denne pakken inneholder ferdigbygde React-komponenter med tilhørende TypeScript-typer.

## 📦 Del av Indeks

Denne pakken er en del av [Indeks designsystemet](https://github.com/SpareBank1/indeks) og er et tynt React-lag oppå `@sb1/indeks-web`. For å bruke den trenger du tre ting i prosjektet:

1. **CSS** fra `@sb1/indeks-css` (via CDN eller npm)
2. **Web components** fra `@sb1/indeks-web` (via CDN — kreves også for React)
3. **Denne pakken** — `@sb1/indeks-react`

## 📥 Installasjon

```bash
npm install @sb1/indeks-react
npm install --save-dev @sb1/indeks-web
```

`@sb1/indeks-web` installeres som `devDependency` fordi runtime-koden lastes fra CDN — npm-pakken brukes kun for TypeScript-typer ved utvikling.

## 🎨 Styling

Komponentene krever at du inkluderer Indeks CSS.

### Metode 1: Via CDN (anbefalt)

CDN er anbefalt fordi URL-en deles på tvers av SB1-applikasjoner. Nettleseren kan gjenbruke samme cachede CSS, slik at brukere som allerede har besøkt en annen SB1-app slipper å laste ned stylingen på nytt.

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="https://cdn.sparebank1.no/indeks/css/<versjon>/index.css" />
    </head>
    <body>
        <div id="root"></div>
        <script type="module" src="https://cdn.sparebank1.no/indeks/web/<versjon>/index.js"></script>
    </body>
</html>
```

### Metode 2: Via npm

```bash
npm install @sb1/indeks-css
```

```jsx
// main.tsx eller App.tsx
import '@sb1/indeks-css';
import '@sb1/indeks-web'; // registrerer custom elements
```

## 🔄 Hold CDN-URL-er i takt

`@sb1/indeks-css` og `@sb1/indeks-web` versjonslåses til samme versjon som denne pakken. Når `@sb1/indeks-react` bumpes, må CDN-URL-ene i prosjektet ditt oppdateres tilsvarende — ellers kjører nettleseren en annen versjon av CSS og web components enn React-komponentene forventer.

Pakken har et innebygd script for dette. Legg til i `package.json`:

```json
{
    "scripts": {
        "prebuild": "indeks-react sync-cdn --check",
        "sync-indeks": "indeks-react sync-cdn"
    }
}
```

- `prebuild` feiler hvis CDN-URL-ene ikke matcher installert versjon. Med vilje — hvis builden auto-fikser, kan det som deployes bruke andre klasser enn det du har testet.
- `sync-indeks` kjører du eksplisitt for å oppdatere URL-ene i `index.html`, CSS-filer osv.

Scriptet bruker ikke `postinstall` fordi SB1 anbefaler `npm install --ignore-scripts` — da blir lifecycle-hooks hoppet over.

### Hva utskriften betyr

Kommandoen skiller mellom tre utfall, slik at du alltid kan se hva den faktisk fant:

- **`Alle N CDN-URL-er i M fil(er) bruker samme versjon …`** — den fant URL-er og alle peker på installert versjon.
- **`Fant ingen CDN-URL-er …`** — den fant ingenting å synce. Bruker du npm-import (Metode 2 over) er det som forventet, og du kan fjerne `prebuild`/`sync-indeks`. Ellers skriver den ut et ferdig CDN-oppsett med installert versjon.
- **`Ulik versjon: N av M URL(er) … peker ikke på <versjon>.`** — URL-ene står på en annen versjon. Utskriften viser hvilken versjon hver URL gikk fra og til.

I tillegg skriver den en kort `Pakkestatus` for de tre versjonslåste pakkene: hvilken versjon som er i bruk, om den hentes fra CDN eller npm, om du er på siste versjon på npm, og om CDN-en har artefaktene for versjonen ennå.

### Flagg

| Flagg | Effekt |
| --- | --- |
| `--check` | Exit 1 hvis en URL peker på en annen versjon; endrer ingen filer. For CI. |
| `--dry-run` | Vis hva som ville blitt endret. |
| `--require-urls` | Exit 1 hvis ingen CDN-URL-er ble funnet. Uten flagget er null funn OK, fordi et npm-basert prosjekt legitimt ikke har noen. Bruk `--check --require-urls` i prosjekter som _vet_ at de bruker CDN — da fanger du at noen fjerner `<link>`-tagen. |
| `--offline` | Hopp over nettverksoppslagene (siste versjon på npm, og om CDN har artefaktene). De er «best effort» og påvirker aldri exit-koden. |
| `--root`, `--include`, `--exclude` | Begrens hva som skannes. Se `indeks-react sync-cdn --help`. |

URL-er på den gamle formen `…/indeks/css/<versjon>.css` blir migrert til `…/indeks/css/<versjon>/index.css` — den flate formen finnes ikke på CDN-en. Det betyr at `--check` kan feile i et prosjekt som tidligere passerte; URL-en lastet i så fall ikke.

`@sb1/indeks-tokens` og `@sb1/indeks-utils` har egne versjoner og blir aldri skrevet om. De rapporteres til slutt, siden innholdet deres allerede ligger inne i `indeks-css`.

## ✨ Bruk

```jsx
import { Button, Card, Heading, Text, HStack, VStack } from '@sb1/indeks-react';

function App() {
    return (
        <VStack gap="4">
            <Card>
                <Heading as="h1">Velkommen til Indeks</Heading>
                <Text>Dette er en eksempelapp med Indeks-komponenter.</Text>
                <HStack gap="2">
                    <Button variant="primary">Primær knapp</Button>
                    <Button variant="secondary">Sekundær knapp</Button>
                </HStack>
            </Card>
        </VStack>
    );
}
```

## 🔧 TypeScript

Pakken inkluderer TypeScript-definisjoner for alle komponenter:

```tsx
import { ButtonProps, CardProps } from '@sb1/indeks-react';

const MyButton: React.FC<ButtonProps> = (props) => {
    return <Button {...props} />;
};
```

## 🔗 Relaterte pakker

- [@sb1/indeks-css](https://www.npmjs.com/package/@sb1/indeks-css) - CSS-styling (via CDN eller npm)
- [@sb1/indeks-web](https://www.npmjs.com/package/@sb1/indeks-web) - Web components som React-pakken wrapper (kreves)
- [@sb1/indeks-tokens](https://www.npmjs.com/package/@sb1/indeks-tokens) - Design tokens (trenger ikke egen import)
- [@sb1/indeks-utils](https://www.npmjs.com/package/@sb1/indeks-utils) - Utility-klasser (trenger ikke egen import)

## 📚 Dokumentasjon

Full dokumentasjon finnes på:

**[Midlertidig lenke Indeks](https://automatic-meme-yv23n9e.pages.github.io/)**


## 🧩 Opprette nye komponenter

Nye komponenter genereres med [Plop](https://plopjs.com/):

```bash
npm run create-component
```

Dette oppretter komponent, story og test i riktig mappestruktur under `lib/components/`.

## 🎯 Peer Dependencies

Denne pakken krever:

- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0

## 📄 Lisens

MIT
