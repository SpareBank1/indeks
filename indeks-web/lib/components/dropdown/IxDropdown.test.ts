import { describe, expect, it, afterEach, vi } from 'vitest';
import { IxDropdown } from './IxDropdown';

if (!customElements.get('ix-dropdown')) {
    customElements.define('ix-dropdown', IxDropdown);
}

function mount(html: string): IxDropdown {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
    return wrapper.querySelector('ix-dropdown')!;
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('IxDropdown', () => {
    describe('ARIA-kobling', () => {
        it('setter opp ARIA-attributter på trigger', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item 1</button>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector('button:not(.ix-dropdown__item)')!;
            const menu = el.querySelector('.ix-dropdown__menu')!;

            expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
            expect(trigger.getAttribute('aria-expanded')).toBe('false');
            expect(trigger.getAttribute('aria-controls')).toBe(menu.id);
        });

        it('setter role="menu" på menyen', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item 1</button>
                    </div>
                </ix-dropdown>
            `);

            const menu = el.querySelector('.ix-dropdown__menu')!;
            expect(menu.getAttribute('role')).toBe('menu');
        });

        it('setter role="menuitem" på items', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item 1</button>
                        <button class="ix-dropdown__item">Item 2</button>
                    </div>
                </ix-dropdown>
            `);

            const items = el.querySelectorAll('.ix-dropdown__item');
            items.forEach((item) => {
                expect(item.getAttribute('role')).toBe('menuitem');
            });
        });

        it('oppdaterer aria-expanded ved åpning/lukking', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item 1</button>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector('button:not(.ix-dropdown__item)')! as HTMLButtonElement;

            expect(trigger.getAttribute('aria-expanded')).toBe('false');

            trigger.click();
            expect(trigger.getAttribute('aria-expanded')).toBe('true');

            trigger.click();
            expect(trigger.getAttribute('aria-expanded')).toBe('false');
        });
    });

    describe('ID-generering', () => {
        it('genererer unik ID på menyen', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item</button>
                    </div>
                </ix-dropdown>
            `);

            const menu = el.querySelector('.ix-dropdown__menu')!;
            expect(menu.id).toMatch(/^ix-dropdown-menu-\d+$/);
        });

        it('respekterer eksisterende ID på menyen', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu" id="my-custom-menu">
                        <button class="ix-dropdown__item">Item</button>
                    </div>
                </ix-dropdown>
            `);

            const menu = el.querySelector('.ix-dropdown__menu')!;
            expect(menu.id).toBe('my-custom-menu');
        });
    });

    describe('Åpne/lukke', () => {
        it('åpner menyen ved klikk på trigger', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item</button>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector('button:not(.ix-dropdown__item)')! as HTMLButtonElement;
            const menu = el.querySelector('.ix-dropdown__menu')! as HTMLElement;

            expect(menu.hidden).toBe(true);
            expect(el.hasAttribute('data-open')).toBe(false);

            trigger.click();

            expect(menu.hidden).toBe(false);
            expect(el.hasAttribute('data-open')).toBe(true);
        });

        it('menyen er synlig ved mount når open-attributtet er satt', () => {
            const el = mount(`
                <ix-dropdown open="">
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item 1</button>
                    </div>
                </ix-dropdown>
            `);

            const menu = el.querySelector<HTMLElement>('.ix-dropdown__menu')!;

            expect(el.hasAttribute('data-open')).toBe(true);
            expect(menu.hidden).toBe(false);
        });

        it('lukker menyen ved andre klikk på trigger', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item</button>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector('button:not(.ix-dropdown__item)')! as HTMLButtonElement;
            const menu = el.querySelector('.ix-dropdown__menu')! as HTMLElement;

            trigger.click();
            expect(menu.hidden).toBe(false);

            trigger.click();
            expect(menu.hidden).toBe(true);
        });

        it('lukker menyen ved Escape', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item</button>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector('button:not(.ix-dropdown__item)')! as HTMLButtonElement;
            const menu = el.querySelector('.ix-dropdown__menu')! as HTMLElement;

            trigger.click();
            expect(menu.hidden).toBe(false);

            menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
            expect(menu.hidden).toBe(true);
        });

        it('lukker menyen ved klikk utenfor', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item</button>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector('button:not(.ix-dropdown__item)')! as HTMLButtonElement;
            const menu = el.querySelector('.ix-dropdown__menu')! as HTMLElement;

            trigger.click();
            expect(menu.hidden).toBe(false);

            document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
            expect(menu.hidden).toBe(true);
        });

        it('emitter open og close events', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item</button>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector('button:not(.ix-dropdown__item)')! as HTMLButtonElement;
            const openSpy = vi.fn();
            const closeSpy = vi.fn();

            el.addEventListener('open', openSpy);
            el.addEventListener('close', closeSpy);

            trigger.click();
            expect(openSpy).toHaveBeenCalledTimes(1);

            trigger.click();
            expect(closeSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('Tastaturnavigasjon', () => {
        it('åpner med Enter på trigger', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item</button>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector('button:not(.ix-dropdown__item)')! as HTMLButtonElement;
            const menu = el.querySelector('.ix-dropdown__menu')! as HTMLElement;

            trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            expect(menu.hidden).toBe(false);
        });

        it('åpner med Space på trigger', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item</button>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector('button:not(.ix-dropdown__item)')! as HTMLButtonElement;
            const menu = el.querySelector('.ix-dropdown__menu')! as HTMLElement;

            trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
            expect(menu.hidden).toBe(false);
        });

        it('åpner med ArrowDown på trigger og fokuserer første item', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item 1</button>
                        <button class="ix-dropdown__item">Item 2</button>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector('button:not(.ix-dropdown__item)')! as HTMLButtonElement;
            const items = el.querySelectorAll('.ix-dropdown__item');

            trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

            expect(items[0].getAttribute('tabindex')).toBe('0');
            expect(items[0].hasAttribute('data-active')).toBe(true);
        });

        it('navigerer med ArrowDown/ArrowUp', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item 1</button>
                        <button class="ix-dropdown__item">Item 2</button>
                        <button class="ix-dropdown__item">Item 3</button>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector('button:not(.ix-dropdown__item)')! as HTMLButtonElement;
            const menu = el.querySelector('.ix-dropdown__menu')! as HTMLElement;
            const items = el.querySelectorAll('.ix-dropdown__item');

            // Åpne med tastatur for å få fokus på første item
            trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            expect(items[0].hasAttribute('data-active')).toBe(true);

            menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            expect(items[1].hasAttribute('data-active')).toBe(true);

            menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            expect(items[2].hasAttribute('data-active')).toBe(true);

            menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
            expect(items[1].hasAttribute('data-active')).toBe(true);
        });

        it('hopper over disabled items', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item 1</button>
                        <button class="ix-dropdown__item" disabled>Item 2</button>
                        <button class="ix-dropdown__item">Item 3</button>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector('button:not(.ix-dropdown__item)')! as HTMLButtonElement;
            const menu = el.querySelector('.ix-dropdown__menu')! as HTMLElement;
            const items = el.querySelectorAll('.ix-dropdown__item');

            // Åpne med tastatur for å få fokus på første enabled item
            trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            expect(items[0].hasAttribute('data-active')).toBe(true);

            // ArrowDown hopper over disabled item 2 og går til item 3
            menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            expect(items[2].hasAttribute('data-active')).toBe(true);
        });

        it('Home fokuserer første item', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item 1</button>
                        <button class="ix-dropdown__item">Item 2</button>
                        <button class="ix-dropdown__item">Item 3</button>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector('button:not(.ix-dropdown__item)')! as HTMLButtonElement;
            const menu = el.querySelector('.ix-dropdown__menu')! as HTMLElement;
            const items = el.querySelectorAll('.ix-dropdown__item');

            trigger.click();
            menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

            menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
            expect(items[0].hasAttribute('data-active')).toBe(true);
        });

        it('End fokuserer siste item', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item 1</button>
                        <button class="ix-dropdown__item">Item 2</button>
                        <button class="ix-dropdown__item">Item 3</button>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector('button:not(.ix-dropdown__item)')! as HTMLButtonElement;
            const menu = el.querySelector('.ix-dropdown__menu')! as HTMLElement;
            const items = el.querySelectorAll('.ix-dropdown__item');

            trigger.click();

            menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
            expect(items[2].hasAttribute('data-active')).toBe(true);
        });
    });

    describe('Cleanup', () => {
        it('rydder opp event listeners i disconnectedCallback', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item</button>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector('button:not(.ix-dropdown__item)')! as HTMLButtonElement;

            trigger.click();
            expect(el.hasAttribute('data-open')).toBe(true);

            el.remove();

            const newWrapper = document.createElement('div');
            newWrapper.innerHTML = `
                <ix-dropdown>
                    <button>New Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item</button>
                    </div>
                </ix-dropdown>
            `;
            document.body.appendChild(newWrapper);
            const newEl = newWrapper.querySelector('ix-dropdown')!;
            expect(newEl.hasAttribute('data-open')).toBe(false);
        });

        it('fungerer etter remount', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item</button>
                    </div>
                </ix-dropdown>
            `);

            const wrapper = el.parentElement!;

            el.remove();

            wrapper.appendChild(el);

            const trigger = el.querySelector('button:not(.ix-dropdown__item)')! as HTMLButtonElement;
            const menu = el.querySelector('.ix-dropdown__menu')! as HTMLElement;

            trigger.click();
            expect(menu.hidden).toBe(false);
        });
    });

    describe('Submenyer', () => {
        it('åpner submeny med ArrowRight', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item 1</button>
                        <ix-dropdown data-submenu>
                            <button class="ix-dropdown__item ix-dropdown__submenu-trigger">Submenu</button>
                            <div class="ix-dropdown__menu">
                                <button class="ix-dropdown__item">Sub Item 1</button>
                                <button class="ix-dropdown__item">Sub Item 2</button>
                            </div>
                        </ix-dropdown>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector(':scope > button')! as HTMLButtonElement;
            const submenuDropdown = el.querySelector('ix-dropdown[data-submenu]') as IxDropdown;
            const submenuTrigger = submenuDropdown.querySelector(':scope > .ix-dropdown__item')! as HTMLButtonElement;

            trigger.click();

            // Naviger til submenu-triggeren
            const menu = el.querySelector(':scope > .ix-dropdown__menu')! as HTMLElement;
            menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

            // Åpne submeny med ArrowRight
            submenuTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

            expect(submenuDropdown.hasAttribute('data-open')).toBe(true);
        });

        it('navigerer inne i submeny med piltaster', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item 1</button>
                        <ix-dropdown data-submenu>
                            <button class="ix-dropdown__item ix-dropdown__submenu-trigger">Submenu</button>
                            <div class="ix-dropdown__menu">
                                <button class="ix-dropdown__item">Sub Item 1</button>
                                <button class="ix-dropdown__item">Sub Item 2</button>
                                <button class="ix-dropdown__item">Sub Item 3</button>
                            </div>
                        </ix-dropdown>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector(':scope > button')! as HTMLButtonElement;
            const submenuDropdown = el.querySelector('ix-dropdown[data-submenu]') as IxDropdown;
            const submenuTrigger = submenuDropdown.querySelector(':scope > .ix-dropdown__item')! as HTMLButtonElement;
            const submenuMenu = submenuDropdown.querySelector(':scope > .ix-dropdown__menu')! as HTMLElement;
            const submenuItems = submenuMenu.querySelectorAll('.ix-dropdown__item');

            trigger.click();

            // Naviger til submenu-triggeren
            const menu = el.querySelector(':scope > .ix-dropdown__menu')! as HTMLElement;
            menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

            // Åpne submeny
            submenuTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

            // Første item i submenyen skal ha fokus
            expect(submenuItems[0].hasAttribute('data-active')).toBe(true);

            // Naviger ned i submenyen - dispatch fra første item, ikke menyen
            submenuItems[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            expect(submenuItems[1].hasAttribute('data-active')).toBe(true);

            submenuItems[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            expect(submenuItems[2].hasAttribute('data-active')).toBe(true);
        });

        it('kan åpne og lukke submeny flere ganger', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item 1</button>
                        <ix-dropdown data-submenu>
                            <button class="ix-dropdown__item ix-dropdown__submenu-trigger">Submenu</button>
                            <div class="ix-dropdown__menu">
                                <button class="ix-dropdown__item">Sub Item 1</button>
                            </div>
                        </ix-dropdown>
                        <button class="ix-dropdown__item">Item 3</button>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector(':scope > button')! as HTMLButtonElement;
            const submenuDropdown = el.querySelector('ix-dropdown[data-submenu]') as IxDropdown;
            const submenuTrigger = submenuDropdown.querySelector(':scope > .ix-dropdown__item')! as HTMLButtonElement;
            const submenuMenu = submenuDropdown.querySelector(':scope > .ix-dropdown__menu')! as HTMLElement;
            const submenuItems = submenuMenu.querySelectorAll('.ix-dropdown__item');

            trigger.click();

            // Naviger til submenu-trigger
            const menu = el.querySelector(':scope > .ix-dropdown__menu')! as HTMLElement;
            menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

            // Første gang: åpne med ArrowRight fra submenu-trigger
            submenuTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
            expect(submenuDropdown.hasAttribute('data-open')).toBe(true);

            // Lukk med ArrowLeft fra submenu item
            submenuItems[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
            expect(submenuDropdown.hasAttribute('data-open')).toBe(false);
            expect(document.activeElement).toBe(submenuTrigger);

            // Verifiser at submenuTrigger har riktig tabindex og data-active etter lukking
            expect(submenuTrigger.getAttribute('tabindex')).toBe('0');
            expect(submenuTrigger.hasAttribute('data-active')).toBe(true);

            // Naviger videre nedover med ArrowDown - skal gå til neste item, ikke åpne submeny
            const item3 = menu.querySelector(':scope > .ix-dropdown__item:last-child')!;
            submenuTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            expect(submenuDropdown.hasAttribute('data-open')).toBe(false); // Submeny skal IKKE åpnes
            expect(item3.hasAttribute('data-active')).toBe(true); // Item 3 skal ha fokus

            // Naviger tilbake til submenu-trigger
            item3.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
            expect(submenuTrigger.hasAttribute('data-active')).toBe(true);

            // Andre gang: åpne igjen - nå er fokus på submenuTrigger, dispatch derfra
            // Simuler at brukeren trykker ArrowRight mens fokus er på submenuTrigger
            submenuTrigger.focus();
            submenuTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
            expect(submenuDropdown.hasAttribute('data-open')).toBe(true);

            // Og lukk igjen
            submenuItems[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
            expect(submenuDropdown.hasAttribute('data-open')).toBe(false);
        });

        it('lukker submeny med ArrowLeft og fokuserer submenu-triggeren', () => {
            const el = mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item 1</button>
                        <ix-dropdown data-submenu>
                            <button class="ix-dropdown__item ix-dropdown__submenu-trigger">Submenu</button>
                            <div class="ix-dropdown__menu">
                                <button class="ix-dropdown__item">Sub Item 1</button>
                            </div>
                        </ix-dropdown>
                    </div>
                </ix-dropdown>
            `);

            const trigger = el.querySelector(':scope > button')! as HTMLButtonElement;
            const submenuDropdown = el.querySelector('ix-dropdown[data-submenu]') as IxDropdown;
            const submenuTrigger = submenuDropdown.querySelector(':scope > .ix-dropdown__item')! as HTMLButtonElement;
            const submenuMenu = submenuDropdown.querySelector(':scope > .ix-dropdown__menu')! as HTMLElement;
            const submenuItems = submenuMenu.querySelectorAll('.ix-dropdown__item');

            trigger.click();

            const menu = el.querySelector(':scope > .ix-dropdown__menu')! as HTMLElement;
            menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

            // Åpne submeny
            submenuTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
            expect(submenuDropdown.hasAttribute('data-open')).toBe(true);

            // Lukk med ArrowLeft - dispatch fra et item i submenyen
            submenuItems[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
            expect(submenuDropdown.hasAttribute('data-open')).toBe(false);

            // Fokus skal være på submenu-triggeren, ikke hovedtriggeren
            expect(document.activeElement).toBe(submenuTrigger);
        });
    });

    describe('Manglende elementer', () => {
        it('logger warning når trigger mangler', () => {
            const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            mount(`
                <ix-dropdown>
                    <div class="ix-dropdown__menu">
                        <button class="ix-dropdown__item">Item</button>
                    </div>
                </ix-dropdown>
            `);

            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });

        it('logger warning når menu mangler', () => {
            const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            mount(`
                <ix-dropdown>
                    <button>Trigger</button>
                </ix-dropdown>
            `);

            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });
    });
});
