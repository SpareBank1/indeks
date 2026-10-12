import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { visBedriftsfelt, visKortnavn, type SkjemaData } from './skjema-data';

/**
 * Nullstiller betingede felt når de skjules.
 *
 * Uten dette lekker skjulte verdier ut i innsendingen: fyller brukeren inn
 * organisasjonsnummer, og deretter bytter til «Privatkunde», er feltet borte fra
 * skjermen — men verdien ligger fortsatt i skjematilstanden og blir sendt inn.
 * (React Hook Form beholder verdien når et felt avmonteres; `shouldUnregister`
 * er `false` som standard, og det er den fornuftige standarden — ellers ville et
 * felt mistet verdien hver gang det ble skjult av en annen grunn, som et
 * kollapset panel.)
 *
 * `resetField` er riktig verktøy her, ikke `setValue('')`: den setter verdien
 * tilbake til `defaultValues` OG rydder bort feiltilstand og `touched` for
 * feltet. Ellers ville en feilmelding fra bedrift-grenen kunne henge igjen i
 * feiloppsummeringen etter at brukeren byttet til privat.
 */
export function useNullstillSkjulteFelt(form: UseFormReturn<SkjemaData>): void {
    const { watch, resetField } = form;
    const kundetype = watch('kundetype');
    const tjenester = watch('tjenester');

    useEffect(() => {
        if (!visBedriftsfelt(kundetype)) {
            resetField('orgnummer');
            resetField('firmanavn');
        }
    }, [kundetype, resetField]);

    // Deps på en streng, ikke på arrayet: et nytt array med samme innhold ville
    // kjørt effekten på nytt ved hver render av CheckboxGroup.
    const tjenesterNokkel = tjenester.join(',');
    useEffect(() => {
        if (!visKortnavn(tjenesterNokkel ? tjenesterNokkel.split(',') : [])) {
            resetField('kortnavn');
        }
    }, [tjenesterNokkel, resetField]);
}
