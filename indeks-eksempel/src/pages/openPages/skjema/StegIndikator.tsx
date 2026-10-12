import type { Steg } from './skjema-data';

export type StegIndikatorProps = {
    /** Bare de synlige stegene — hoppede steg skal ikke telle med. */
    steg: readonly Steg[];
    aktivIndex: number;
    /** i18n: aria-label på <nav>, f.eks. «Fremdrift i skjemaet». */
    navLabel: string;
    /** i18n: `{n}` = gjeldende steg, `{total}` = antall synlige steg. */
    stegTekstMal: string;
    /** i18n: skjermlesertekst som markerer et fullført steg, f.eks. «ferdig». */
    ferdigTekst: string;
};

/**
 * Steg-indikator — bygget lokalt i eksempelappen, med vilje.
 *
 * Indeks har ingen steg-indikator i dag. `ProgressBar` er nærmest, men den
 * beskriver én sammenhengende prosess (0–100 %) og kan verken navngi stegene
 * eller vise hvilket som er fullført. Vi bygger den derfor her, med
 * utility-klasser og tokens, mens mønsteret setter seg — det er billigere å
 * endre en fil i eksempelappen enn å låse et komponent-API i indeks-react.
 *
 * Bevisst ikke-interaktiv: prikkene er ikke lenker tilbake til tidligere steg.
 * Hopping bakover reiser spørsmålet om hva som skal valideres på vei tilbake og
 * fram igjen, og det er en egen diskusjon. «Tilbake»-knappen dekker behovet.
 */
export function StegIndikator({
    steg,
    aktivIndex,
    navLabel,
    stegTekstMal,
    ferdigTekst,
}: StegIndikatorProps): React.JSX.Element {
    const stegTekst = stegTekstMal
        .replace('{n}', String(aktivIndex + 1))
        .replace('{total}', String(steg.length));

    return (
        <nav aria-label={navLabel} className="ix-mb-lg">
            <p className="skjema__stegtekst">{stegTekst}</p>
            <ol className="skjema__stegliste">
                {steg.map((s, index) => {
                    const tilstand = index < aktivIndex ? 'ferdig' : index === aktivIndex ? 'aktiv' : 'kommende';
                    return (
                        <li
                            key={s.id}
                            className="skjema__stegpunkt"
                            data-tilstand={tilstand}
                            // aria-current="step" er den semantiske markøren for
                            // «her er du» i en stegrekke.
                            aria-current={tilstand === 'aktiv' ? 'step' : undefined}
                        >
                            {/* Prikken er dekorativ: tilstanden formidles av
                                aria-current og av ferdig-teksten under. */}
                            <span className="skjema__stegprikk" aria-hidden="true" />
                            <span className="skjema__stegnavn">
                                {s.kort}
                                {tilstand === 'ferdig' && <span className="ix-sr-only"> ({ferdigTekst})</span>}
                            </span>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
