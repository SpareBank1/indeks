import { expect, test, type Locator, type Page } from '@playwright/test';

/*
 * Regresjonstest: flytende paneler skal posisjoneres riktig inne i en modal.
 *
 * Combobox-lista, dropdown-menyen og popover-panelet er `position: fixed` og
 * posisjoneres med rå viewport-koordinater fra getBoundingClientRect(). Er en
 * ancestor containing block for `position: fixed`, tolker nettleseren de
 * koordinatene relativt til ancestoren, og panelet havner forskjøvet ned og til
 * høyre — omtrent med modalens eget offset fra viewport-hjørnet.
 *
 * `.ix-modal[open]` gjorde dette: den beholdt `transform: scale(1)` som hvileverdi
 * etter åpne-animasjonen, og en transform som ikke er `none` skaper containing
 * block. Testen slår fast både årsaken (ingen transform i hvile) og virkningen
 * (hvert panel ligger inntil sin egen trigger).
 *
 * Må kjøres i en ekte nettleser — jsdom har ingen layout.
 */

const MODAL = 'dialog.ix-modal';

async function boks(locator: Locator) {
    const box = await locator.boundingBox();
    if (!box) throw new Error('Elementet har ingen layout-boks');
    return box;
}

/**
 * Venter til den rendrede boksen står stille før den måles.
 *
 * Eksempelappen har `* { transition: var(--ix-transition-all) }` i src/index.css
 * (samme grep som SB1-plattformens CSS, jf. kommentaren i card.css). Den treffer
 * også `top`/`left`, så panelene glir inn fra utgangsposisjonen sin i stedet for å
 * dukke opp ferdig plassert. Inline-stilen JS skriver er riktig umiddelbart — det
 * er den rendrede posisjonen som trenger et øyeblikk, og det er den vi må måle,
 * siden feilen nettopp var at riktig inline-verdi ble tolket i feil koordinatsystem.
 */
async function boksNårStille(locator: Locator, navn: string) {
    let forrige = '';
    await expect
        .poll(
            async () => {
                const nå = JSON.stringify(await locator.boundingBox());
                const stille = nå === forrige;
                forrige = nå;
                return stille;
            },
            { timeout: 5000, message: `${navn}: panelet sluttet aldri å bevege seg` }
        )
        .toBe(true);

    return boks(locator);
}

/**
 * Slår fast at panelet ligger inntil triggeren: de overlapper horisontalt, og det
 * vertikale mellomrommet er noen få piksler. Feilen ga hundrevis av piksler avvik,
 * så terskelen trenger ikke være stram for å fange den — og en romslig terskel gjør
 * testen robust mot komponentenes ulike gap og flip-logikk.
 */
async function forventPanelVedTrigger(panel: Locator, trigger: Locator, navn: string) {
    await expect(panel, `${navn}: panelet skal være synlig`).toBeVisible();

    const p = await boksNårStille(panel, navn);
    const t = await boks(trigger);

    const horisontalOverlapp = Math.min(p.x + p.width, t.x + t.width) - Math.max(p.x, t.x);
    expect(horisontalOverlapp, `${navn}: panelet skal overlappe triggeren horisontalt`).toBeGreaterThan(0);

    // Panelet ligger enten under triggeren eller over den (flip ved plassmangel).
    const gapUnder = p.y - (t.y + t.height);
    const gapOver = t.y - (p.y + p.height);
    const gap = Math.max(gapUnder, gapOver);
    expect(gap, `${navn}: vertikalt mellomrom til triggeren`).toBeLessThan(24);
    expect(gap, `${navn}: panelet skal ikke overlappe triggeren`).toBeGreaterThan(-2);
}

async function åpneModal(page: Page) {
    await page.goto('#/internTesting/flytende-paneler-i-modal');
    await page.getByRole('button', { name: 'Åpne modal' }).click();

    const modal = page.locator(MODAL);
    await expect(modal).toBeVisible();

    // Vent til åpne-animasjonen har satt seg, men IKKE ved å kreve at transformen
    // er `none` — da ville posisjonstestene under kortsluttet på årsaken i stedet
    // for å måle virkningen, og sluttet å fange andre måter å skape en containing
    // block på (filter, contain, container-type …).
    await boksNårStille(modal, 'modal');

    return modal;
}

test('åpen modal har ingen transform, så den er ikke containing block for fixed', async ({ page }) => {
    const modal = await åpneModal(page);

    // Selve årsaken. Enhver transform her forskyver alle flytende paneler inni
    // modalen, uansett hvor liten den er.
    await expect(modal).toHaveCSS('transform', 'none');
});

test('combobox-lista legger seg inntil feltet', async ({ page }) => {
    const modal = await åpneModal(page);

    const felt = modal.locator('.ix-combobox .ix-text-field');
    await modal.getByRole('button', { name: 'Vis land' }).click();

    const listbox = modal.locator('.ix-combobox__listbox');
    await forventPanelVedTrigger(listbox, felt, 'combobox');

    // Lista er bredde-matchet mot feltet, så venstrekanten skal treffe eksakt.
    const l = await boksNårStille(listbox, 'combobox');
    const f = await boks(felt);
    expect(Math.abs(l.x - f.x), 'combobox: venstrekant mot feltet').toBeLessThan(2);
});

test('dropdown-menyen legger seg inntil triggeren', async ({ page }) => {
    const modal = await åpneModal(page);

    const trigger = modal.getByRole('button', { name: 'Handlinger' });
    await trigger.click();

    await forventPanelVedTrigger(modal.locator('.ix-dropdown__menu'), trigger, 'dropdown');
});

test('popover-panelet legger seg inntil triggeren', async ({ page }) => {
    const modal = await åpneModal(page);

    const trigger = modal.getByRole('button', { name: 'Hva betyr dette?' });
    await trigger.click();

    await forventPanelVedTrigger(modal.locator('.ix-popover__content'), trigger, 'popover');
});
