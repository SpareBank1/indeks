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
        <link rel="stylesheet" href="https://cdn.sparebank1.no/indeks/css/<versjon>.css" />
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
