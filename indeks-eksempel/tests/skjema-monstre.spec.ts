import { expect, test, type Page } from '@playwright/test';

/*
 * Funksjonell e2e mot de to skjema-strukturmønstrene («alt på én side» og «steg
 * for steg»). Verifiserer det som er lett å knekke uten å merke det:
 *
 *   - feiloppsummeringen lister ALLE feil, inkludert de betingede (regresjonstest
 *     for criteriaMode: 'all' — uten den forsvinner de betingede feilene)
 *   - lenkene i oppsummeringen flytter fokus til feltet
 *   - betingede felt/seksjoner dukker opp og forsvinner med valget
 *   - skjulte betingede verdier lekker ikke ut i innsendingen
 *   - steg hoppes over, og steg-telleren teller riktig
 */

/** Fyller ut alt som gjelder alle, uansett gren. Kalles på riktig steg/seksjon. */
async function fyllOmDeg(page: Page): Promise<void> {
    await page.getByLabel('Navn').fill('Kari Nordmann');
    await page.getByLabel('Fødselsdato').fill('01.05.1985');
    await page.getByLabel('E-post').fill('kari@example.com');
    await page.getByLabel('Telefonnummer').fill('12345678');
    await velgBostedsland(page, 'Norge');
}

/** Combobox: skriv i søkefeltet og velg fra lista, som en bruker ville gjort. */
async function velgBostedsland(page: Page, land: string): Promise<void> {
    const felt = page.getByLabel('Bostedsland');
    await felt.click();
    await felt.fill(land);
    await page.getByRole('option', { name: land, exact: true }).click();
}

test.describe('Alt på én side', () => {
    test.beforeEach(async ({ page }) => {
        // Relativ URL (uten ledende slash) så den resolver mot /eksempel/-basen.
        await page.goto('#/internTesting/skjema-en-side');
        await expect(page.getByRole('heading', { name: 'Bli kunde' })).toBeVisible();
    });

    test('seksjonene er egne section-elementer med overskrift', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Om deg', level: 2 })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Kundetype', level: 2 })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Tjenester og samtykke', level: 2 })).toBeVisible();
        // Betinget seksjon er ikke i DOM før valget er gjort.
        await expect(page.getByRole('heading', { name: 'Om bedriften', level: 2 })).toHaveCount(0);
    });

    test('tomt submit gir feiloppsummering som lenker til feltene', async ({ page }) => {
        await page.getByRole('button', { name: 'Send inn' }).click();

        const oppsummering = page.getByRole('group', { name: /Skjemaet har \d+ feil/ });
        await expect(oppsummering).toBeVisible();
        // Fokus flyttes til oppsummeringen, ikke til første felt.
        await expect(oppsummering).toBeFocused();

        /*
         * Feilene står i visuell feltrekkefølge, ikke i errors-objektets rekkefølge.
         * Merk at «Noe vi bør vite?» (TextArea) IKKE er med: det er et frivillig
         * felt, og oppsummeringen skal bare liste det som faktisk er galt.
         */
        await expect(oppsummering.getByRole('button')).toHaveText([
            'Navn må ha minst 2 tegn',
            'Velg en gyldig fødselsdato',
            'E-post er påkrevd',
            'Telefonnummer må være 8 siffer',
            'Velg bostedsland',
            'Velg om du er privat- eller bedriftskunde',
            'Velg minst én tjeneste',
            'Velg hvordan vi skal kontakte deg',
            'Du må godta vilkårene',
        ]);

        // Lenken flytter fokus til feltet den peker på.
        await oppsummering.getByRole('button', { name: 'E-post er påkrevd' }).click();
        await expect(page.getByLabel('E-post')).toBeFocused();

        await expect(page.getByTestId('innsendt-data')).toHaveCount(0);
    });

    test('bedriftsvalg avdekker seksjonen, og de betingede feilene vises SAMTIDIG som de vanlige', async ({
        page,
    }) => {
        await page.getByText('Bedriftskunde', { exact: true }).click();
        await expect(page.getByRole('heading', { name: 'Om bedriften', level: 2 })).toBeVisible();

        await page.getByRole('button', { name: 'Send inn' }).click();

        /*
         * Kjernen i regresjonstesten: navn/e-post er tomme SAMTIDIG som
         * organisasjonsnummer mangler. Uten criteriaMode: 'all' avbryter Valibot
         * pipen på første feil, og de forward/partialCheck-baserte reglene under
         * kjører aldri — da mangler disse to linjene.
         */
        const oppsummering = page.getByRole('group', { name: /Skjemaet har \d+ feil/ });
        await expect(oppsummering.getByRole('button', { name: 'Organisasjonsnummer må være 9 siffer' })).toBeVisible();
        await expect(oppsummering.getByRole('button', { name: 'Firmanavn må ha minst 2 tegn' })).toBeVisible();
        // exact: true — «Navn må ha …» er ellers en delstreng av «Firmanavn må ha …».
        await expect(oppsummering.getByRole('button', { name: 'Navn må ha minst 2 tegn', exact: true })).toBeVisible();
    });

    test('betalingskort avdekker kortnavn-feltet', async ({ page }) => {
        await expect(page.getByLabel('Navn på kortet')).toHaveCount(0);
        await page.getByText('Betalingskort', { exact: true }).click();
        await expect(page.getByLabel('Navn på kortet')).toBeVisible();
        await page.getByText('Betalingskort', { exact: true }).click();
        await expect(page.getByLabel('Navn på kortet')).toHaveCount(0);
    });

    test('verdi i skjult betinget felt lekker ikke ut i innsendingen', async ({ page }) => {
        await fyllOmDeg(page);

        // Fyll bedriftsfeltene, og bytt DERETTER til privat.
        await page.getByText('Bedriftskunde', { exact: true }).click();
        await page.getByLabel('Organisasjonsnummer').fill('123456789');
        await page.getByLabel('Firmanavn').fill('Nordmann AS');
        await page.getByText('Privatkunde', { exact: true }).click();
        await expect(page.getByRole('heading', { name: 'Om bedriften', level: 2 })).toHaveCount(0);

        await page.getByText('Nettbank', { exact: true }).click();
        await page.getByLabel('Hvordan vil du kontaktes?').selectOption('epost');
        await page.getByText('Jeg godtar vilkårene').click();
        await page.getByRole('button', { name: 'Send inn' }).click();

        const data = JSON.parse((await page.getByTestId('innsendt-data').textContent()) ?? '{}');
        expect(data.kundetype).toBe('privat');
        // Nullstilt av useNullstillSkjulteFelt — ellers hadde 123456789 blitt sendt inn.
        expect(data.orgnummer).toBe('');
        expect(data.firmanavn).toBe('');
        // Rå verdier: telefonnummer uten separatorer, dato som ISO.
        expect(data.tlf).toBe('12345678');
        expect(data.fodselsdato).toBe('1985-05-01');
        expect(data.landkode).toBe('47');
    });
});

test.describe('Steg for steg', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('#/internTesting/skjema-steg');
        await expect(page.getByRole('heading', { name: 'Bli kunde' })).toBeVisible();
    });

    test('«Neste» validerer bare gjeldende steg og blokkerer navigasjon', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Om deg', level: 2 })).toBeVisible();
        await expect(page.getByText('Steg 1 av 4')).toBeVisible();

        await page.getByRole('button', { name: 'Neste' }).click();

        // Blir stående på steget.
        await expect(page.getByRole('heading', { name: 'Om deg', level: 2 })).toBeVisible();

        const oppsummering = page.getByRole('group', { name: /Steget har \d+ feil/ });
        await expect(oppsummering).toBeFocused();
        // Bare dette stegets felt — ingenting om tjenester, kontaktmetode eller samtykke.
        await expect(oppsummering.getByRole('button')).toHaveText([
            'Navn må ha minst 2 tegn',
            'Velg en gyldig fødselsdato',
            'E-post er påkrevd',
            'Telefonnummer må være 8 siffer',
            'Velg bostedsland',
        ]);
    });

    test('privatkunde hopper over bedriftssteget og telleren krymper til 3', async ({ page }) => {
        await fyllOmDeg(page);
        await page.getByRole('button', { name: 'Neste' }).click();

        await expect(page.getByRole('heading', { name: 'Kundetype', level: 2 })).toBeVisible();
        await expect(page.getByText('Steg 2 av 4')).toBeVisible();

        await page.getByText('Privatkunde', { exact: true }).click();
        // Telleren krymper straks valget er tatt.
        await expect(page.getByText('Steg 2 av 3')).toBeVisible();

        await page.getByRole('button', { name: 'Neste' }).click();
        // Hoppet rett til siste steg, ikke til «Om bedriften».
        await expect(page.getByRole('heading', { name: 'Tjenester og samtykke', level: 2 })).toBeVisible();
        await expect(page.getByText('Steg 3 av 3')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Send inn' })).toBeVisible();
    });

    test('bedriftskunde får bedriftssteget, og fokus flyttes til stegets overskrift', async ({ page }) => {
        await fyllOmDeg(page);
        await page.getByRole('button', { name: 'Neste' }).click();
        await page.getByText('Bedriftskunde', { exact: true }).click();
        await expect(page.getByText('Steg 2 av 4')).toBeVisible();

        await page.getByRole('button', { name: 'Neste' }).click();
        const overskrift = page.getByRole('heading', { name: 'Om bedriften', level: 2 });
        await expect(overskrift).toBeVisible();
        // Fokus skal ligge på den nye skjermens overskrift, ikke på Neste-knappen.
        await expect(overskrift).toBeFocused();
    });

    test('full bedriftsflyt sendes inn med rå verdier', async ({ page }) => {
        await fyllOmDeg(page);
        await page.getByRole('button', { name: 'Neste' }).click();

        await page.getByText('Bedriftskunde', { exact: true }).click();
        await page.getByRole('button', { name: 'Neste' }).click();

        await page.getByLabel('Organisasjonsnummer').fill('123456789');
        await page.getByLabel('Firmanavn').fill('Nordmann AS');
        await page.getByRole('button', { name: 'Neste' }).click();

        await page.getByText('Betalingskort', { exact: true }).click();
        await page.getByLabel('Navn på kortet').fill('Kari Nordmann');
        await page.getByLabel('Hvordan vil du kontaktes?').selectOption('telefon');
        await page.getByText('Jeg godtar vilkårene').click();
        await page.getByLabel('Noe vi bør vite?').fill('Ring helst før kl. 15.');
        await page.getByRole('button', { name: 'Send inn' }).click();

        await expect(page.getByRole('heading', { name: 'Innsendte verdier' })).toBeVisible();
        const data = JSON.parse((await page.getByTestId('innsendt-data').textContent()) ?? '{}');
        expect(data).toMatchObject({
            navn: 'Kari Nordmann',
            fodselsdato: '1985-05-01',
            epost: 'kari@example.com',
            landkode: '47',
            tlf: '12345678',
            // Combobox sender VERDIEN, ikke etiketten brukeren så («Norge»).
            bostedsland: 'no',
            kundetype: 'bedrift',
            // Rå verdi — feltet viser «123 456 789».
            orgnummer: '123456789',
            firmanavn: 'Nordmann AS',
            tjenester: ['kort'],
            kortnavn: 'Kari Nordmann',
            kontaktmetode: 'telefon',
            samtykke: true,
            melding: 'Ring helst før kl. 15.',
        });
    });

    test('aktivt steg legges i URL-en, og «Neste» oppdaterer den', async ({ page }) => {
        // Skrives ved første render, med replaceState — en URL uten parameter skal
        // ikke ligge igjen i historikken.
        await expect(page).toHaveURL(/[?&]steg=om-deg/);

        await fyllOmDeg(page);
        await page.getByRole('button', { name: 'Neste' }).click();
        await expect(page).toHaveURL(/[?&]steg=kundetype/);
    });

    test('nettleserens tilbakeknapp går ett steg bakover og beholder verdiene', async ({ page }) => {
        await fyllOmDeg(page);
        await page.getByRole('button', { name: 'Neste' }).click();
        await expect(page.getByRole('heading', { name: 'Kundetype', level: 2 })).toBeVisible();

        await page.goBack();

        // Steg-navigasjonen er ekte historikk, ikke bare intern state.
        await expect(page).toHaveURL(/[?&]steg=om-deg/);
        await expect(page.getByRole('heading', { name: 'Om deg', level: 2 })).toBeVisible();
        await expect(page.getByLabel('Navn')).toHaveValue('Kari Nordmann');

        // Og fram igjen: steget er fullført, så URL-en godtas.
        await page.goForward();
        await expect(page.getByRole('heading', { name: 'Kundetype', level: 2 })).toBeVisible();
    });

    test('URL som peker forbi det brukeren har fylt ut, klampes til første ufullførte steg', async ({
        page,
    }) => {
        // Kald åpning rett på siste steg. Uten klamping ville brukeren fått en
        // skjerm som avhenger av svar som ikke finnes, og hoppet over valideringen.
        await page.goto('#/internTesting/skjema-steg?steg=tjenester');

        await expect(page).toHaveURL(/[?&]steg=om-deg/);
        await expect(page.getByRole('heading', { name: 'Om deg', level: 2 })).toBeVisible();
        await expect(page.getByText('Steg 1 av 4')).toBeVisible();
    });

    test('oppfriskning starter på nytt, fordi svarene ikke lagres', async ({ page }) => {
        await fyllOmDeg(page);
        await page.getByRole('button', { name: 'Neste' }).click();
        await expect(page).toHaveURL(/[?&]steg=kundetype/);

        await page.reload();

        /*
         * Dokumenterer en bevisst konsekvens, ikke en feil: URL-en peker på steg 2,
         * men verdiene fra steg 1 er borte, og da er steg 2 ikke lovlig å vise.
         * Skal oppfriskning gjenoppta flyten, må verdiene lagres — se
         * kommentaren i useStegSkjema.ts.
         */
        await expect(page).toHaveURL(/[?&]steg=om-deg/);
        await expect(page.getByLabel('Navn')).toHaveValue('');
    });

    /*
     * Av- og remontering er det stegskjemaet gjør som «alt på én side» ALDRI gjør,
     * og det er derfor de to neste testene finnes. Komponenter der web-komponenten
     * eier den viste tilstanden må hente verdien tilbake fra RHF ved mount — ellers
     * ser brukeren noe annet enn det som faktisk er lagret.
     */
    test('Select og TextArea beholder verdien gjennom av- og remontering', async ({ page }) => {
        await fyllOmDeg(page);
        await page.getByRole('button', { name: 'Neste' }).click();
        await page.getByText('Privatkunde', { exact: true }).click();
        await page.getByRole('button', { name: 'Neste' }).click();

        await page.getByLabel('Hvordan vil du kontaktes?').selectOption('brev');
        await page.getByLabel('Noe vi bør vite?').fill('Kun brevpost, takk.');

        await page.getByRole('button', { name: 'Tilbake' }).click();
        await expect(page.getByRole('heading', { name: 'Kundetype', level: 2 })).toBeVisible();
        await page.getByRole('button', { name: 'Neste' }).click();

        await expect(page.getByLabel('Hvordan vil du kontaktes?')).toHaveValue('brev');
        await expect(page.getByLabel('Noe vi bør vite?')).toHaveValue('Kun brevpost, takk.');
    });

    /*
     * KJENT FEIL i Combobox, ikke i dette eksempelet: ved remontering viser
     * søkefeltet den RÅ VERDIEN («no») i stedet for etiketten brukeren valgte
     * («Norge»). RHF har riktig verdi, og innsendingen blir riktig — men brukeren
     * ser en intern kode i feltet sitt.
     *
     * Årsak: register() gjør feltet ukontrollert, så React rendrer ingen option med
     * aria-selected ved remontering, og `_syncFromInitialSelection` i IxCombobox har
     * dermed ingenting å utlede etiketten fra.
     *
     * Samme rotårsak gir PhoneNumberField «45» der den før viste «+45».
     *
     * test.fail() framfor å fjerne testen: da er suiten grønn, feilen dokumentert,
     * og Playwright sier fra den dagen noen fikser den.
     */
    test.fail('Combobox viser etiketten, ikke råverdien, etter remontering', async ({ page }) => {
        await fyllOmDeg(page);
        await expect(page.getByLabel('Bostedsland')).toHaveValue('Norge');

        await page.getByRole('button', { name: 'Neste' }).click();
        await expect(page.getByRole('heading', { name: 'Kundetype', level: 2 })).toBeVisible();
        await page.getByRole('button', { name: 'Tilbake' }).click();
        await expect(page.getByRole('heading', { name: 'Om deg', level: 2 })).toBeVisible();

        await expect(page.getByLabel('Bostedsland')).toHaveValue('Norge');
    });

    test('«Tilbake» validerer ikke, og beholder verdiene', async ({ page }) => {
        await fyllOmDeg(page);
        await page.getByRole('button', { name: 'Neste' }).click();
        await expect(page.getByRole('heading', { name: 'Kundetype', level: 2 })).toBeVisible();

        // Ingen kundetype valgt — Tilbake skal likevel virke, uten feilmelding.
        await page.getByRole('button', { name: 'Tilbake' }).click();
        await expect(page.getByRole('heading', { name: 'Om deg', level: 2 })).toBeVisible();
        await expect(page.getByRole('group', { name: /Steget har/ })).toHaveCount(0);
        // Verdiene fra steg 1 er beholdt selv om feltene var avmontert.
        await expect(page.getByLabel('Navn')).toHaveValue('Kari Nordmann');
        await expect(page.getByLabel('E-post')).toHaveValue('kari@example.com');
    });
});
