import { defineConfig } from 'vitest/config';

/* Pakken hadde ingen konfigurasjon, og `test` listet i stedet fem filnavn
   eksplisitt. Fire testfiler sto utenfor listen og hadde aldri kjørt — én av dem
   mocket til og med en modul som ikke var den koden importerte. Standarden er nå
   at alt kjører, og det som ikke kan kjøre må navngis her med en grunn. */
export default defineConfig({
    test: {
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/.build/**',
            /* token_export har to reelle feil i tokenFilesFromLocalVariables, og
               token_import er skrevet for Jest og laster ikke i vitest. Se
               https://github.com/SpareBank1/indeks/issues/259 */
            'scripts/figma-api/token_export.spec.tsx',
            'scripts/figma-api/token_import.spec.tsx',
        ],
    },
});
