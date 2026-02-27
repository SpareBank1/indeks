# @sb1/indeks-css

CSS-bibliotek for Indeks designsystemet. Denne pakken inneholder all styling du trenger for å bruke Indeks - komponenter, utility-klasser og design tokens.

## 📦 Del av Indeks

Denne pakken er en del av [Indeks designsystemet](https://github.com/sparebank1utvikling/indeks) og inkluderer automatisk:

-   **@sb1/indeks-tokens** - Design tokens (farger, spacing, typografi)
-   **@sb1/indeks-utils** - CSS utility-klasser

Du trenger ikke å installere tokens eller utils separat!

## 📥 Installasjon

### Via CDN (anbefalt)

```html
<link rel="stylesheet" href="https://cdn.sparebank1.no/indeks/css/<versjon>.css" />
```

Erstatt `<versjon>` med ønsket versjon, f.eks. `0.1.1`.

### Via npm

```bash
npm install @sb1/indeks-css
```

## 🎨 Bruk

### Via CDN

```html
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="https://cdn.sparebank1.no/indeks/css/0.1.1.css" />
    </head>
    <body>
        <button class="button">Klikk her</button>
    </body>
</html>
```

### Via npm - I din CSS-fil

```css
@import '@sb1/indeks-css';
```

### Via npm - I JavaScript/TypeScript

```javascript
import '@sb1/indeks-css';
```

## ✨ Hva inkluderer denne pakken?

`indeks-css` samler CSS fra tre pakker i Indeks designsystemet:

### @sb1/indeks-tokens — Design tokens

Grunnverdiene som hele designsystemet bygger på, definert som CSS custom properties:

-   **Farger** - Fargepaletter i OKLCH fargerom
-   **Spacing** - Fluid spacing som skalerer med skjermstørrelse
-   **Typografi** - Skriftstørrelser, linjehøyder og vekter
-   **Border, outline, shadows** - Kantlinjer og dybdeeffekter
-   **Breakpoints** - Skjermstørrelser for responsive layouts
-   **Transitions** - Animasjonsvarighet og easing
-   **Z-index** - Lagdeling av elementer

### @sb1/indeks-utils — CSS utility-klasser

Ferdiglagde CSS-klasser for vanlige behov:

-   **Layout** - Grid, flex, gap og sizing
-   **Spacing** - Margin og padding
-   **Typografi** - Tekststiler og skriftstørrelser
-   **Farger** - Bakgrunns- og tilstandsfarger
-   **Border og transitions** - Kantlinjer og animasjoner
-   **Accessibility** - Hjelpeklasser for tilgjengelighet
-   **Reset** - CSS reset for konsistent utgangspunkt

### @sb1/indeks-css — Komponent-CSS

CSS som er spesifikk for Indeks sine komponenter:

-   **Komponenter** - Button, Card, Table, Tag, Spinner, Divider, List, Form-elementer
-   **Typografi** - Heading, Text, Link
-   **Layout** - Box
-   **Icons** - Icon-system integrert med sb1-icons

## 🎯 Bruk med React

For React-komponenter, bruk `@sb1/indeks-react` sammen med CSS-en:

Via CDN + npm:

```jsx
// index.html
<link rel="stylesheet" href="https://cdn.sparebank1.no/indeks/css/0.1.1.css">

// App.jsx
import { Button, Card } from '@sb1/indeks-react';

function App() {
  return (
    <Card>
      <Button>Klikk her</Button>
    </Card>
  );
}
```

Eller via npm:

```bash
npm install @sb1/indeks-css @sb1/indeks-react
```

```jsx
import '@sb1/indeks-css';
import { Button, Card } from '@sb1/indeks-react';

function App() {
    return (
        <Card>
            <Button>Klikk her</Button>
        </Card>
    );
}
```

## 🔗 Relaterte pakker

-   [@sb1/indeks-react](https://www.npmjs.com/package/@sb1/indeks-react) - React-komponenter
-   [@sb1/indeks-tokens](https://www.npmjs.com/package/@sb1/indeks-tokens) - Design tokens (inkludert automatisk)
-   [@sb1/indeks-utils](https://www.npmjs.com/package/@sb1/indeks-utils) - Utility-klasser (inkludert automatisk)

## 📚 Dokumentasjon

Full dokumentasjon med eksempler og retningslinjer finnes på:

**[Midlertidig lenke Indeks](https://automatic-meme-yv23n9e.pages.github.io/)**

## 📄 Lisens

MIT
