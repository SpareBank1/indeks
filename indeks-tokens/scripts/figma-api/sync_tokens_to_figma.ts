import 'dotenv/config';

import FigmaApi from './figma_api.js';

import { generatePostVariablesPayload, readJsonFiles } from './token_import.js';
import { bold, confirm, green, yellow } from './utils.js';

/**
 * Retning: kode → Figma. Skriver theme-tokens fra repoet inn i Figma-fila og
 * overskriver variablene der. Krever bekreftelse (eller --yes).
 *
 * Kjøres via `pnpm sync` (velg retning 2) eller `pnpm sync til`.
 * `pnpm sync til --yes` hopper over bekreftelsen.
 */

async function main() {
    if (!process.env.PERSONAL_ACCESS_TOKEN || !process.env.FILE_KEY) {
        throw new Error('PERSONAL_ACCESS_TOKEN and FILE_KEY environemnt variables are required');
    }
    const fileKey = process.env.FILE_KEY;

    //sync kun primitives/theme til figma
    const tokensFiles = ['tokens/colors/from-code/01 Theme.SpareBank1.json'];

    console.log(bold('Retning: kode → Figma'));
    console.log(`  Leser fra:   ${tokensFiles.join(', ')}`);
    console.log(`  Skriver til: Figma-fil ${fileKey}`);
    console.log(yellow('  Dette overskriver variabler i Figma-fila.'));
    console.log('');

    if (!(await confirm('Skriv "ja" for å synke TIL Figma: '))) {
        console.log('Avbrutt – ingenting er endret i Figma.');
        process.exitCode = 1;
        return;
    }
    console.log('');

    const tokensByFile = readJsonFiles(tokensFiles);

    console.log('Leste token-filer:', Object.keys(tokensByFile).join(', '));

    const api = new FigmaApi(process.env.PERSONAL_ACCESS_TOKEN);
    const localVariables = await api.getLocalVariables(fileKey);

    const postVariablesPayload = generatePostVariablesPayload(tokensByFile, localVariables);

    if (Object.values(postVariablesPayload).every((value) => value.length === 0)) {
        console.log(green('✅ Figma-fila er allerede oppdatert – ingen endringer å sende'));
        return;
    }

    const apiResp = await api.postVariables(fileKey, postVariablesPayload);

    console.log('POST variables API response:', apiResp);

    if (postVariablesPayload.variableCollections && postVariablesPayload.variableCollections.length) {
        console.log('Updated variable collections', postVariablesPayload.variableCollections);
    }

    if (postVariablesPayload.variableModes && postVariablesPayload.variableModes.length) {
        console.log('Updated variable modes', postVariablesPayload.variableModes);
    }

    if (postVariablesPayload.variables && postVariablesPayload.variables.length) {
        console.log('Updated variables', postVariablesPayload.variables);
    }

    if (postVariablesPayload.variableModeValues && postVariablesPayload.variableModeValues.length) {
        console.log('Updated variable mode values', postVariablesPayload.variableModeValues);
    }

    console.log(green('✅ Sendt TIL Figma: Figma-fila er oppdatert med tokens fra koden'));
}

main();
