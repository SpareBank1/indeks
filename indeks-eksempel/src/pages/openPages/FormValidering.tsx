import { valibotResolver } from '@hookform/resolvers/valibot';
import {
    Button,
    Card,
    Checkbox,
    CheckboxGroup,
    Combobox,
    Form,
    Heading,
    RadioGroup,
    Select,
    TextArea,
    TextField,
} from '@sb1/indeks-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as v from 'valibot';

/*
 * Referanse-eksempel: Indeks-form-komponenter + React Hook Form (RHF) + Valibot.
 *
 * Poeng med siden:
 *   1. Vise hvordan HVER form-komponent kobles til RHF med minst mulig lim-kode.
 *   2. Fungere som datagrunnlag for en Playwright e2e-test (tomt submit → feil,
 *      ugyldig input → Valibot-melding, korrekt input → rå verdier vises).
 *
 * To integrasjonsmønstre (se kommentarer per felt):
 *   Mønster A — `register()`: for komponenter som videresender ref og sender et
 *     change-event i RHF-form (TextField — også i formatter-modus, TextArea, Select,
 *     Checkbox, Combobox, RadioGroup).
 *   Mønster B — `<Controller>`: for komponenter der field.value ikke er en enkel
 *     input-verdi (CheckboxGroup → string[]).
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
    // formatPattern, men innsendt/validert verdi er rå (se Controller under).
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
        control,
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
                    {/* Mønster A (register): TextField videresender ref til <input>. */}
                    <TextField
                        label="Navn"
                        {...register('navn')}
                        errorMessage={errors.navn?.message}
                    />

                    {/* Mønster A (register): e-post. */}
                    <TextField
                        label="E-post"
                        type="email"
                        {...register('epost')}
                        errorMessage={errors.epost?.message}
                    />

                    {/*
                        Mønster A (register) for TextField i FORMATTER-modus: med
                        formatPattern eier ix-field DOM-verdien, men TextField
                        videresender en proxy-ref til register() slik at RHF leser rå
                        via ref.value og re-formaterer ved skriving. Bindes derfor helt
                        likt et uformatert felt. Innsendt verdi er rå (11 siffer uten
                        mellomrom), mens visningen er «0000 00 00000».
                    */}
                    <TextField
                        label="Kontonummer"
                        inputMode="numeric"
                        formatPattern="0000 00 00000"
                        {...register('kontonummer')}
                        errorMessage={errors.kontonummer?.message}
                    />

                    {/* Mønster A (register): Select videresender ref til <select>. */}
                    <Select
                        label="Fra konto"
                        placeholder="Velg konto"
                        options={kontoOptions}
                        {...register('fraKonto')}
                        errorMessage={errors.fraKonto?.message}
                    />

                    {/* Mønster A (register): TextArea videresender ref til <textarea>. */}
                    <TextArea
                        label="Melding"
                        {...register('melding')}
                        errorMessage={errors.melding?.message}
                    />

                    {/*
                        Mønster A (register): RadioGroup rendrer ekte native
                        <input type="radio">. register-objektet (ref/onChange/onBlur)
                        rutes rett ned på hver input; RHF eier checked via de native
                        refene og skriver defaultValues inn ved mount — så vi trenger
                        INGEN egen defaultValue her (til forskjell fra Combobox).
                    */}
                    <RadioGroup
                        legend="Kontotype"
                        options={kontotypeOptions}
                        {...register('kontotype')}
                        errorMessage={errors.kontotype?.message}
                    />

                    {/* Mønster B (Controller): CheckboxGroup har custom onChange(values[]). */}
                    <Controller
                        name="tjenester"
                        control={control}
                        render={({ field, fieldState }) => (
                            <CheckboxGroup
                                legend="Tjenester"
                                options={tjenesteOptions}
                                value={field.value}
                                onChange={field.onChange}
                                errorMessage={fieldState.error?.message}
                            />
                        )}
                    />

                    {/*
                        Mønster A (register): Combobox sender et syntetisk change-
                        event i RHF-form (verdi i target.value), så {...register()}
                        kan spres rett på. `ref` → host (fokus-ved-feil via WC),
                        `onChange`/`onBlur` → syntetiske events, `name` → skjult
                        <select>. defaultValue settes separat fordi register er
                        ukontrollert (useForm sin defaultValues pusher ikke inn).
                    */}
                    <Combobox
                        label="Land"
                        placeholder="Søk etter land"
                        options={landOptions}
                        noHitsText="Ingen treff"
                        defaultValue={defaultValues.land}
                        {...register('land')}
                        errorMessage={errors.land?.message}
                    />


                    {/*
                        Mønster A (register): Checkbox videresender ref til <input
                        type=checkbox>. RHF register mapper checked ↔ value; Valibot
                        v.literal(true) krever avkrysning.
                    */}
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
