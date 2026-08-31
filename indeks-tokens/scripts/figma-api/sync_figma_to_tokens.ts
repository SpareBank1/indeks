import 'dotenv/config';
import * as fs from 'fs';

import FigmaApi from './figma_api';

import { tokenFilesFromLocalVariables } from './token_export';
import { bold, green } from './utils';

/**
 * Retning: Figma → kode. Leser variabler fra Figma-fila og skriver dem som
 * JSON-tokens i repoet. Dette er den vanlige retningen.
 *
 * Kjøres via `pnpm sync` (velg retning) eller `pnpm sync fra`.
 * Skriver til tokens/colors/from-figma, eller til `--output mappenavn`.
 */

async function main() {
    if (!process.env.PERSONAL_ACCESS_TOKEN || !process.env.FILE_KEY) {
        throw new Error('PERSONAL_ACCESS_TOKEN and FILE_KEY environemnt variables are required');
    }
    const fileKey = process.env.FILE_KEY;

    let outputDir = './tokens/colors/from-figma';
    const outputArgIdx = process.argv.indexOf('--output');
    if (outputArgIdx !== -1) {
        outputDir = process.argv[outputArgIdx + 1];
    }

    console.log(bold('Retning: Figma → kode'));
    console.log(`  Leser fra:   Figma-fil ${fileKey}`);
    console.log(`  Skriver til: ${outputDir}`);
    console.log('');

    const api = new FigmaApi(process.env.PERSONAL_ACCESS_TOKEN);
    const localVariables = await api.getLocalVariables(fileKey);

    const tokensFiles = tokenFilesFromLocalVariables(localVariables);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    Object.entries(tokensFiles).forEach(([fileName, fileContent]) => {
        fs.writeFileSync(`${outputDir}/${fileName}`, JSON.stringify(fileContent, null, 2));
        console.log(`Wrote ${fileName}`);
    });

    console.log(green(`✅ Hentet FRA Figma: token-filer skrevet til ${outputDir}`));
}

main();
