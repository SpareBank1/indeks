import {
    Checkbox,
    CheckboxGroup,
    Combobox,
    DateField,
    PhoneNumberField,
    RadioGroup,
    Select,
    TextArea,
    TextField,
} from '@sb1/indeks-react';
import type { UseFormReturn } from 'react-hook-form';
import {
    bostedslandOptions,
    kontaktmetodeOptions,
    kundetypeOptions,
    tjenesteOptions,
    visKortnavn,
    type SkjemaData,
} from './skjema-data';

/*
 * Feltgruppene, delt mellom begge strukturvariantene.
 *
 * Grunnen til at de bor her og ikke i sidene: forskjellen mellom «alt på én
 * side» og «steg for steg» skal være REN STRUKTUR. Ligger feltene i hver sin
 * side, sniker det seg fort inn små forskjeller i labels eller validering, og da
 * sammenligner man ikke lenger de to mønstrene — man sammenligner to skjemaer.
 *
 * Hver seksjon rendrer bare feltene (et fragment). Innrammingen — Surface med
 * overskrift, eller et steg — er sidens ansvar.
 */

export type SeksjonProps = {
    form: UseFormReturn<SkjemaData>;
};

export function OmDeg({ form }: SeksjonProps): React.JSX.Element {
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <>
            <TextField label="Navn" autoComplete="name" {...register('navn')} errorMessage={errors.navn?.message} />

            <DateField
                label="Fødselsdato"
                description="Format: dd.mm.åååå"
                openLabel="Åpne kalender"
                className="skjema__smalt"
                {...register('fodselsdato')}
                errorMessage={errors.fodselsdato?.message}
            />

            <TextField
                label="E-post"
                type="email"
                autoComplete="email"
                {...register('epost')}
                errorMessage={errors.epost?.message}
            />

            {/* To uavhengige RHF-felt: landkode + rå nummer, med egen feilmelding hver.
                defaultCountryCode må speile defaultValues.landkode — forhåndsvalget
                pushes ikke inn i web-komponenten fra defaultValues alene. */}
            <PhoneNumberField
                label="Mobilnummer"
                description="Format: 8 siffer, f.eks. 123 45 678"
                className="skjema__smalt"
                countryLabel="Landkode"
                numberLabel="Telefonnummer"
                noHitsText="Ingen treff"
                toggleLabel="Vis landkoder"
                defaultCountryCode="47"
                countryField={register('landkode')}
                numberField={register('tlf')}
                errorMessage={errors.tlf?.message}
                countryErrorMessage={errors.landkode?.message}
            />

            {/* Combobox framfor Select fordi lista er lang nok til at søk hjelper.
                Merk at den ikke har defaultValue her: defaultValues.bostedsland er
                tom, og et forhåndsvalg måtte i så fall settes på BEGGE steder. */}
            <Combobox
                label="Bostedsland"
                placeholder="Søk etter land"
                className="skjema__smalt"
                options={bostedslandOptions}
                noHitsText="Ingen treff"
                {...register('bostedsland')}
                errorMessage={errors.bostedsland?.message}
            />
        </>
    );
}

export function Kundetype({ form }: SeksjonProps): React.JSX.Element {
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <RadioGroup
            legend="Er du privat- eller bedriftskunde?"
            description="Bedriftskunder må oppgi organisasjonsnummer."
            options={kundetypeOptions}
            {...register('kundetype')}
            errorMessage={errors.kundetype?.message}
        />
    );
}

export function OmBedriften({ form }: SeksjonProps): React.JSX.Element {
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <>
            {/* format="orgnr" viser «123 456 789»; innsendt og validert verdi er rå. */}
            <TextField
                label="Organisasjonsnummer"
                inputMode="numeric"
                format="orgnr"
                className="skjema__smalt"
                {...register('orgnummer')}
                errorMessage={errors.orgnummer?.message}
            />

            <TextField
                label="Firmanavn"
                autoComplete="organization"
                {...register('firmanavn')}
                errorMessage={errors.firmanavn?.message}
            />
        </>
    );
}

export function TjenesterOgSamtykke({ form }: SeksjonProps): React.JSX.Element {
    const {
        register,
        watch,
        formState: { errors },
    } = form;

    return (
        <>
            <CheckboxGroup
                legend="Hvilke tjenester vil du ha?"
                options={tjenesteOptions}
                {...register('tjenester')}
                errorMessage={errors.tjenester?.message}
            />

            {/* Betinget felt PÅ SAMME SKJERM som utløseren. Feltet dukker opp rett
                under avkrysningen som utløste det, slik at endringen skjer der
                blikket allerede er — ikke lenger ned eller på neste steg. */}
            {visKortnavn(watch('tjenester')) && (
                <TextField
                    label="Navn på kortet"
                    description="Navnet som skal trykkes på betalingskortet."
                    {...register('kortnavn')}
                    errorMessage={errors.kortnavn?.message}
                />
            )}

            {/* Select framfor Combobox: tre kjente valg, ingenting å søke i. */}
            <Select
                label="Hvordan vil du kontaktes?"
                placeholder="Velg kontaktmetode"
                className="skjema__smalt"
                options={kontaktmetodeOptions}
                {...register('kontaktmetode')}
                errorMessage={errors.kontaktmetode?.message}
            />

            <Checkbox
                label="Jeg godtar vilkårene"
                {...register('samtykke')}
                errorMessage={errors.samtykke?.message}
            />

            {/* maxLength aktiverer ix-field sin tegnteller automatisk («0/200»).
                Frivillig felt: står tomt uten å gi feil, så det viser at
                feiloppsummeringen bare lister det som faktisk er galt. */}
            <TextArea
                label="Noe vi bør vite?"
                description="Frivillig."
                maxLength={200}
                {...register('melding')}
                errorMessage={errors.melding?.message}
            />
        </>
    );
}
