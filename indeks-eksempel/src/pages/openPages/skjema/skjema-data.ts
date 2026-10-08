import * as v from 'valibot';

/*
 * Felles skjemadefinisjon for de to strukturvariantene:
 *
 *   SkjemaEnSide.tsx  — alt på én side, delt i seksjoner (Surface)
 *   SkjemaSteg.tsx    — samme felt fordelt på steg, én skjerm om gangen
 *
 * Begge sidene bruker DENNE fila og de samme seksjonskomponentene. Det er et
 * poeng i seg selv: valget mellom «én side» og «steg for steg» er et
 * presentasjonsvalg, ikke et datavalg. Skjema, valideringsregler og felt er
 * identiske — bare innrammingen er ulik.
 */

// i18n-konvensjon: alle synlige/leste tekster er strenger her (norsk bokmål),
// aldri hardkodet inne i komponentene.

/*
 * BETINGET VALIDERING
 *
 * To felt er bare påkrevd i én gren av skjemaet:
 *   - orgnummer/firmanavn: kun når kundetype === 'bedrift'
 *   - kortnavn:            kun når 'kort' er blant tjenestene
 *
 * De ligger som vanlige (alltid tilstedeværende) `v.string()` i objektet, og
 * regelen uttrykkes med `v.forward(v.partialCheck(...))`. To grunner til at det
 * er `partialCheck` og ikke `check`:
 *
 *   1. `partialCheck` kjører selv om ANDRE felt i objektet har feil — den bryr
 *      seg bare om at feltene den peker på er av riktig type. `check` hopper
 *      over hele objektet så snart noe er ugyldig.
 *   2. `v.forward(..., ['orgnummer'])` flytter feilen fra roten og ned på
 *      feltet, slik at `errors.orgnummer?.message` finner den. Uten `forward`
 *      havner meldingen på rot-nivå og vises aldri under feltet.
 *
 * Alternativet `v.variant('kundetype', [...])` gir strengere typer, men
 * feilstiene blir vanskeligere å mappe til enkeltfelt — og feltene må da
 * duplisert i hver gren.
 */
export const skjemaSchema = v.pipe(
    v.object({
        navn: v.pipe(v.string(), v.trim(), v.minLength(2, 'Navn må ha minst 2 tegn')),
        // DateField sender/validerer ISO (åååå-mm-dd); den synlige inputen viser dd.mm.åååå.
        fodselsdato: v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/, 'Velg en gyldig fødselsdato')),
        epost: v.pipe(
            v.string(),
            v.trim(),
            v.nonEmpty('E-post er påkrevd'),
            v.email('E-postadressen er ugyldig')
        ),
        // PhoneNumberField er to uavhengige felt: landkode + rå nummer (8 siffer).
        landkode: v.pipe(v.string(), v.nonEmpty('Velg landkode')),
        tlf: v.pipe(v.string(), v.regex(/^\d{8}$/, 'Telefonnummer må være 8 siffer')),
        // Combobox — søkbar liste med «kun velg fra liste».
        bostedsland: v.pipe(v.string(), v.nonEmpty('Velg bostedsland')),
        kundetype: v.pipe(v.string(), v.nonEmpty('Velg om du er privat- eller bedriftskunde')),

        // Betinget — se blokk-kommentaren over. Ingen `nonEmpty` her; regelen
        // ligger i partialCheck-en under så tom verdi er lovlig i privat-grenen.
        orgnummer: v.string(),
        firmanavn: v.string(),

        tjenester: v.pipe(v.array(v.string()), v.minLength(1, 'Velg minst én tjeneste')),

        // Betinget — kun når 'kort' er valgt.
        kortnavn: v.string(),

        // Select — kort, kjent liste, ingen søk.
        kontaktmetode: v.pipe(v.string(), v.nonEmpty('Velg hvordan vi skal kontakte deg')),

        // v.boolean + check (ikke v.literal(true)) → verditypen forblir boolean, så
        // avkrysningsboksen kan starte umarkert (false) og feile ved tomt submit.
        samtykke: v.pipe(v.boolean(), v.check((verdi) => verdi === true, 'Du må godta vilkårene')),

        // TextArea — FRIVILLIG felt, men med en regel. Tar med et felt som kan være
        // tomt uten å feile: et skjema der alt er påkrevd tester ikke at
        // feiloppsummeringen faktisk utelater de gyldige feltene.
        melding: v.pipe(v.string(), v.maxLength(200, 'Meldingen kan være maks 200 tegn')),
    }),
    v.forward(
        v.partialCheck(
            [['kundetype'], ['orgnummer']],
            // Rå verdi = 9 siffer uten separatorer (feltet bruker format="orgnr").
            (input) => input.kundetype !== 'bedrift' || /^\d{9}$/.test(input.orgnummer),
            'Organisasjonsnummer må være 9 siffer'
        ),
        ['orgnummer']
    ),
    v.forward(
        v.partialCheck(
            [['kundetype'], ['firmanavn']],
            (input) => input.kundetype !== 'bedrift' || input.firmanavn.trim().length >= 2,
            'Firmanavn må ha minst 2 tegn'
        ),
        ['firmanavn']
    ),
    v.forward(
        v.partialCheck(
            [['tjenester'], ['kortnavn']],
            (input) => !input.tjenester.includes('kort') || input.kortnavn.trim().length >= 2,
            'Navnet på kortet må ha minst 2 tegn'
        ),
        ['kortnavn']
    )
);

export type SkjemaData = v.InferOutput<typeof skjemaSchema>;
export type FeltNavn = keyof SkjemaData;

export const defaultValues: SkjemaData = {
    navn: '',
    fodselsdato: '',
    epost: '',
    // Landkode er forhåndsvalgt. Merk: med register() må et forhåndsvalg i en
    // Combobox settes BÅDE her og som defaultCountryCode på PhoneNumberField —
    // defaultValues alene pushes ikke inn i web-komponenten.
    landkode: '47',
    tlf: '',
    bostedsland: '',
    kundetype: '',
    orgnummer: '',
    firmanavn: '',
    tjenester: [],
    kortnavn: '',
    kontaktmetode: '',
    samtykke: false,
    melding: '',
};

/*
 * Rekkefølgen feltene står i visuelt. Feiloppsummeringen sorterer etter denne —
 * `errors`-objektet fra RHF har ikke garantert visuell rekkefølge, og en
 * oppsummering som lister feilene i tilfeldig rekkefølge er vanskelig å følge.
 */
export const FELT_REKKEFOLGE: readonly FeltNavn[] = [
    'navn',
    'fodselsdato',
    'epost',
    'landkode',
    'tlf',
    'bostedsland',
    'kundetype',
    'orgnummer',
    'firmanavn',
    'tjenester',
    'kortnavn',
    'kontaktmetode',
    'samtykke',
    'melding',
];

export const kundetypeOptions = [
    { value: 'privat', label: 'Privatkunde' },
    { value: 'bedrift', label: 'Bedriftskunde' },
];

export const tjenesteOptions = [
    { value: 'nettbank', label: 'Nettbank' },
    { value: 'mobilbank', label: 'Mobilbank' },
    { value: 'kort', label: 'Betalingskort' },
];

// Lang nok liste at søk gir mening — det er kriteriet for Combobox over Select.
export const bostedslandOptions = [
    { value: 'no', label: 'Norge' },
    { value: 'se', label: 'Sverige' },
    { value: 'dk', label: 'Danmark' },
    { value: 'fi', label: 'Finland' },
    { value: 'is', label: 'Island' },
    { value: 'de', label: 'Tyskland' },
    { value: 'nl', label: 'Nederland' },
    { value: 'pl', label: 'Polen' },
];

// Kort, kjent og lukket liste — da er Select riktig, ikke Combobox.
export const kontaktmetodeOptions = [
    { value: 'epost', label: 'E-post' },
    { value: 'telefon', label: 'Telefon' },
    { value: 'brev', label: 'Brev' },
];

/* ---------------------------------------------------------------------------
 * Betingelser
 *
 * Predikatene bor her, ikke inne i JSX-en, fordi de brukes på tre steder:
 * hva som RENDRES, hvilke felt et steg VALIDERER, og hvilke felt som skal
 * NULLSTILLES når de skjules. Tre kopier av samme uttrykk ville før eller
 * senere sprikt.
 * ------------------------------------------------------------------------- */

export function visBedriftsfelt(kundetype: string): boolean {
    return kundetype === 'bedrift';
}

export function visKortnavn(tjenester: string[]): boolean {
    return tjenester.includes('kort');
}

/* ---------------------------------------------------------------------------
 * Stegdefinisjon
 *
 * `felt` er det steg-varianten validerer ved «Neste», og det
 * feiloppsummeringen begrenses til. Én kilde, så et felt ikke kan bli
 * validert på feil steg eller falle mellom to steg.
 * ------------------------------------------------------------------------- */

export type Steg = {
    id: string;
    tittel: string;
    /** Kort navn til steg-indikatoren. */
    kort: string;
    felt: readonly FeltNavn[];
};

export const ALLE_STEG: readonly Steg[] = [
    {
        id: 'om-deg',
        tittel: 'Om deg',
        kort: 'Om deg',
        felt: ['navn', 'fodselsdato', 'epost', 'landkode', 'tlf', 'bostedsland'],
    },
    {
        // Ett spørsmål alene på et steg er et bevisst mønster, ikke sløsing: når
        // svaret forgrener resten av skjemaet, er det lettere å svare på isolert.
        id: 'kundetype',
        tittel: 'Kundetype',
        kort: 'Kundetype',
        felt: ['kundetype'],
    },
    {
        // Hele dette steget hoppes over når kundetype ikke er 'bedrift'.
        id: 'bedrift',
        tittel: 'Om bedriften',
        kort: 'Bedrift',
        felt: ['orgnummer', 'firmanavn'],
    },
    {
        id: 'tjenester',
        tittel: 'Tjenester og samtykke',
        kort: 'Tjenester',
        felt: ['tjenester', 'kortnavn', 'kontaktmetode', 'samtykke', 'melding'],
    },
];

/**
 * Stegene som gjelder for de valgene brukeren har gjort. Antallet er beregnet,
 * ikke hardkodet — ellers lyver indikatoren så snart et steg hoppes over.
 *
 * Mens kundetypen er uvalgt REGNES bedriftssteget med. Da kan antallet bare
 * krympe (4 → 3 når man velger privatkunde), aldri vokse. En fremdriftsteller
 * som plutselig lover flere steg enn den startet med, undergraver hele poenget
 * med å vise fremdrift; å bli ferdig tidligere enn annonsert er derimot greit.
 */
export function synligeSteg(kundetype: string): readonly Steg[] {
    const utelatBedrift = kundetype !== '' && !visBedriftsfelt(kundetype);
    return ALLE_STEG.filter((steg) => steg.id !== 'bedrift' || !utelatBedrift);
}
