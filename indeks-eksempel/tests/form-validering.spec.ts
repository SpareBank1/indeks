import { expect, test } from '@playwright/test';

/*
 * Funksjonell e2e mot «Form-validering»-siden. Verifiserer RHF + Valibot-flyten
 * ende-til-ende: tomt submit → feil, ugyldig input → Valibot-melding + aria-invalid,
 * korrekt utfylling → innsendt data med RÅ verdier (formatert kontonummer sendes uten
 * separatorer). Bruker rolle-/label-selektorer, som samtidig tester a11y-koblingen.
 */

test.beforeEach(async ({ page }) => {
    // Relativ URL (uten ledende slash) så den resolver mot baseURL-ens
    // /eksempel/-base — en ledende slash ville droppet basen og gått mot origin.
    await page.goto('#/internTesting/form-validering');
    await expect(page.getByRole('heading', { name: 'Form-validering' })).toBeVisible();
});

test('tomt submit viser feilmeldinger per felt', async ({ page }) => {
    await page.getByRole('button', { name: 'Send inn' }).click();

    // exact: true — «Velg en konto» er ellers en delstreng av «Velg en kontotype».
    await expect(page.getByText('Navn må ha minst 2 tegn')).toBeVisible();
    await expect(page.getByText('E-post er påkrevd')).toBeVisible();
    await expect(page.getByText('Kontonummer må være 11 siffer')).toBeVisible();
    await expect(page.getByText('Velg en konto', { exact: true })).toBeVisible();
    await expect(page.getByText('Meldingen må ha minst 5 tegn')).toBeVisible();
    await expect(page.getByText('Velg en kontotype')).toBeVisible();
    await expect(page.getByText('Velg minst én tjeneste')).toBeVisible();
    await expect(page.getByText('Velg et land')).toBeVisible();
    await expect(page.getByText('Velg en gyldig dato')).toBeVisible();
    // PhoneNumberField er to uavhengige felt → én feilmelding per felt.
    await expect(page.getByText('Velg landkode')).toBeVisible();
    await expect(page.getByText('Telefonnummer må være 8 siffer')).toBeVisible();
    await expect(page.getByText('Du må godta vilkårene')).toBeVisible();

    // Ingen innsendt-blokk skal vises når validering feiler.
    await expect(page.getByTestId('submitted-data')).toHaveCount(0);
});

test('ugyldig e-post og kontonummer gir riktig melding + aria-invalid', async ({ page }) => {
    await page.getByLabel('E-post').fill('ikke-en-epost');
    await page.getByLabel('Kontonummer').fill('123');
    await page.getByRole('button', { name: 'Send inn' }).click();

    await expect(page.getByText('Ugyldig e-postadresse')).toBeVisible();
    await expect(page.getByText('Kontonummer må være 11 siffer')).toBeVisible();

    await expect(page.getByLabel('E-post')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByLabel('Kontonummer')).toHaveAttribute('aria-invalid', 'true');
});

test('Combobox via register: tomt submit flytter fokus til søkefeltet', async ({ page }) => {
    // Fyll alle felt FØR land, så combobox er første ugyldige felt RHF fokuserer.
    // Verifiserer Bit 2: WC-ens focus()-override delegerer til den synlige inputen,
    // slik at RHF sin fokus-ved-feil (ref.focus() på ix-combobox) lander riktig.
    await page.getByLabel('Navn').fill('Kari Nordmann');
    await page.getByLabel('E-post').fill('kari@example.com');
    await page.getByLabel('Kontonummer').fill('12345678901');
    await page.getByLabel('Fra konto').selectOption('brukskonto');
    await page.getByLabel('Melding').fill('Hei, dette er en test');
    await page.getByText('Privat', { exact: true }).click();
    await page.getByText('Nettbank', { exact: true }).click();
    await page.getByText('Jeg godtar vilkårene').click();

    await page.getByRole('button', { name: 'Send inn' }).click();

    await expect(page.getByText('Velg et land')).toBeVisible();
    // Fokus skal ha havnet på combobox-søkefeltet (ikke på den skjulte selecten).
    // exact: true — «Land» er ellers en delstreng av «Landkode» (PhoneNumberField).
    await expect(page.getByLabel('Land', { exact: true })).toBeFocused();
});

test('korrekt utfylling sender inn RÅ verdier', async ({ page }) => {
    await page.getByLabel('Navn').fill('Kari Nordmann');
    await page.getByLabel('E-post').fill('kari@example.com');

    // Formatert felt (format="account") via register (proxy-ref): skriv 11 siffer,
    // visning blir «1234 56 78901», innsendt verdi rå. Bindes likt et uformatert felt.
    await page.getByLabel('Kontonummer').fill('12345678901');

    await page.getByLabel('Fra konto').selectOption('brukskonto');
    await page.getByLabel('Melding').fill('Hei, dette er en test');

    // RadioGroup / CheckboxGroup: den native inputen er visuelt skjult av
    // web-component-stylingen, så vi klikker den synlige labelen (slik en bruker gjør).
    // Verifiser deretter at underliggende input ble avmerket. RHF samler
    // checkbox-verdiene til et string[].
    await page.getByText('Privat', { exact: true }).click();
    await expect(page.getByLabel('Privat')).toBeChecked();

    await page.getByText('Nettbank', { exact: true }).click();
    await page.getByText('Mobilbank', { exact: true }).click();
    await expect(page.getByLabel('Nettbank')).toBeChecked();
    await expect(page.getByLabel('Mobilbank')).toBeChecked();

    // Combobox (register) — skriv og velg fra lista (tastatur/klikk). Verdien
    // flyter via det syntetiske change-eventet inn i RHF på lik linje med Mønster A.
    // exact: true — «Land» matcher ellers også «Landkode» (PhoneNumberField).
    const land = page.getByLabel('Land', { exact: true });
    await land.click();
    await land.fill('Norge');
    await page.getByRole('option', { name: 'Norge' }).click();

    // DateField (register, proxy-ref): skriv i den synlige dd.mm.åååå-inputen,
    // innsendt/validert verdi er ISO (åååå-mm-dd).
    await page.getByLabel('Fødselsdato').fill('17.05.1990');

    // PhoneNumberField — to felt: velg landkode og skriv nummeret. Det smale
    // landfeltet har chevron-knappen liggende oppå inputen, så et klikk midt på
    // inputen fanges av knappen — vi åpner lista via chevronen (naturlig interaksjon).
    await page.getByRole('button', { name: 'Vis landkoder' }).click();
    await page.getByRole('option', { name: '+47' }).click();
    // Nummerfeltet formateres visuelt («123 45 678»), men innsendt verdi er rå.
    await page.getByLabel('Telefonnummer').fill('12345678');

    await page.getByText('Jeg godtar vilkårene').click();
    await expect(page.getByLabel('Jeg godtar vilkårene')).toBeChecked();

    await page.getByRole('button', { name: 'Send inn' }).click();

    const submitted = page.getByTestId('submitted-data');
    await expect(submitted).toBeVisible();

    const json = JSON.parse((await submitted.textContent()) ?? '{}');
    expect(json).toMatchObject({
        navn: 'Kari Nordmann',
        epost: 'kari@example.com',
        kontonummer: '12345678901', // RÅ — ingen mellomrom
        fraKonto: 'brukskonto',
        melding: 'Hei, dette er en test',
        kontotype: 'privat',
        tjenester: ['nettbank', 'mobilbank'],
        land: 'no',
        fodselsdato: '1990-05-17', // ISO — visning var dd.mm.åååå
        landkode: '47',
        tlf: '12345678', // RÅ — ingen mellomrom
        samtykke: true,
    });
});
