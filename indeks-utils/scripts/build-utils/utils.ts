import { readFileSync } from 'fs';
import path from 'path';

/**
 * Parse CLI arguments from process.argv
 * Expects arguments in the format: key=value
 */
export function parseArguments(): Record<string, string> {
    const args = process.argv.slice(2);
    const argMap: Record<string, string> = {};
    for (const arg of args) {
        const [key, value] = arg.split('=');
        if (key && value) {
            argMap[key] = value;
        }
    }
    return argMap;
}

/**
 * Validate that required CLI arguments are present
 */
export function validateArguments(platform: string, outPath: string): void {
    if (!platform) {
        console.error('Usage: node index.js platform=<platform> path=<output-path>');
        console.error('Available platforms: css');
        process.exit(1);
    }

    if (!outPath) {
        console.error('Usage: node index.js platform=<platform> path=<output-path>');
        process.exit(1);
    }
}

// Read package version
export function getVersion(dirPath: string): string {
    const pkgPath = path.resolve(dirPath, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    return pkg.version;
}
