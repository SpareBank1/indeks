import * as readline from 'node:readline/promises';

export function green(msg: string) {
    return `\x1b[32m${msg}\x1b[0m`;
}

export function brightRed(msg: string) {
    return `\x1b[1;31m${msg}\x1b[0m`;
}

export function bold(msg: string) {
    return `\x1b[1m${msg}\x1b[0m`;
}

export function yellow(msg: string) {
    return `\x1b[33m${msg}\x1b[0m`;
}

export function areSetsEqual<T>(a: Set<T>, b: Set<T>) {
    return a.size === b.size && Array.from(a).every(item => b.has(item));
}

/**
 * Krever at brukeren skriver `expected` for å gå videre.
 * Ikke-interaktive kjøringer må sende `--yes` for å bekrefte på forhånd.
 */
export async function confirm(question: string, expected = 'ja') {
    if (process.argv.includes('--yes')) return true;

    if (!process.stdin.isTTY) {
        console.log(brightRed('Avbrutt: kan ikke spørre om bekreftelse uten terminal. Send --yes.'));
        return false;
    }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await rl.question(question);
    rl.close();

    return answer.trim().toLowerCase() === expected;
}
