---
"@sb1/indeks-tokens": minor
---

`@sb1/indeks-tokens` kan nå kjøres direkte som CLI: `npx @sb1/indeks-tokens build-colors platform=<figma|web|android|ios> path=<utmappe> [theme=<theme.json>]`. Pakken shipper et kompilert, selvstendig CLI (`dist/cli.js`, bundlet med esbuild) med `bin`-oppføring, så kommandoen virker fra en ren install uten `tsx`.

Egne themes oppgis nå som en `.json`-fil (tidligere `.ts`), slik at CLI-et kan laste dem uten en TypeScript-runtime. Filen må ha et `colors`-objekt med de sju basisfargene; `identityColor` og `themeable` er valgfrie.

Ny dokumentasjon for [web-farger](https://sparebank1.github.io/designsystem/?path=/docs/design-farger-web--docs) beskriver hvordan du genererer egen web-CSS fra et eget theme.

Nytt subpath-eksport `@sb1/indeks-tokens/generate` lar deg generere fargeskalaer i runtime — både i nettleseren og i en Node-backend — for å rethem-e farger «on-the-fly» (typisk `brand`). API-et: `buildColorScaleVariables(navn, farge)` gir en ferdig CSS-variabel-map for primitivene, `applyColorScaleVariables(element, variabler)` setter dem på et element, og `colorScaleVariablesToCss(variabler, { selector })` serialiserer dem til en CSS-streng. `colorjs.io` bundles inn, så eksporten har ingen ekstra runtime-avhengigheter. Typene `OriginColor` og `OriginScaleNames` re-eksporteres fra samme subpath, så du kan type dine egne kall uten å grave i interne stier. Merk: bruker du dette, blir `@sb1/indeks-tokens` en ekte `dependency` (ikke bare `devDependency`).
