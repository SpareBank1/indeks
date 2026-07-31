---
"@sb1/indeks-tokens": patch
---

Legg `typescript` til som `devDependency` i `@sb1/indeks-tokens`. `build:types`-steget (`tsc -p tsconfig.generate.json`) feilet med `sh: 1: tsc: not found` i en ren install, fordi TypeScript ikke lå i pakkens egne avhengigheter. Ingen endring i publisert output.
