---
"@sb1/indeks-tokens": minor
---

`@sb1/indeks-tokens` kan nå kjøres direkte som CLI: `npx @sb1/indeks-tokens build-colors platform=<figma|web|android|ios> path=<utmappe> [theme=<theme.json>]`. Pakken shipper et kompilert, selvstendig CLI (`dist/cli.js`, bundlet med esbuild) med `bin`-oppføring, så kommandoen virker fra en ren install uten `tsx`.

Egne themes oppgis nå som en `.json`-fil (tidligere `.ts`), slik at CLI-et kan laste dem uten en TypeScript-runtime. Filen må ha et `colors`-objekt med de sju basisfargene; `identityColor` og `themeable` er valgfrie.

Ny dokumentasjon for [web-farger](https://sparebank1.github.io/designsystem/?path=/docs/design-farger-web--docs) beskriver hvordan du genererer egen web-CSS fra et eget theme.
