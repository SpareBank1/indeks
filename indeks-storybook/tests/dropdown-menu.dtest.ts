import { test, expect, type Page, type Locator } from '@playwright/test';

const BASE_URL = 'http://localhost:9009/iframe.html';
const STORY_URL = `${BASE_URL}?id=components-dropdownmenu--standard&viewMode=story`;
const SUBMENU_URL = `${BASE_URL}?id=components-dropdownmenu--with-submenu&viewMode=story`;

async function openDropdown(page: Page): Promise<{ trigger: Locator; menu: Locator }> {
    const trigger = page.locator('button:has-text("Handlinger")');
    await trigger.click();
    const menu = page.locator('.ix-dropdown__menu').first();
    await menu.waitFor({ state: 'visible' });
    return { trigger, menu };
}

test.describe('DropdownMenu', () => {
    // Dropdown-tester kjører kun på desktop-chromium.
    // Mobil: tastaturnavigasjon ikke relevant. Firefox/Webkit: ustabil i Docker.
    // eslint-disable-next-line no-empty-pattern -- Playwright krever objekt-destrukturering
    test.beforeEach(async ({ }, testInfo) => {
        test.skip(testInfo.project.name !== 'desktop-chromium', 'Kun desktop-chromium');
    });

    test.describe('Åpne/lukke', () => {
        test('åpner menyen ved klikk på trigger', async ({ page }) => {
            await page.goto(STORY_URL);
            const trigger = page.locator('button:has-text("Handlinger")');
            const menu = page.locator('.ix-dropdown__menu').first();

            await expect(menu).toBeHidden();
            await trigger.click();
            await expect(menu).toBeVisible();
        });

        test('lukker menyen ved klikk utenfor', async ({ page }) => {
            await page.goto(STORY_URL);
            const { menu } = await openDropdown(page);

            await page.locator('body').click({ position: { x: 10, y: 10 } });
            await expect(menu).toBeHidden();
        });

        test('lukker menyen ved Escape', async ({ page }) => {
            await page.goto(STORY_URL);
            const trigger = page.locator('button:has-text("Handlinger")');
            const menu = page.locator('.ix-dropdown__menu').first();

            // Åpne med tastatur slik at fokus havner i menyen
            await trigger.focus();
            await page.keyboard.press('ArrowDown');
            await expect(menu).toBeVisible();

            await page.keyboard.press('Escape');
            await expect(menu).toBeHidden();
        });

        test('lukker menyen og returnerer fokus til trigger ved Escape', async ({ page }) => {
            await page.goto(STORY_URL);
            const trigger = page.locator('button:has-text("Handlinger")');
            const menu = page.locator('.ix-dropdown__menu').first();

            // Åpne med tastatur slik at fokus havner i menyen
            await trigger.focus();
            await page.keyboard.press('ArrowDown');
            await expect(menu).toBeVisible();

            await page.keyboard.press('Escape');
            await expect(menu).toBeHidden();
            await expect(trigger).toBeFocused();
        });
    });

    test.describe('Tastaturnavigasjon', () => {
        test('åpner med Enter og fokuserer første item', async ({ page }) => {
            await page.goto(STORY_URL);
            const trigger = page.locator('button:has-text("Handlinger")');
            const menu = page.locator('.ix-dropdown__menu').first();
            const firstItem = page.locator('.ix-dropdown__item').first();

            await trigger.focus();
            await page.keyboard.press('Enter');

            await expect(menu).toBeVisible();
            await expect(firstItem).toHaveAttribute('data-active', '');
        });

        test('åpner med ArrowDown og fokuserer første item', async ({ page }) => {
            await page.goto(STORY_URL);
            const trigger = page.locator('button:has-text("Handlinger")');
            const menu = page.locator('.ix-dropdown__menu').first();
            const firstItem = page.locator('.ix-dropdown__item').first();

            await trigger.focus();
            await page.keyboard.press('ArrowDown');

            await expect(menu).toBeVisible();
            await expect(firstItem).toHaveAttribute('data-active', '');
        });

        test('navigerer med ArrowDown/ArrowUp', async ({ page }) => {
            await page.goto(STORY_URL);
            const trigger = page.locator('button:has-text("Handlinger")');
            const items = page.locator('.ix-dropdown__menu').first().locator('.ix-dropdown__item');

            await trigger.focus();
            await page.keyboard.press('ArrowDown');

            await expect(items.nth(0)).toHaveAttribute('data-active', '');

            await page.keyboard.press('ArrowDown');
            await expect(items.nth(1)).toHaveAttribute('data-active', '');

            await page.keyboard.press('ArrowDown');
            await expect(items.nth(2)).toHaveAttribute('data-active', '');

            await page.keyboard.press('ArrowUp');
            await expect(items.nth(1)).toHaveAttribute('data-active', '');
        });

        test('wrapper rundt ved enden av listen', async ({ page }) => {
            await page.goto(STORY_URL);
            const trigger = page.locator('button:has-text("Handlinger")');
            const items = page.locator('.ix-dropdown__menu').first().locator('.ix-dropdown__item');

            await trigger.focus();
            await page.keyboard.press('ArrowDown');

            // Naviger til siste item
            await page.keyboard.press('End');
            await expect(items.last()).toHaveAttribute('data-active', '');

            // ArrowDown fra siste skal wrappe til første
            await page.keyboard.press('ArrowDown');
            await expect(items.first()).toHaveAttribute('data-active', '');
        });

        test('Home fokuserer første item, End fokuserer siste', async ({ page }) => {
            await page.goto(STORY_URL);
            const trigger = page.locator('button:has-text("Handlinger")');
            const items = page.locator('.ix-dropdown__menu').first().locator('.ix-dropdown__item');

            await trigger.focus();
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('ArrowDown');

            await page.keyboard.press('Home');
            await expect(items.first()).toHaveAttribute('data-active', '');

            await page.keyboard.press('End');
            await expect(items.last()).toHaveAttribute('data-active', '');
        });

        test('velger item med Enter', async ({ page }) => {
            await page.goto(STORY_URL);
            const trigger = page.locator('button:has-text("Handlinger")');
            const menu = page.locator('.ix-dropdown__menu').first();

            page.on('dialog', async (dialog) => {
                expect(dialog.message()).toBe('Rediger');
                await dialog.accept();
            });

            await trigger.focus();
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');

            await expect(menu).toBeHidden();
        });
    });

    test.describe('Submenyer', () => {
        test('åpner submeny med ArrowRight', async ({ page }) => {
            await page.goto(SUBMENU_URL);
            const trigger = page.locator('button:has-text("Handlinger")');
            const submenuTrigger = page.locator('.ix-dropdown__item:has-text("Eksporter som")');
            const submenu = page.locator('ix-dropdown[data-submenu] > .ix-dropdown__menu');

            await trigger.focus();
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('ArrowDown'); // Naviger til "Eksporter som"

            await expect(submenuTrigger).toHaveAttribute('data-active', '');

            await page.keyboard.press('ArrowRight');
            await expect(submenu).toBeVisible();
        });

        test('lukker submeny med ArrowLeft og returnerer fokus til submenu-trigger', async ({ page }) => {
            await page.goto(SUBMENU_URL);
            const trigger = page.locator('button:has-text("Handlinger")');
            const submenuTrigger = page.locator('.ix-dropdown__item:has-text("Eksporter som")');
            const submenu = page.locator('ix-dropdown[data-submenu] > .ix-dropdown__menu');

            await trigger.focus();
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('ArrowRight');

            await expect(submenu).toBeVisible();

            await page.keyboard.press('ArrowLeft');
            await expect(submenu).toBeHidden();
            await expect(submenuTrigger).toBeFocused();
        });

        test('navigerer inne i submeny med ArrowDown/ArrowUp', async ({ page }) => {
            await page.goto(SUBMENU_URL);
            const trigger = page.locator('button:has-text("Handlinger")');
            const submenuItems = page.locator('ix-dropdown[data-submenu] > .ix-dropdown__menu > .ix-dropdown__item');

            await trigger.focus();
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('ArrowRight');

            await expect(submenuItems.nth(0)).toHaveAttribute('data-active', '');

            await page.keyboard.press('ArrowDown');
            await expect(submenuItems.nth(1)).toHaveAttribute('data-active', '');

            await page.keyboard.press('ArrowDown');
            await expect(submenuItems.nth(2)).toHaveAttribute('data-active', '');
        });

        test('velger submeny-item med Enter og lukker hele menyen', async ({ page }) => {
            await page.goto(SUBMENU_URL);
            const trigger = page.locator('button:has-text("Handlinger")');
            const rootMenu = page.locator('ix-dropdown:not([data-submenu]) > .ix-dropdown__menu');
            const submenu = page.locator('ix-dropdown[data-submenu] > .ix-dropdown__menu');

            page.on('dialog', async (dialog) => {
                expect(dialog.message()).toBe('PDF');
                await dialog.accept();
            });

            await trigger.focus();
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('ArrowRight');
            await page.keyboard.press('Enter');

            await expect(submenu).toBeHidden();
            await expect(rootMenu).toBeHidden();
        });

        test('submeny posisjoneres utenfor parent-menyen uten overlapping', async ({ page }) => {
            await page.goto(SUBMENU_URL);
            const trigger = page.locator('button:has-text("Handlinger")');

            await trigger.click();

            const submenuTrigger = page.locator('.ix-dropdown__item:has-text("Eksporter som")');
            await submenuTrigger.hover();

            const rootMenu = page.locator('ix-dropdown:not([data-submenu]) > .ix-dropdown__menu');
            const submenu = page.locator('ix-dropdown[data-submenu] > .ix-dropdown__menu');

            await expect(submenu).toBeVisible({ timeout: 1000 });

            const rootMenuBox = await rootMenu.boundingBox();
            const submenuBox = await submenu.boundingBox();

            expect(rootMenuBox).not.toBeNull();
            expect(submenuBox).not.toBeNull();

            // Submeny skal starte til høyre for parent-menyens høyre kant (med litt gap)
            expect(submenuBox!.x).toBeGreaterThanOrEqual(rootMenuBox!.x + rootMenuBox!.width);
        });
    });

    test.describe('Posisjonering', () => {
        test('menyen holder seg innenfor viewport ved høyre kant', async ({ page }) => {
            await page.setViewportSize({ width: 400, height: 600 });
            await page.goto(STORY_URL);

            // Plasser triggeren nær høyre kant
            await page.evaluate(() => {
                const dropdown = document.querySelector('ix-dropdown');
                if (dropdown) {
                    (dropdown as HTMLElement).style.position = 'absolute';
                    (dropdown as HTMLElement).style.right = '10px';
                }
            });

            const { menu } = await openDropdown(page);

            const menuBox = await menu.boundingBox();
            expect(menuBox).not.toBeNull();
            expect(menuBox!.x + menuBox!.width).toBeLessThanOrEqual(400);
        });

        test('menyen holder seg innenfor viewport ved bunn', async ({ page }) => {
            await page.setViewportSize({ width: 600, height: 300 });
            await page.goto(STORY_URL);

            // Plasser triggeren nær bunnen
            await page.evaluate(() => {
                const dropdown = document.querySelector('ix-dropdown');
                if (dropdown) {
                    (dropdown as HTMLElement).style.position = 'absolute';
                    (dropdown as HTMLElement).style.bottom = '10px';
                }
            });

            const { menu } = await openDropdown(page);

            const menuBox = await menu.boundingBox();
            expect(menuBox).not.toBeNull();
            expect(menuBox!.y + menuBox!.height).toBeLessThanOrEqual(300);
        });
    });

    test.describe('Mus-interaksjon', () => {
        test('hover highlighter items', async ({ page }) => {
            await page.goto(STORY_URL);
            const { menu } = await openDropdown(page);
            const items = menu.locator('.ix-dropdown__item');

            await items.nth(1).hover();

            // Sjekk at CSS hover-state er aktiv (bakgrunnsfarge endres)
            const bgColor = await items.nth(1).evaluate((el) => {
                return window.getComputedStyle(el).backgroundColor;
            });
            expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
        });

        test('klikk på item trigger onSelect og lukker menyen', async ({ page }) => {
            await page.goto(STORY_URL);

            page.on('dialog', async (dialog) => {
                expect(dialog.message()).toBe('Dupliser');
                await dialog.accept();
            });

            const { menu } = await openDropdown(page);
            const item = menu.locator('.ix-dropdown__item:has-text("Dupliser")');

            await item.click();
            await expect(menu).toBeHidden();
        });
    });

    test.describe('ARIA', () => {
        test('trigger har riktige ARIA-attributter', async ({ page }) => {
            await page.goto(STORY_URL);
            const trigger = page.locator('button:has-text("Handlinger")');
            const menu = page.locator('.ix-dropdown__menu').first();

            await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
            await expect(trigger).toHaveAttribute('aria-expanded', 'false');

            const menuId = await menu.getAttribute('id');
            await expect(trigger).toHaveAttribute('aria-controls', menuId!);
        });

        test('aria-expanded oppdateres ved åpning/lukking', async ({ page }) => {
            await page.goto(STORY_URL);
            const trigger = page.locator('button:has-text("Handlinger")');

            await expect(trigger).toHaveAttribute('aria-expanded', 'false');

            await trigger.click();
            await expect(trigger).toHaveAttribute('aria-expanded', 'true');

            await trigger.click();
            await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        });

        test('meny har role="menu"', async ({ page }) => {
            await page.goto(STORY_URL);
            await openDropdown(page);

            const menu = page.locator('.ix-dropdown__menu').first();
            await expect(menu).toHaveAttribute('role', 'menu');
        });

        test('items har role="menuitem"', async ({ page }) => {
            await page.goto(STORY_URL);
            const { menu } = await openDropdown(page);

            const items = menu.locator('.ix-dropdown__item');
            const count = await items.count();

            for (let i = 0; i < count; i++) {
                await expect(items.nth(i)).toHaveAttribute('role', 'menuitem');
            }
        });
    });
});
