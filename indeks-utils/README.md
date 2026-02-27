# @sb1/indeks-utils

CSS utility-klasser for Indeks designsystemet. Denne pakken inneholder hjelpeklasser for spacing, layout, farger og mer.

## 📦 Del av Indeks

Denne pakken er en del av [Indeks designsystemet](https://github.com/sparebank1utvikling/indeks) og brukes internt av:

-   **@sb1/indeks-css** - CSS-biblioteket (inkluderer utils automatisk)

## 💡 Bør du installere denne pakken?

**Nei, du bør bruke CDN eller `@sb1/indeks-css` i stedet.**

Via CDN (anbefalt):

```html
<link rel="stylesheet" href="https://cdn.sparebank1.no/indeks/css/<versjon>.css" />
```

Via npm:

```bash
npm install @sb1/indeks-css
```

`@sb1/indeks-css` inkluderer allerede alle utility-klasser, så du trenger ikke å installere dem separat.

## ⚙️ Når bør du installere denne pakken?

Det er sjelden nødvendig å installere `@sb1/indeks-utils` direkte. Du trenger kun denne pakken hvis du:

1. **Bygger egne verktøy** som trenger tilgang til kun utility-klassene
2. **Har spesifikke krav** om å bruke utils uten resten av CSS-biblioteket

## 📥 Installasjon

```bash
npm install @sb1/indeks-utils
```

## 🎨 Bruk

### Importer utilities

```css
@import '@sb1/indeks-utils';
```

Utilities inkluderer klasser som:

-   Spacing utilities (margin, padding)
-   Color utilities (bakgrunnsfarger, tekstfarger)
-   Layout utilities
-   Og mer

## 🔗 Relaterte pakker

-   [@sb1/indeks-css](https://www.npmjs.com/package/@sb1/indeks-css) - Komplett CSS-bibliotek (anbefalt)
-   [@sb1/indeks-tokens](https://www.npmjs.com/package/@sb1/indeks-tokens) - Design tokens
-   [@sb1/indeks-react](https://www.npmjs.com/package/@sb1/indeks-react) - React-komponenter

## 📚 Dokumentasjon

Full dokumentasjon finnes på
**[Midlertidig lenke Indeks](https://automatic-meme-yv23n9e.pages.github.io/)**

## 📄 Lisens

MIT
