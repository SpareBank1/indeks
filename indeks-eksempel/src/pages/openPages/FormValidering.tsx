import { valibotResolver } from '@hookform/resolvers/valibot';
import {
    Button,
    Card,
    Checkbox,
    CheckboxGroup,
    Combobox,
    DateField,
    Form,
    Heading,
    PhoneNumberField,
    RadioGroup,
    Select,
    TextArea,
    TextField,
} from '@sb1/indeks-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';
import './form-validering.css';

/*
 * Referanse-eksempel: Indeks-form-komponenter + React Hook Form (RHF) + Valibot.
 *
 * Poeng med siden:
 *   1. Vise hvordan HVER form-komponent kobles til RHF med minst mulig lim-kode.
 *   2. Fungere som datagrunnlag for en Playwright e2e-test (tomt submit → feil,
 *      ugyldig input → Valibot-melding, korrekt input → rå verdier vises).
 *
 * Alle felt kobles med `{...register('felt')}` — komponentene oppfører seg som
 * native inputs (videresender ref, sender ekte change/blur-events). Kommentarene
 * under nevner bare det som IKKE er åpenbart per felt.
 *
 * Alle komponenter er «bring-your-own-validation»: `errorMessage` tar en ferdig
 * streng. RHF + Valibot produserer strengen; komponenten viser den og setter
 * aria-invalid selv.
 */

// i18n-konvensjon: alle synlige/leste tekster er strenger her (norsk bokmål),
// ikke hardkodet inne i komponentene.
const schema = v.object({
    navn: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(2, 'Navn må ha minst 2 tegn')
    ),
    epost: v.pipe(
        v.string(),
        v.trim(),
        v.nonEmpty('E-post er påkrevd'),
        v.email('Ugyldig e-postadresse')
    ),
    // Rå verdi = 11 siffer uten separatorer. Feltet formateres visuelt via
    // format="account", men innsendt/validert verdi er rå (se TextField-feltet under).
    kontonummer: v.pipe(
        v.string(),
        v.regex(/^\d{11}$/, 'Kontonummer må være 11 siffer')
    ),
    fraKonto: v.pipe(v.string(), v.nonEmpty('Velg en konto')),
    melding: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(5, 'Meldingen må ha minst 5 tegn')
    ),
    kontotype: v.pipe(v.string(), v.nonEmpty('Velg en kontotype')),
    tjenester: v.pipe(
        v.array(v.string()),
        v.minLength(1, 'Velg minst én tjeneste')
    ),
    land: v.pipe(v.string(), v.nonEmpty('Velg et land')),
    // DateField sender/validerer ISO (åååå-mm-dd); den synlige inputen viser dd.mm.åååå.
    fodselsdato: v.pipe(
        v.string(),
        v.regex(/^\d{4}-\d{2}-\d{2}$/, 'Velg en gyldig dato')
    ),
    // PhoneNumberField er to uavhengige felt: landkode + rå nummer (8 siffer).
    landkode: v.pipe(v.string(), v.nonEmpty('Velg landkode')),
    tlf: v.pipe(
        v.string(),
        v.regex(/^\d{8}$/, 'Telefonnummer må være 8 siffer')
    ),
    // v.boolean + check (ikke v.literal(true)) → verditypen forblir boolean, så
    // avkrysningsboksen kan starte umarkert (false) og feile ved tomt submit.
    samtykke: v.pipe(
        v.boolean(),
        v.check((value) => value === true, 'Du må godta vilkårene')
    ),
});

type FormData = v.InferOutput<typeof schema>;

const defaultValues: FormData = {
    navn: '',
    epost: '',
    kontonummer: '',
    fraKonto: '',
    melding: '',
    kontotype: '',
    tjenester: [],
    land: '',
    fodselsdato: '',
    landkode: '',
    tlf: '',
    samtykke: false,
};

const kontoOptions = [
    { value: 'brukskonto', label: 'Brukskonto – 1234 56 78901' },
    { value: 'sparekonto', label: 'Sparekonto – 1234 56 78902' },
    { value: 'bsu', label: 'BSU – 1234 56 78903' },
];

const kontotypeOptions = [
    { value: 'privat', label: 'Privat' },
    { value: 'bedrift', label: 'Bedrift' },
];

const tjenesteOptions = [
    { value: 'nettbank', label: 'Nettbank' },
    { value: 'mobilbank', label: 'Mobilbank' },
    { value: 'kort', label: 'Betalingskort' },
];

const landOptions = [
    { value: 'no', label: 'Norge' },
    { value: 'se', label: 'Sverige' },
    { value: 'dk', label: 'Danmark' },
    { value: 'fi', label: 'Finland' },
];

export default function FormValidering() {
    const [submitted, setSubmitted] = useState<FormData | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: valibotResolver(schema),
        defaultValues,
    });

    function onValid(data: FormData) {
        setSubmitted(data);
    }

    return (
        <div className="ix-max-w-sm ix-m-auto ix-py-xl">
            <Card className="ix-m-auto ix-mb-5xl ix-p-lg ix-color-surface-main-default">
                <Heading as="h1" addRecommendedSpacing>
                    Form-validering
                </Heading>

                <Form onSubmit={handleSubmit(onValid)} noValidate>
                    <TextField
                        label="Navn"
                        {...register('navn')}
                        errorMessage={errors.navn?.message}
                    />

                    <TextField
                        label="E-post"
                        type="email"
                        {...register('epost')}
                        errorMessage={errors.epost?.message}
                    />


                    <TextField
                        label="Kontonummer"
                        className="form-validering__narrow"
                        inputMode="numeric"
                        format="account"
                        {...register('kontonummer')}
                        errorMessage={errors.kontonummer?.message}
                    />

                    <Select
                        label="Fra konto"
                        placeholder="Velg konto"
                        className="form-validering__narrow"
                        options={kontoOptions}
                        {...register('fraKonto')}
                        errorMessage={errors.fraKonto?.message}
                    />

                    {/* maxLength/minLength aktiverer ix-field sin tegnteller automatisk
                        (viser «0/200» / «0 tegn (minimum 5)»). */}
                    <TextArea
                        label="Melding"
                        description="Skriv en kort melding"
                        minLength={5}
                        maxLength={200}
                        {...register('melding')}
                        errorMessage={errors.melding?.message}
                    />


                    <RadioGroup
                        legend="Kontotype"
                        orientation="horizontal"
                        options={kontotypeOptions}
                        {...register('kontotype')}
                        errorMessage={errors.kontotype?.message}
                    />


                    <CheckboxGroup
                        legend="Tjenester"
                        options={tjenesteOptions}
                        {...register('tjenester')}
                        errorMessage={errors.tjenester?.message}
                    />


                    <Combobox
                        label="Land"
                        placeholder="Søk etter land"
                        className="form-validering__narrow"
                        options={landOptions}
                        noHitsText="Ingen treff"
                        defaultValue={defaultValues.land}
                        {...register('land')}
                        errorMessage={errors.land?.message}
                    />

                    {/* Event-basert onChange (ISO i target.value) + proxy-ref, så
                        {...register()} spres rett på — som de øvrige feltene. */}
                    <DateField
                        label="Fødselsdato"
                        description="Format: dd.mm.åååå"
                        openLabel="Åpne kalender"
                        {...register('fodselsdato')}
                        errorMessage={errors.fodselsdato?.message}
                    />

                    {/* To uavhengige RHF-felt: landkode + rå nummer. Hver binder via sin
                        egen register-spread, og har sin egen feilmelding. */}
                    <PhoneNumberField
                        label="Mobilnummer"
                        className="form-validering__narrow"
                        description="Format: 8 siffer, f.eks. 123 45 678"
                        countryLabel="Landkode"
                        numberLabel="Telefonnummer"
                        noHitsText="Ingen treff"
                        toggleLabel="Vis landkoder"
                        countryField={register('landkode')}
                        numberField={register('tlf')}
                        errorMessage={errors.tlf?.message}
                        countryErrorMessage={errors.landkode?.message}
                    />

                    <Checkbox
                        label="Jeg godtar vilkårene"
                        {...register('samtykke')}
                        errorMessage={errors.samtykke?.message}
                    />

                    <Button type="submit" variant="primary" size="lg">
                        Send inn
                    </Button>
                </Form>
            </Card>

            {submitted && (
                <Card className="ix-m-auto ix-mb-5xl ix-p-lg ix-color-surface-main-default">
                    <Heading as="h2" addRecommendedSpacing>
                        Innsendt
                    </Heading>
                    {/* data-testid gjør at e2e-testen kan asserte de RÅ verdiene. */}
                    <pre data-testid="submitted-data">{JSON.stringify(submitted, null, 2)}</pre>
                </Card>
            )}
        </div>
    );
}
