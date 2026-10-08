import { valibotResolver } from '@hookform/resolvers/valibot';
import { Button, Form, Heading, HStack, LinkText, Message, MessageRegion, Surface, Text } from '@sb1/indeks-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useNullstillSkjulteFelt } from './betingelser';
import { Feiloppsummering } from './Feiloppsummering';
import { Kundetype, OmBedriften, OmDeg, TjenesterOgSamtykke } from './Seksjoner';
import { StegIndikator } from './StegIndikator';
import { defaultValues, skjemaSchema, synligeSteg, type SkjemaData } from './skjema-data';
import { useStegSkjema } from './useStegSkjema';
import './skjema.css';

/*
 * MØNSTER 2: steg for steg.
 *
 * Når passer det?
 *   - Skjemaet er langt nok til å virke avskrekkende i én skjerm.
 *   - Rekkefølgen betyr noe — senere spørsmål avhenger av tidligere svar.
 *   - Noen spørsmål forgrener flyten, slik at ikke alle skal svare på alt.
 *   - Brukeren gjør dette sjelden (søknad, onboarding) og har nytte av å bli
 *     ledet. Det motsatte — et skjema en saksbehandler fyller ut tjue ganger om
 *     dagen — blir tregere av steg, ikke raskere.
 *
 * ETT <form> RUNDT ALLE STEGENE, ikke ett skjema per steg. Da eier React Hook
 * Form hele tilstanden, og verdier fra tidligere steg beholdes selv om feltene
 * er avmontert (RHF sitt `shouldUnregister` er `false` som standard). Ett skjema
 * per steg ville krevd at du løftet og skjøtet sammen tilstanden selv.
 *
 * «Neste» er en SUBMIT-knapp, ikke en vanlig knapp. Det er ikke kosmetikk: i et
 * <form> utløser Enter-tasten den første submit-knappen. Er «Neste» en
 * `type="button"`, gjør Enter ingenting, og brukere som fyller ut skjema fra
 * tastaturet står fast. `useStegSkjema` tar derfor imot submit-eventet og
 * avgjør om det betyr «gå videre» eller «send inn».
 *
 * ALL STEGMEKANIKK LIGGER I useStegSkjema. Denne fila deklarerer bare hvilke
 * steg som finnes (via `synligeSteg`) og rendrer det aktive — indikatoren,
 * valideringen per steg og URL-en utledes av samme stegliste, så de kan ikke
 * komme i utakt med hverandre.
 */

export default function SkjemaSteg(): React.JSX.Element {
    const [innsendt, setInnsendt] = useState<SkjemaData | null>(null);

    const form = useForm<SkjemaData>({
        resolver: valibotResolver(skjemaSchema),
        defaultValues,
        // Påkrevd for at de betingede reglene skal kjøre — se den lange
        // forklaringen i SkjemaEnSide.tsx.
        criteriaMode: 'all',
        // Feiloppsummeringen eier fokus etter et mislykket forsøk; uten dette
        // ville RHF fokusert første ugyldige felt i stedet. Se SkjemaEnSide.tsx.
        shouldFocusError: false,
    });

    const {
        setFocus,
        watch,
        formState: { errors },
    } = form;

    useNullstillSkjulteFelt(form);

    // Steglista er BEREGNET av svarene, ikke hardkodet: velger du privatkunde,
    // finnes ikke bedriftssteget lenger — verken i indikatoren, i valideringen
    // eller som lovlig URL.
    const kundetype = watch('kundetype');
    const steg = synligeSteg(kundetype);

    /*
     * URL-adapteren. Eksempelappen bruker `createHashRouter`, så ruterens
     * søkeparametere havner INNE i hash-en (#/internTesting/skjema-steg?steg=…).
     * Det er grunnen til at hooken tar imot verdi + setter i stedet for å lese
     * `window.location` selv: en hook som skrev til den ekte søkestrengen ville
     * lagt parameteren på feil side av `#`, der ruteren ikke ser den.
     */
    const [searchParams, setSearchParams] = useSearchParams();
    const settStegIUrl = useCallback(
        (stegId: string, erstatt = false): void => {
            setSearchParams(
                (forrige) => {
                    const neste = new URLSearchParams(forrige);
                    neste.set('steg', stegId);
                    return neste;
                },
                { replace: erstatt }
            );
        },
        [setSearchParams]
    );

    const { aktivt, index, erSisteSteg, forsok, overskriftRef, tilbake, handterSubmit } = useStegSkjema({
        steg,
        form,
        stegIUrl: searchParams.get('steg'),
        settStegIUrl,
        onSend: setInnsendt,
    });

    if (innsendt) {
        return (
            <MessageRegion>
                <div className="ix-max-w-sm ix-m-auto ix-py-xl">
                    <Heading as="h1" addRecommendedSpacing>
                        Bli kunde
                    </Heading>
                    <Surface border="default" padding="lg" radius="lg" gap="md">
                        <Message status="success" title="Skjemaet er sendt inn" fullWidth>
                            Vi tar kontakt innen tre virkedager.
                        </Message>
                        <Heading as="h2">Innsendte verdier</Heading>
                        <pre data-testid="innsendt-data">{JSON.stringify(innsendt, null, 2)}</pre>
                    </Surface>
                </div>
            </MessageRegion>
        );
    }

    return (
        <MessageRegion>
            <div className="ix-max-w-sm ix-m-auto ix-py-xl">
                <Heading as="h1" addRecommendedSpacing>
                    Bli kunde
                </Heading>
                <Text long addRecommendedSpacing>
                    Samme felt som{' '}
                    <LinkText href="#/internTesting/skjema-en-side">alt på én side</LinkText>, men én
                    skjerm om gangen. Velger du privatkunde, hoppes hele steget «Om bedriften» over, og
                    indikatoren går fra «av 4» til «av 3». Steget ligger i URL-en, så nettleserens
                    tilbakeknapp går ett steg bakover. Oppfriskning starter derimot på nytt: dette
                    skjemaet lagrer ikke svarene noe sted, og et steg uten svarene bak seg kan ikke
                    vises.
                </Text>

                <StegIndikator
                    steg={steg}
                    aktivIndex={index}
                    navLabel="Fremdrift i skjemaet"
                    stegTekstMal="Steg {n} av {total}"
                    ferdigTekst="ferdig"
                />

                <Surface border="default" padding="lg" radius="lg" gap="md">
                    <Form onSubmit={handterSubmit} noValidate>
                        {/* tabIndex={-1} gjør overskriften til et fokusmål uten å legge
                            den i tabrekkefølgen. */}
                        <Heading as="h2" ref={overskriftRef} tabIndex={-1}>
                            {aktivt.tittel}
                        </Heading>

                        <Feiloppsummering
                            errors={errors}
                            felt={aktivt.felt}
                            onVelgFelt={setFocus}
                            forsok={forsok}
                            tittelMal="Steget har {n} feil som må rettes"
                        />

                        {aktivt.id === 'om-deg' && <OmDeg form={form} />}
                        {aktivt.id === 'kundetype' && <Kundetype form={form} />}
                        {aktivt.id === 'bedrift' && <OmBedriften form={form} />}
                        {aktivt.id === 'tjenester' && <TjenesterOgSamtykke form={form} />}

                        <HStack gap="sm" className="ix-mt-md">
                            {/* «Tilbake» validerer ikke: brukeren skal alltid kunne gå
                                bakover, også fra et halvferdig steg. Verdiene beholdes. */}
                            {index > 0 && (
                                <Button type="button" variant="secondary" size="lg" onClick={tilbake}>
                                    Tilbake
                                </Button>
                            )}
                            <Button type="submit" variant="primary" size="lg">
                                {erSisteSteg ? 'Send inn' : 'Neste'}
                            </Button>
                        </HStack>
                    </Form>
                </Surface>
            </div>
        </MessageRegion>
    );
}
