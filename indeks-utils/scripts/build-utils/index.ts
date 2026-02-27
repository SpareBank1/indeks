// ESM module entry point for build-utils
// Accepts CLI arguments: platform and path

import { buildCSS } from './css/index.ts';
import { loadTokens } from './loadTokens.ts';
import { getVersion, parseArguments, validateArguments } from './utils.ts';

const TOKENS_PATH = '../indeks-tokens/';

const argMap = parseArguments();
const platform = argMap['platform'] || '';
const outPath = argMap['path'] || '';

validateArguments(platform, outPath);

console.log(`Building utils for platform: ${platform}, output path: ${outPath}`);

const tokens = await loadTokens(TOKENS_PATH);
const version = getVersion(TOKENS_PATH);

if (platform === 'css') {
    buildCSS(outPath, version, tokens);
}

console.log('Utils build complete.');
