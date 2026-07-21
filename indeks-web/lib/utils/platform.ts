/**
 * Plattform-deteksjon for web components.
 *
 * Funksjoner (ikke modul-konstanter) fordi userAgent leses ved kall — det gjør
 * grenene testbare via stub av `navigator.userAgent`, og unngår å cache en verdi
 * ved import-tid som kan være feil i SSR-/testmiljø.
 */

/**
 * True når koden kjører på iOS (iPhone/iPad/iPod).
 *
 * Brukes til iOS-spesifikke a11y-workarounds, f.eks. at VoiceOver ikke leser
 * løpende `aria-valuenow`-endringer på `role="progressbar"` — se IxProgressBar.
 * SSR-guardet: returnerer false når `navigator` ikke finnes.
 */
export function isIOS(): boolean {
    if (typeof navigator === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}
