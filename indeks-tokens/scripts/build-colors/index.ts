// Internt tsx-entrypoint for fargebygging (brukes av build:colors:*-scriptene).
// Parser `key=value`-argumenter uten verb. Det publiserte CLI-et er cli.ts.

import { runBuildColors } from './run';

const args = process.argv.slice(2);
const argMap: Record<string, string> = {};
for (const arg of args) {
    const [key, value] = arg.split('=');
    if (key && value) {
        argMap[key] = value;
    }
}

runBuildColors(argMap);
