// Publisert CLI-entrypoint (pakkens `bin`). Bundles av esbuild til dist/cli.js.
// Signatur (matcher docs): npx @sb1/indeks-tokens build-colors platform=<...> path=<...> [theme=<...>]

import { runBuildColors, USAGE } from './run';

const [verb, ...rest] = process.argv.slice(2);

if (verb !== 'build-colors') {
    console.error(`Ukjent kommando: ${verb ?? '(ingen)'}\n${USAGE}`);
    process.exit(1);
}

const argMap: Record<string, string> = {};
for (const arg of rest) {
    const [key, value] = arg.split('=');
    if (key && value) {
        argMap[key] = value;
    }
}

runBuildColors(argMap);
