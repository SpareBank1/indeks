# @sb1/indeks-tokens

Design tokens for Indeks designsystemet. Denne pakken inneholder farger, spacing, typografi og andre designtokens som brukes i hele designsystemet.

## 📦 Del av Indeks

Denne pakken er en del av [Indeks designsystemet](https://github.com/sparebank1utvikling/indeks) og brukes internt av:

- **@sb1/indeks-css** - CSS-biblioteket (inkluderer tokens automatisk)
- **@sb1/indeks-utils** - CSS utility-klasser
- **@sb1/indeks-react** - React-komponenter

## 💡 Bør du installere denne pakken?

**Nei, sannsynligvis ikke.** I de fleste tilfeller bør du bruke pakken `indeks-css` (se under for installasjon)

`@sb1/indeks-css` inkluderer allerede alle tokens og utils, så du trenger ikke å installere dem separat.

## ⚙️ Når bør du installere denne pakken?

Du trenger kun å installere `@sb1/indeks-tokens` hvis du:

1. **Skal bruke tokens direkte** i dine egne CSS-filer
2. **Bygger egne verktøy** som trenger tilgang til token-data
3. **Trenger TypeScript-typer** for tokens

**OBS:** Du trenger ikke installere pakken for å kjøre scripts. Fremtidige scripts (eksport til iOS/Android, custom themes) kan kjøres direkte med `npx @sb1/indeks-tokens <kommando>`.

## 📥 Installasjon

Via CDN (anbefalt):

```html
<link rel="stylesheet" href="https://cdn.sparebank1.no/indeks/css/<versjon>.css" />
```

Via npm:

```bash
npm install @sb1/indeks-tokens
```

## 🎨 Bruk

### Importer CSS-tokens

```css
@import '@sb1/indeks-tokens';
```

### Scripts (kommer snart)

Fremtidige scripts vil inkludere:

- Eksport av fargetokens for Android
- Eksport av fargetokens for iOS
- Generering av egne themes

Disse kan kjøres med `npx @sb1/indeks-tokens <kommando>` uten å installere pakken.

## 🔗 Relaterte pakker

- [@sb1/indeks-css](https://www.npmjs.com/package/@sb1/indeks-css) - Komplett CSS-bibliotek (anbefalt)
- [@sb1/indeks-utils](https://www.npmjs.com/package/@sb1/indeks-utils) - CSS utility-klasser
- [@sb1/indeks-react](https://www.npmjs.com/package/@sb1/indeks-react) - React-komponenter

## 📚 Dokumentasjon

Full dokumentasjon finnes på:
**[Midlertidig lenke Indeks](https://automatic-meme-yv23n9e.pages.github.io/)**

## 📄 Lisens

MIT
