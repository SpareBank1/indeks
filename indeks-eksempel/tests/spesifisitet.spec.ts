import { expect, test, type Page } from '@playwright/test';

/*
 * Holder påstandene på Spesifisitet-siden sanne.
 *
 * Hvert alternativ er en iframe med global CSS. Testen leser beregnet stil inne i
 * iframen og sjekker at den stemmer med det resultatteksten sier. Endres et
 * utdrag i `spesifisitet/utdrag.ts`, feiler testen hvis teksten ikke lenger
 * stemmer.
 */

const INFIMA_LENKE = 'rgb(53, 120, 229)';
const INFIMA_LENKE_HOVER = 'rgb(29, 104, 225)';
const HVIT = 'rgb(255, 255, 255)';
const BLA = 'rgb(0, 39, 118)';
const MORKEBLA = 'rgb(0, 26, 80)';
const ROD = 'rgb(176, 0, 32)';
const FEIL = 'rgb(195, 0, 0)';

function ramme(page: Page, testId: string) {
    return page.getByTestId(testId).contentFrame();
}

test.beforeEach(async ({ page }) => {
    await page.goto('#/internTesting/spesifisitet');
    await expect(page.getByRole('heading', { name: 'Spesifisitet, :where() og lag', level: 1 })).toBeVisible();
});

test.describe('1. Mot vertens elementregler', () => {
    const forventet = {
        dagens: { hvile: INFIMA_LENKE, hover: INFIMA_LENKE_HOVER, strek: 'underline', overskrift: '32px' },
        flat: { hvile: HVIT, hover: INFIMA_LENKE_HOVER, strek: 'underline', overskrift: '20px' },
        loftet: { hvile: HVIT, hover: HVIT, strek: 'none', overskrift: '20px' },
        lag: { hvile: INFIMA_LENKE, hover: INFIMA_LENKE_HOVER, strek: 'underline', overskrift: '32px' },
    };

    for (const [nokkel, f] of Object.entries(forventet)) {
        test(nokkel, async ({ page }) => {
            const r = ramme(page, `vert-${nokkel}`);
            const knapp = r.locator('.ix-button');
            await expect(knapp).toHaveCSS('color', f.hvile);
            await expect(r.locator('.ix-heading')).toHaveCSS('font-size', f.overskrift);
            await knapp.hover();
            await expect(knapp).toHaveCSS('color', f.hover);
            await expect(knapp).toHaveCSS('text-decoration-line', f.strek);
        });
    }

    for (const nokkel of ['dagens', 'flat']) {
        test(`swagger ${nokkel}`, async ({ page }) => {
            const r = ramme(page, `swagger-${nokkel}`);
            await expect(r.getByRole('button', { name: 'Utenfor' })).toHaveCSS('font-family', 'Georgia, serif');
            await expect(r.getByRole('button', { name: 'Inne i' })).toHaveCSS('font-family', 'sans-serif');
        });
    }
});

test('2. Rekkefølge', async ({ page }) => {
    await expect(ramme(page, 'rekkefolge-etter').locator('.ix-button')).toHaveCSS('background-color', ROD);
    await expect(ramme(page, 'rekkefolge-for').locator('.ix-button')).toHaveCSS('background-color', BLA);
    await expect(ramme(page, 'rekkefolge-for-dobbel').locator('.ix-button')).toHaveCSS('background-color', ROD);
});

test('3. Overstyring av varianter', async ({ page }) => {
    const flat = ramme(page, 'varianter-flat').locator('.ix-button');
    await expect(flat).toHaveCSS('background-color', ROD);
    await flat.hover();
    await expect(flat).toHaveCSS('background-color', ROD);

    await expect(ramme(page, 'varianter-eskalert').locator('.ix-button')).toHaveCSS('background-color', BLA);

    const loftet = ramme(page, 'varianter-loftet').locator('.ix-button');
    await expect(loftet).toHaveCSS('background-color', ROD);
    await loftet.hover();
    await expect(loftet).toHaveCSS('background-color', MORKEBLA);
});

test('4. Tilstander', async ({ page }) => {
    const flat = ramme(page, 'tilstander-flat');
    await expect(flat.getByLabel('Gyldig felt', { exact: true })).toHaveCSS('border-top-color', BLA);
    await expect(flat.getByLabel('Ugyldig felt')).toHaveCSS('border-top-color', BLA);

    const beskyttet = ramme(page, 'tilstander-beskyttet');
    await expect(beskyttet.getByLabel('Gyldig felt', { exact: true })).toHaveCSS('border-top-color', BLA);
    await expect(beskyttet.getByLabel('Ugyldig felt')).toHaveCSS('border-top-color', FEIL);
});

test('5. BEM-klasser', async ({ page }) => {
    await expect(ramme(page, 'bem-dagens').locator('input')).toHaveCSS('border-top-left-radius', '0px');
    await expect(ramme(page, 'bem-strukturell').locator('input')).toHaveCSS('border-top-left-radius', '12px');
    await expect(ramme(page, 'bem-pakket').locator('input')).toHaveCSS('border-top-left-radius', '0px');
});

test('6. Kontekstselektorer', async ({ page }) => {
    await expect(ramme(page, 'kontekst-eskalert').locator('.ix-heading')).toHaveCSS('color', BLA);
    await expect(ramme(page, 'kontekst-pakket').locator('.ix-heading')).toHaveCSS('color', ROD);
});

test('7. Reset', async ({ page }) => {
    await expect(ramme(page, 'reset-dagens').locator('.ix-heading')).toHaveCSS('font-size', '16px');
    await expect(ramme(page, 'reset-flat').locator('.ix-heading')).toHaveCSS('font-size', '20px');
    await expect(ramme(page, 'reset-lag').locator('.ix-heading')).toHaveCSS('font-size', '20px');
});

test('8. Lag for konsumenter', async ({ page }) => {
    const uten = ramme(page, 'lag-uten').locator('.ix-button');
    await expect(uten).toHaveCSS('padding-left', '16px');
    await expect(uten).toHaveCSS('color', HVIT);

    const med = ramme(page, 'lag-med').locator('.ix-button');
    await expect(med).toHaveCSS('padding-left', '0px');
    await expect(med).toHaveCSS('color', INFIMA_LENKE);
});
