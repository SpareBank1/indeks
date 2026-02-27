# @sb1/indeks-react

React-komponenter for Indeks designsystemet. Denne pakken inneholder ferdigbygde React-komponenter med tilhørende TypeScript-typer.

## 📦 Del av Indeks

Denne pakken er en del av [Indeks designsystemet](https://github.com/sparebank1utvikling/indeks) og må brukes sammen med CSS-styling:

- **CDN (anbefalt)** - Last inn CSS fra `cdn.sparebank1.no/indeks/css/<versjon>.css`
- eller importer via **@sb1/indeks-css** og installer via npm

## 📥 Installasjon

```bash
npm install @sb1/indeks-react
```

## 🎨 Styling

Komponentene krever at du inkluderer Indeks CSS.

### Metode 1: Via CDN (anbefalt)

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="https://cdn.sparebank1.no/indeks/css/<versjon>.css" />
    </head>
    <body>
        <div id="root"></div>
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
