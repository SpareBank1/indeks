import { test, expect, type Page } from '@playwright/test';

const STORY_URL = 'http://localhost:9009/iframe.html?id=form-combobox--standard&viewMode=story';

// Fokusfeil som jsdom ikke viser: scrollbare bokser er tab-stopp i Chrome og
// Firefox, og Tab fra feltet går ikke gjennom komponentens egne lyttere.
async function setup(page: Page) {
    await page.goto(STORY_URL);
    const input = page.getByRole('combobox', { name: 'Land' });
    await input.waitFor();
    // Et felt etter, som på en ekte side. Uten det går Tab ut av iframen, og
    // Firefox beholder da inputen som activeElement.
    await page.evaluate(() => {
        const next = document.createElement('button');
        next.textContent = 'Neste';
        document.querySelector('ix-combobox')!.after(next);
    });
    const listbox = page.getByRole('listbox');
    return { input, listbox };
}

test.describe('Combobox fokus', () => {
    // eslint-disable-next-line no-empty-pattern -- Playwright krever objekt-destrukturering
    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name.startsWith('mobile'), 'Tastatur er ikke relevant på mobil');
    });

    test('Tab etter at verdien er slettet lukker lista', async ({ page }) => {
        const { input, listbox } = await setup(page);
        await input.click();
        await page.getByRole('option', { name: /Norge/ }).click();
        await expect(input).toHaveValue('Norge');

        await input.fill('');
        await expect(listbox).toBeVisible();
        await page.keyboard.press('Tab');
        await expect(listbox).toBeHidden();
    });

    test('Tab fra åpen liste går til neste felt, ikke til lista', async ({ page }) => {
        const { input, listbox } = await setup(page);
        await input.focus();
        await page.keyboard.press('ArrowDown');
        await expect(listbox).toBeVisible();
        await page.keyboard.press('Tab');
        await expect(page.getByRole('button', { name: 'Neste' })).toBeFocused();
        await expect(listbox).toBeHidden();
    });

    test('etter klikk i lista virker piltaster og Enter fortsatt', async ({ page }) => {
        const { input, listbox } = await setup(page);
        await input.focus();
        await page.keyboard.press('ArrowDown');
        await expect(listbox).toBeVisible();

        // Klikk i paddingen, ikke på et alternativ, og scroll.
        await listbox.click({ position: { x: 2, y: 2 } });
        await page.mouse.wheel(0, 100);
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        await expect(input).toBeFocused();
        await expect(input).not.toHaveValue('');
    });
});
