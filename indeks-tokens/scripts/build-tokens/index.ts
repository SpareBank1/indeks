// Main ESM TypeScript build script for tokens
import fs from 'fs/promises';
import path from 'path';
import { buildCSSTokens } from './css/index.js';

(async function () {
    // Parse CLI args
    const args = Object.fromEntries(process.argv.slice(2).map((arg) => arg.split('=')));
    const platform = args.platform || '';
    const outPath = args.path || '';

    if (platform === '') {
        console.error('No platform specified. Use platform=css');
        process.exit(1);
    }

    if (outPath === '') {
        console.error('No output path specified. Use path=./output');
        process.exit(1);
    }

    // Read and merge all token files in tokens folder
    const tokensDir = path.resolve('tokens');
    const tokenFiles = await fs.readdir(tokensDir);
    let tokens = {};
    for (const file of tokenFiles) {
        if (file.endsWith('.json')) {
            const filePath = path.join(tokensDir, file);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const parsed = JSON.parse(fileContent);
            // Merge top-level keys
            tokens = { ...tokens, ...parsed };
        }
    }

    const pkg = JSON.parse(await fs.readFile(path.resolve('package.json'), 'utf-8'));
    const version = pkg.version;

    if (platform === 'css') {
        buildCSSTokens(outPath, version, tokens);
    }

    console.log('Token build complete.');
})();
