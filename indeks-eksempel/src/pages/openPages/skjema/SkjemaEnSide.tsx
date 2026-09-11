import { valibotResolver } from '@hookform/resolvers/valibot';
import { Button, Form, Heading, LinkText, Message, MessageRegion, Surface, Text } from '@sb1/indeks-react';
import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useNullstillSkjulteFelt } from './betingelser';
import { Feiloppsummering } from './Feiloppsummering';
import { Kundetype, OmBedriften, OmDeg, TjenesterOgSamtykke } from './Seksjoner';
import { defaultValues, skjemaSchema, visBedriftsfelt, type SkjemaData } from './skjema-data';
import './skjema.css';

/*
 * MØNSTER 1: alt på én side, delt i seksjoner.
 *
 * Når passer det?
 *   - Skjemaet er overkommelig (grovt sagt opp til rundt 15 felt).
 *   - Brukeren har nytte av å se helheten før hun begynner — «hva blir jeg
 *     egentlig spurt om?».
 *   - Feltene er relativt uavhengige, så rekkefølgen ikke er kritisk.
 *   - Brukeren kan tenkes å hoppe fram og tilbake, eller å fylle ut i flere
 *     omganger uten å ville gjennom en stegflyt hver gang.
 *
 * Seksjonene er `Surface`, ikke `Card`: `Card` er ferdiglagde kortvarianter, og
 * dets klikkbare variant har en understrek som signaliserer at hele flaten kan
 * trykkes på. En skjemaseksjon skal ikke se ut som noe man kan klikke. `Surface`
 * er den enkle flaten man bygger egne grupperinger av.
 *
 * Merk at seksjonene her er RENT VISUELLE grupper. De har ingen egen validering
 * og ingen egen «lagre»-knapp — det er ett skjema med én innsending. Gir man en
 * seksjon egen knapp, har man i praksis laget et stegskjema med dårlig
 * fremdriftsvisning.
 */

type SeksjonRammeProps = {
    tittel: string;
    beskrivelse?: string;
    children: ReactNode;
};

function SeksjonRamme({ tittel, beskrivelse, children }: SeksjonRammeProps): React.JSX.Element {
    return (
        // Surface er allerede flex column; `gap="md"` gir samme feltavstand som
        // <Form> har mellom sine direkte barn.
        //
        // `border` er ikke pynt her, den er det som GJØR seksjonen til en seksjon:
        // en nøytral Surface er hvit (--ix-color-status-surface → surface-main-
        // default → #fff), og hvit flate på hvit side har ingen synlig kant. Uten
        // rammen ser brukeren bare felt etter felt, og hele poenget med mønsteret —
        // at skjemaet er DELT OPP — forsvinner. Alternativet er tonet
        // sidebakgrunn med hvite flater oppå; da trengs ikke rammen.
        <Surface as="section" border="default" padding="lg" radius="lg" gap="md">
            <div>
                <Heading as="h2">{tittel}</Heading>
                {beskrivelse && (
                    <Text size="sm" className="ix-color-foreground-main-subtle">
                        {beskrivelse}
                    </Text>
                )}
            </div>
            {children}
        </Surface>
    );
}

export default function SkjemaEnSide(): React.JSX.Element {
    const [innsendt, setInnsendt] = useState<SkjemaData | null>(null);

    const form = useForm<SkjemaData>({
        resolver: valibotResolver(skjemaSchema),
        defaultValues,
        /*
         * criteriaMode: 'all' ER PÅKREVD her, og det er ikke åpenbart.
         *
         * @hookform/resolvers sender `abortPipeEarly: !(criteriaMode === 'all')`
         * til Valibot. Med standard 'firstError' blir altså `abortPipeEarly: true`,
         * og da avbryter Valibot pipen ved første feil — slik at
         * `v.forward(v.partialCheck(...))`-reglene aldri kjører når et vanlig felt
         * er ugyldig. Resultatet: bedriftskunden ser IKKE at organisasjons-
         * nummeret mangler før alle andre feil er rettet, og feiloppsummeringen
         * er ufullstendig.
         *
         * Å sende `valibotResolver(schema, { abortPipeEarly: false })` hjelper
         * ikke — resolveren overskriver den verdien selv.
         */
        criteriaMode: 'all',
        /*
         * Må slås av NÅR DU HAR EN FEILOPPSUMMERING. RHF fokuserer som standard
         * det første ugyldige feltet etter submit, og det skjer ETTER at
         * oppsummeringen har flyttet fokus til seg selv — de to slåss om fokus, og
         * RHF vinner. Resultatet er at oppsummeringen aldri leses opp: brukeren
         * havner midt i skjemaet uten å vite hvor mange feil som venter.
         *
         * Velg én fokusstrategi: enten oppsummering (denne), eller første felt
         * (da dropper du oppsummeringen). Ikke begge.
         */
        shouldFocusError: false,
    });

    const {
        handleSubmit,
        setFocus,
        watch,
        formState: { errors, submitCount },
    } = form;

    // Rydder bort verdier i seksjoner som er skjult, se betingelser.ts.
    useNullstillSkjulteFelt(form);

    const kundetype = watch('kundetype');

    return (
        <MessageRegion>
            <div className="ix-max-w-sm ix-m-auto ix-py-xl">
                <Heading as="h1" addRecommendedSpacing>
                    Bli kunde
                </Heading>
                <Text long addRecommendedSpacing>
                    Alt på én side, delt i seksjoner. Ett skjema, én innsending — seksjonene grupperer
                    bare visuelt. Seksjonen «Om bedriften» dukker opp når du velger bedriftskunde, og
                    feltet «Navn på kortet» når du velger betalingskort. Samme felt finnes{' '}
                    <LinkText href="#/internTesting/skjema-steg">fordelt på steg</LinkText>.
                </Text>

                <Form onSubmit={handleSubmit(setInnsendt)} noValidate className="ix-gap-lg">
                    {/*
                     * Oppsummeringen står øverst i skjemaet, ikke over overskriften:
                     * den hører til skjemaet, og fokus skal lande inne i det brukeren
                     * skal rette på. `submitCount` gir «forsøk» gratis — den økes ved
                     * hvert submit, også de som feiler.
                     */}
                    <Feiloppsummering
                        errors={errors}
                        onVelgFelt={setFocus}
                        forsok={submitCount}
                        tittelMal="Skjemaet har {n} feil som må rettes"
                    />

                    <SeksjonRamme tittel="Om deg" beskrivelse="Vi bruker dette til å opprette kundeforholdet.">
                        <OmDeg form={form} />
                    </SeksjonRamme>

                    <SeksjonRamme tittel="Kundetype">
                        <Kundetype form={form} />
                        {/*
                         * Den betingede seksjonen ligger UMIDDELBART etter valget som
                         * utløser den, i samme DOM-rekkefølge som visuelt. Ligger den
                         * lenger ned på siden, oppdager en skjermleserbruker som
                         * navigerer sekvensielt aldri at valget førte til noe nytt.
                         */}
                    </SeksjonRamme>

                    {visBedriftsfelt(kundetype) && (
                        <SeksjonRamme
                            tittel="Om bedriften"
                            beskrivelse="Vises fordi du valgte bedriftskunde."
                        >
                            <OmBedriften form={form} />
                        </SeksjonRamme>
                    )}

                    <SeksjonRamme tittel="Tjenester og samtykke">
                        <TjenesterOgSamtykke form={form} />
                    </SeksjonRamme>

                    <Button type="submit" variant="primary" size="lg" className="ix-self-start">
                        Send inn
                    </Button>
                </Form>

                {innsendt && (
                    <Surface border="default" padding="lg" radius="lg" gap="md" className="ix-mt-xl">
                        {/* Meldingen mountes ETTER sidelast og annonseres derfor av
                            MessageRegion — den er kvitteringen brukeren «hører». */}
                        <Message status="success" title="Skjemaet er sendt inn" fullWidth>
                            Vi tar kontakt innen tre virkedager.
                        </Message>
                        <Heading as="h2">Innsendte verdier</Heading>
                        <pre data-testid="innsendt-data">{JSON.stringify(innsendt, null, 2)}</pre>
                    </Surface>
                )}
            </div>
        </MessageRegion>
    );
}
