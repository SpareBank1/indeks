import { LinkText, Message } from '@sb1/indeks-react';
import { useEffect, useRef } from 'react';
import type { FieldErrors } from 'react-hook-form';
import { FELT_REKKEFOLGE, type FeltNavn, type SkjemaData } from './skjema-data';

export type FeiloppsummeringProps = {
    errors: FieldErrors<SkjemaData>;
    /**
     * Begrens oppsummeringen til disse feltene. Steg-varianten sender stegets
     * felt, slik at oppsummeringen ikke lister feil på skjermer brukeren ikke
     * har vært på ennå.
     */
    felt?: readonly FeltNavn[];
    /** Flytter fokus til feltet. Send inn RHF sin `setFocus`. */
    onVelgFelt: (navn: FeltNavn) => void;
    /**
     * Økes hver gang brukeren forsøker å gå videre. Brukes til å flytte fokus
     * hit på nytt ved HVERT forsøk — ikke bare første gang oppsummeringen vises.
     */
    forsok: number;
    /** i18n: `{n}` erstattes med antall feil. */
    tittelMal: string;
};

/**
 * Feiloppsummering over skjemaet (Digdir/GOV.UK-mønsteret).
 *
 * Hvorfor: i et langt skjema kan feltet som feilet ligge utenfor viewport når
 * brukeren trykker «Send inn». En inline feilmelding under feltet er da usynlig,
 * og skjemaet ser ut som det ikke gjorde noe. Oppsummeringen samler feilene der
 * blikket er, og hver linje er en snarvei til feltet.
 *
 * Fokus flyttes hit, og annonseringen skjer PÅ GRUNN AV fokusflyttingen. Derfor
 * er `announceText=""` satt: den slår av `Message` sin egen live-region-
 * annonsering, som ellers ville lest oppsummeringen opp en gang til.
 */
export function Feiloppsummering({
    errors,
    felt,
    onVelgFelt,
    forsok,
    tittelMal,
}: FeiloppsummeringProps): React.JSX.Element | null {
    const ref = useRef<HTMLDivElement>(null);
    const sistFokusert = useRef(0);

    // Sorter etter visuell rekkefølge, ikke etter rekkefølgen i `errors`.
    const aktuelle = felt ?? FELT_REKKEFOLGE;
    const feil = FELT_REKKEFOLGE.filter((navn) => aktuelle.includes(navn))
        .map((navn) => ({ navn, melding: errors[navn]?.message }))
        .filter((rad): rad is { navn: FeltNavn; melding: string } => typeof rad.melding === 'string');

    useEffect(() => {
        if (feil.length > 0 && forsok > sistFokusert.current) {
            sistFokusert.current = forsok;
            ref.current?.focus();
        }
    }, [forsok, feil.length]);

    if (feil.length === 0) {
        return null;
    }

    const tittel = tittelMal.replace('{n}', String(feil.length));

    return (
        // role="group" + aria-label: en naken <div tabindex="-1"> har ingen rolle,
        // og da ignorerer skjermlesere aria-label. Med rollen på plass leses
        // tittelen når fokus lander her.
        <div ref={ref} tabIndex={-1} role="group" aria-label={tittel} className="skjema__feiloppsummering">
            <Message status="danger" title={tittel} fullWidth announceText="">
                <ul className="skjema__feilliste">
                    {feil.map(({ navn, melding }) => (
                        <li key={navn}>
                            {/* type="button" er påkrevd: knappen ligger inne i
                                <form>, og en knapp uten type submitter skjemaet. */}
                            <LinkText as="button" type="button" onClick={() => onVelgFelt(navn)}>
                                {melding}
                            </LinkText>
                        </li>
                    ))}
                </ul>
            </Message>
        </div>
    );
}
