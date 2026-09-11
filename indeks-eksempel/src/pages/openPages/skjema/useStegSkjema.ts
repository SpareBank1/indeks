import { useCallback, useEffect, useRef, useState, type FormEvent, type RefObject } from 'react';
import type { FieldErrors, FieldPath, FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';

/*
 * OPPSKRIFT: stegskjema der steg-indikator, validering og URL utledes av ÉN
 * stegdefinisjon.
 *
 * Dette er bevisst en hook i eksempelappen, ikke en komponent i indeks-react.
 * En <StegSkjema>-komponent måtte eid ruting, historikk og valideringspolicy —
 * altfor mye policy for et designsystem. Indeks eier utseendet (steg-
 * indikatoren); appen eier flyten. Digdir og GOV.UK har landet på det samme.
 *
 * URL-EN ER SANNHETSKILDEN for hvilket steg som vises. Det er hele poenget:
 * med en `useState` ved siden av URL-en har du to kilder som må holdes i synk,
 * og da er du tilbake til den manuelle koblingen. Her leses aktivt steg ut av
 * URL-en ved hver render, og navigasjon ER en URL-skriving.
 *
 * Det gir gratis:
 *   - nettleserens tilbakeknapp går ett steg bakover, som brukere forventer
 *   - fram-knappen tar deg tilbake igjen
 *   - en URL som peker for langt fram blir avvist, ikke fulgt
 *
 * MEN: URL-synk gir IKKE gjenopptakelse alene. Ved oppfriskning er svarene borte,
 * og et steg som avhenger av svar som ikke finnes kan ikke vises — brukeren
 * klampes til steg 1. Vil du at oppfriskning skal virke, må VERDIENE lagres
 * også (sessionStorage, eller et utkast på serveren) og legges inn som
 * `defaultValues`. Legger du steget i URL-en uten det, lover URL-en noe den ikke
 * kan holde.
 *
 * Hooken tar IMOT `stegIUrl` + `settStegIUrl` istedenfor å lese `window.location`
 * selv. Da fungerer den både med og uten ruter: react-router-apper sender inn
 * `useSearchParams`, andre bruker `useStegIUrl` under. Å importere react-router
 * her hadde bundet oppskriften til én ruter.
 */

export type StegDef<T extends FieldValues> = {
    id: string;
    /** Feltene dette steget validerer ved «Neste». */
    felt: readonly FieldPath<T>[];
};

/**
 * Standardimplementasjon for apper uten ruter: `?steg=<id>` via History API.
 * Apper med ruter bør sende inn ruterens egen søkeparameter-tilstand i stedet,
 * slik at ruteren vet om navigasjonen.
 */
export function useStegIUrl(param = 'steg'): [string | null, (stegId: string, erstatt?: boolean) => void] {
    const les = useCallback(() => new URLSearchParams(window.location.search).get(param), [param]);
    const [verdi, setVerdi] = useState<string | null>(les);

    // pushState/replaceState utløser ikke popstate, men nettleserens fram- og
    // tilbakeknapp gjør det. Uten denne lytteren ville tilbakeknappen endret
    // URL-en uten at skjemaet byttet steg.
    useEffect(() => {
        const lytt = (): void => setVerdi(les());
        window.addEventListener('popstate', lytt);
        return () => window.removeEventListener('popstate', lytt);
    }, [les]);

    const skriv = useCallback(
        (stegId: string, erstatt = false): void => {
            const url = new URL(window.location.href);
            url.searchParams.set(param, stegId);
            window.history[erstatt ? 'replaceState' : 'pushState'](null, '', url);
            setVerdi(stegId);
        },
        [param]
    );

    return [verdi, skriv];
}

/*
 * Generisk over BÅDE skjemadataen (T) og stegtypen (S). Uten S-en ville `aktivt`
 * kommet ut som `StegDef<T>`, og kallerens egne felt på steget — `tittel`,
 * `kort` — vært borte fra typen. Hooken bryr seg bare om `id` og `felt`, men
 * skal levere steget tilbake urørt.
 */
type StegSkjemaArgs<T extends FieldValues, S extends StegDef<T>> = {
    /** Stegene som gjelder nå. Lista kan krympe/vokse med brukerens svar. */
    steg: readonly S[];
    form: UseFormReturn<T>;
    /** Steg-id lest ut av URL-en, eller null før den er satt. */
    stegIUrl: string | null;
    settStegIUrl: (stegId: string, erstatt?: boolean) => void;
    onSend: SubmitHandler<T>;
};

type StegSkjema<S> = {
    aktivt: S;
    index: number;
    erSisteSteg: boolean;
    /** Økes ved hvert forsøk, også de som feiler. Feiloppsummeringen bruker den til å ta fokus på nytt. */
    forsok: number;
    /** Legges på stegets <h2> sammen med tabIndex={-1}. */
    overskriftRef: RefObject<HTMLHeadingElement | null>;
    tilbake: () => void;
    handterSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export function useStegSkjema<T extends FieldValues, S extends StegDef<T>>({
    steg,
    form,
    stegIUrl,
    settStegIUrl,
    onSend,
}: StegSkjemaArgs<T, S>): StegSkjema<S> {
    const { trigger, handleSubmit } = form;

    /*
     * Stegene brukeren har validert seg gjennom i denne sesjonen. Dette er
     * nøkkelen til å tåle en URL som peker hvor som helst: et steg er lovlig å
     * vise hvis det er fullført, eller er det FØRSTE ufullførte.
     *
     * Ved kald åpning av ?steg=tjenester er lista tom, og brukeren klampes til
     * steg 1 — ellers hadde deep-linking hoppet over valideringen og vist en
     * skjerm som avhenger av svar som ikke finnes. Ved tilbakeknapp innenfor
     * sesjonen ligger steget i lista, og URL-en respekteres.
     */
    const [fullforte, setFullforte] = useState<readonly string[]>([]);
    const [forsok, setForsok] = useState(0);
    const [harNavigert, setHarNavigert] = useState(false);

    const forsteUfullforte = steg.find((s) => !fullforte.includes(s.id)) ?? steg[steg.length - 1];
    const funnet = steg.findIndex(
        (s) => s.id === stegIUrl && (s.id === forsteUfullforte.id || fullforte.includes(s.id))
    );
    const index = funnet === -1 ? steg.indexOf(forsteUfullforte) : funnet;
    const aktivt = steg[index];
    const erSisteSteg = index === steg.length - 1;

    /*
     * Skriver URL-en tilbake når den ikke stemmer med steget som faktisk vises:
     * ved første render (ingen parameter ennå) og når en avvist URL er klampet.
     * `erstatt` = replaceState, så en URL vi nektet å vise ikke legger seg i
     * historikken — da hadde tilbakeknappen ført brukeren rett tilbake til den.
     */
    const skrivRef = useRef(settStegIUrl);
    skrivRef.current = settStegIUrl;
    useEffect(() => {
        if (stegIUrl !== aktivt.id) {
            skrivRef.current(aktivt.id, true);
        }
    }, [stegIUrl, aktivt.id]);

    // Fokus flyttes til stegets overskrift ved navigasjon. Uten dette blir fokus
    // stående på «Neste»-knappen, som nå er en annen knapp i en annen kontekst —
    // og en skjermleserbruker får ingen beskjed om at skjermen byttet.
    const overskriftRef = useRef<HTMLHeadingElement>(null);
    useEffect(() => {
        // `harNavigert` hindrer at fokus rykkes ved første render av siden.
        if (harNavigert) {
            overskriftRef.current?.focus();
        }
    }, [aktivt.id, harNavigert]);

    function gaTil(stegId: string): void {
        setHarNavigert(true);
        settStegIUrl(stegId);
    }

    async function handterSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        setForsok((n) => n + 1);

        if (erSisteSteg) {
            await handleSubmit(onSend, (feil) => {
                /*
                 * Siste steg validerer HELE skjemaet, og da kan en feil dukke opp
                 * på et steg brukeren har forlatt — typisk fordi et betinget felt
                 * ble påkrevd av et valg lenger fram. Da må brukeren sendes tilbake
                 * dit; en feilmelding på en skjerm som ikke vises er verre enn
                 * ingen feilmelding.
                 */
                const forsteMedFeil = steg.find((s) => s.felt.some((navn) => harFeil(feil, navn)));
                if (forsteMedFeil && forsteMedFeil.id !== aktivt.id) {
                    gaTil(forsteMedFeil.id);
                }
            })();
            return;
        }

        // Valider BARE dette stegets felt. `trigger` på hele skjemaet ville vist
        // feil på felt brukeren ikke har fått se ennå.
        // shouldFocus: false — feiloppsummeringen tar fokus i stedet, slik at
        // brukeren ser alle feilene på steget, ikke bare den første.
        const gyldig = await trigger([...aktivt.felt], { shouldFocus: false });
        if (!gyldig) {
            return;
        }

        // Må skje før navigasjonen: det er dette som gjør neste steg lovlig å vise.
        setFullforte((ferdige) => (ferdige.includes(aktivt.id) ? ferdige : [...ferdige, aktivt.id]));
        gaTil(steg[index + 1].id);
    }

    return {
        aktivt,
        index,
        erSisteSteg,
        forsok,
        overskriftRef,
        tilbake: () => gaTil(steg[Math.max(index - 1, 0)].id),
        handterSubmit,
    };
}

// Feltnavnene i dette skjemaet er flate, så oppslag i errors-objektet er direkte.
// Med nøstede felt («adresse.postnr») måtte dette vært en sti-oppslag.
function harFeil<T extends FieldValues>(feil: FieldErrors<T>, navn: FieldPath<T>): boolean {
    return (feil as Record<string, unknown>)[navn] !== undefined;
}
