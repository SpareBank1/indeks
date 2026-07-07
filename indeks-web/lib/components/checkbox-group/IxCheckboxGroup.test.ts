import { afterEach, describe, expect, it, vi } from 'vitest';
import { IxCheckboxGroup } from './IxCheckboxGroup';

if (!customElements.get('ix-checkbox-group')) {
    customElements.define('ix-checkbox-group', IxCheckboxGroup);
}

function mount(html: string): IxCheckboxGroup {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
    return wrapper.querySelector('ix-checkbox-group')!;
}

const ITEM = (value: string, label: string, attrs = '') => `
  <div class="ix-checkbox">
    <input type="checkbox" value="${value}" ${attrs} />
    <label>${label}</label>
  </div>
`;

const SIMPLE = `
<ix-checkbox-group>
  <span data-field="legend">Hvordan vil du bli kontaktet?</span>
  <div data-field="items">
    ${ITEM('epost', 'E-post')}
    ${ITEM('sms', 'SMS')}
  </div>
  <span data-field="error"></span>
</ix-checkbox-group>
`;

afterEach(() => {
    document.body.innerHTML = '';
});

describe('IxCheckboxGroup', () => {
    describe('rolle', () => {
        it('setter role="group" på host (ikke radiogroup)', () => {
            const el = mount(SIMPLE);
            expect(el.getAttribute('role')).toBe('group');
        });
    });

    describe('legend og aria-labelledby', () => {
        it('setter aria-labelledby til legend-id', () => {
            const el = mount(SIMPLE);
            const legend = el.querySelector('[data-field="legend"]')!;
            expect(legend.id).toMatch(/^ix-checkbox-group-legend-\d+$/);
            expect(el.getAttribute('aria-labelledby')).toBe(legend.id);
        });

        it('respekterer eksisterende id på legend', () => {
            const el = mount(`
                <ix-checkbox-group>
                    <span data-field="legend" id="min-legend">Velg</span>
                    <div data-field="items">${ITEM('a', 'A')}</div>
                    <span data-field="error"></span>
                </ix-checkbox-group>
            `);
            expect(el.getAttribute('aria-labelledby')).toBe('min-legend');
        });

        it('logger warn (DEV) når legend mangler', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            mount(`
                <ix-checkbox-group>
                    <div data-field="items">${ITEM('a', 'A')}</div>
                    <span data-field="error"></span>
                </ix-checkbox-group>
            `);
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('legend'));
            warnSpy.mockRestore();
        });
    });

    describe('aria-describedby', () => {
        it('setter aria-describedby med description og error (description først)', () => {
            const el = mount(`
                <ix-checkbox-group>
                    <span data-field="legend">Velg</span>
                    <span data-field="description">Hjelp</span>
                    <div data-field="items">${ITEM('a', 'A')}</div>
                    <span data-field="error"></span>
                </ix-checkbox-group>
            `);
            const desc = el.querySelector('[data-field="description"]')!;
            const error = el.querySelector('[data-field="error"]')!;
            expect(el.getAttribute('aria-describedby')).toBe(`${desc.id} ${error.id}`);
        });

        it('setter aria-describedby kun med error når description mangler', () => {
            const el = mount(SIMPLE);
            const error = el.querySelector('[data-field="error"]')!;
            expect(el.getAttribute('aria-describedby')).toBe(error.id);
        });

        it('setter ikke aria-describedby når hverken description eller error finnes', () => {
            const el = mount(`
                <ix-checkbox-group>
                    <span data-field="legend">Velg</span>
                    <div data-field="items">${ITEM('a', 'A')}</div>
                </ix-checkbox-group>
            `);
            expect(el.hasAttribute('aria-describedby')).toBe(false);
        });
    });

    describe('ID-generering og label-kobling', () => {
        it('genererer id på hvert input', () => {
            const el = mount(SIMPLE);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            for (const input of inputs) {
                expect(input.id).toMatch(/^ix-checkbox-\d+$/);
            }
        });

        it('respekterer eksisterende id på input', () => {
            const el = mount(`
                <ix-checkbox-group>
                    <span data-field="legend">Velg</span>
                    <div data-field="items">${ITEM('a', 'A', 'id="allerede-satt"')}</div>
                    <span data-field="error"></span>
                </ix-checkbox-group>
            `);
            expect(el.querySelector('input')!.id).toBe('allerede-satt');
        });

        it('genererer unike IDer for inputs på tvers av instanser', () => {
            const el1 = mount(`
                <ix-checkbox-group>
                    <span data-field="legend">G1</span>
                    <div data-field="items">${ITEM('a', 'A')}</div>
                    <span data-field="error"></span>
                </ix-checkbox-group>
            `);
            const el2 = mount(`
                <ix-checkbox-group>
                    <span data-field="legend">G2</span>
                    <div data-field="items">${ITEM('b', 'B')}</div>
                    <span data-field="error"></span>
                </ix-checkbox-group>
            `);
            const id1 = el1.querySelector('input')!.id;
            const id2 = el2.querySelector('input')!.id;
            expect(id1).not.toBe(id2);
        });
    });

    describe('name-propagering (ingen mutex-auto-generering)', () => {
        it('genererer IKKE et felles name når host mangler name', () => {
            const el = mount(SIMPLE);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            // Checkbox trenger ikke felles name; uten host-name forblir input-name tomt.
            for (const input of inputs) expect(input.name).toBe('');
        });

        it('propagerer name fra host til alle inputs', () => {
            const el = mount(`
                <ix-checkbox-group name="kontakt">
                    <span data-field="legend">Velg</span>
                    <div data-field="items">${ITEM('a', 'A')}${ITEM('b', 'B')}</div>
                    <span data-field="error"></span>
                </ix-checkbox-group>
            `);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            expect(inputs[0].name).toBe('kontakt');
            expect(inputs[1].name).toBe('kontakt');
        });

        it('lar forfatterens egne name stå når host mangler name', () => {
            const el = mount(`
                <ix-checkbox-group>
                    <span data-field="legend">Velg</span>
                    <div data-field="items">${ITEM('a', 'A', 'name="eget"')}</div>
                    <span data-field="error"></span>
                </ix-checkbox-group>
            `);
            expect(el.querySelector('input')!.name).toBe('eget');
        });
    });

    describe('aria-live og aria-invalid', () => {
        it('setter aria-live="polite" på error-elementet', () => {
            const el = mount(SIMPLE);
            const error = el.querySelector('[data-field="error"]')!;
            expect(error.getAttribute('aria-live')).toBe('polite');
        });

        it('setter aria-invalid="true" kun på host når error har innhold', async () => {
            const el = mount(SIMPLE);
            const error = el.querySelector('[data-field="error"]')!;
            error.textContent = 'Du må velge minst ett alternativ';
            await new Promise((r) => setTimeout(r, 0));
            expect(el.getAttribute('aria-invalid')).toBe('true');
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            for (const input of inputs) expect(input.hasAttribute('aria-invalid')).toBe(false);
        });

        it('fjerner aria-invalid fra host når error er tom', async () => {
            const el = mount(`
                <ix-checkbox-group>
                    <span data-field="legend">Velg</span>
                    <div data-field="items">${ITEM('a', 'A')}</div>
                    <span data-field="error">Feil</span>
                </ix-checkbox-group>
            `);
            expect(el.getAttribute('aria-invalid')).toBe('true');
            el.querySelector('[data-field="error"]')!.textContent = '';
            await new Promise((r) => setTimeout(r, 0));
            expect(el.hasAttribute('aria-invalid')).toBe(false);
        });

        it('oppdaterer aria-invalid dynamisk via MutationObserver', async () => {
            const el = mount(SIMPLE);
            const error = el.querySelector('[data-field="error"]')!;
            expect(el.hasAttribute('aria-invalid')).toBe(false);

            error.textContent = 'Velg et alternativ';
            await new Promise((r) => setTimeout(r, 0));
            expect(el.getAttribute('aria-invalid')).toBe('true');

            error.textContent = '';
            await new Promise((r) => setTimeout(r, 0));
            expect(el.hasAttribute('aria-invalid')).toBe(false);
        });

        it('setter ikke aria-invalid når error kun har whitespace', () => {
            const el = mount(`
                <ix-checkbox-group>
                    <span data-field="legend">Velg</span>
                    <div data-field="items">${ITEM('a', 'A')}</div>
                    <span data-field="error">   </span>
                </ix-checkbox-group>
            `);
            expect(el.hasAttribute('aria-invalid')).toBe(false);
        });
    });

    describe('disabled/readonly propagering', () => {
        it('setter disabled på alle inputs når host har disabled', () => {
            const el = mount(`
                <ix-checkbox-group disabled>
                    <span data-field="legend">Velg</span>
                    <div data-field="items">${ITEM('a', 'A')}${ITEM('b', 'B')}</div>
                    <span data-field="error"></span>
                </ix-checkbox-group>
            `);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            for (const input of inputs) expect(input.disabled).toBe(true);
        });

        it('per-knapp disabled bevares gjennom group disable+enable-syklus', () => {
            const el = mount(`
                <ix-checkbox-group>
                    <span data-field="legend">Velg</span>
                    <div data-field="items">${ITEM('a', 'A', 'disabled')}${ITEM('b', 'B')}</div>
                    <span data-field="error"></span>
                </ix-checkbox-group>
            `);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            expect(inputs[0].disabled).toBe(true);
            expect(inputs[1].disabled).toBe(false);

            el.setAttribute('disabled', '');
            expect(inputs[0].disabled).toBe(true);
            expect(inputs[1].disabled).toBe(true);

            el.removeAttribute('disabled');
            expect(inputs[0].disabled).toBe(true);
            expect(inputs[1].disabled).toBe(false);
        });

        it('blokkerer Space på host når readonly er satt', () => {
            const el = mount(`
                <ix-checkbox-group readonly>
                    <span data-field="legend">Velg</span>
                    <div data-field="items">${ITEM('a', 'A')}${ITEM('b', 'B')}</div>
                    <span data-field="error"></span>
                </ix-checkbox-group>
            `);
            const space = new KeyboardEvent('keydown', { key: ' ', cancelable: true, bubbles: true });
            el.dispatchEvent(space);
            expect(space.defaultPrevented).toBe(true);
        });

        it('blokkerer ikke Space når readonly ikke er satt', () => {
            const el = mount(SIMPLE);
            const space = new KeyboardEvent('keydown', { key: ' ', cancelable: true, bubbles: true });
            el.dispatchEvent(space);
            expect(space.defaultPrevented).toBe(false);
        });

        it('setter ikke readOnly på input — readOnly er en no-op for checkbox', () => {
            const el = mount(`
                <ix-checkbox-group readonly>
                    <span data-field="legend">Velg</span>
                    <div data-field="items">${ITEM('a', 'A')}</div>
                    <span data-field="error"></span>
                </ix-checkbox-group>
            `);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            for (const input of inputs) expect(input.readOnly).toBe(false);
        });

        it('rører ikke required automatisk (ingen radio-triks)', () => {
            const el = mount(`
                <ix-checkbox-group required>
                    <span data-field="legend">Velg</span>
                    <div data-field="items">${ITEM('a', 'A')}${ITEM('b', 'B')}</div>
                    <span data-field="error"></span>
                </ix-checkbox-group>
            `);
            // required på host gir ikke automatisk required på noen input,
            // og ingen aria-required settes (checkbox-required er per-felt).
            expect(el.hasAttribute('aria-required')).toBe(false);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            for (const input of inputs) expect(input.required).toBe(false);
        });

        it('oppdaterer disabled via attributeChangedCallback', () => {
            const el = mount(SIMPLE);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            expect(inputs[0].disabled).toBe(false);

            el.setAttribute('disabled', '');
            for (const input of inputs) expect(input.disabled).toBe(true);

            el.removeAttribute('disabled');
            for (const input of inputs) expect(input.disabled).toBe(false);
        });
    });

    describe('dynamisk DOM (childList MutationObserver)', () => {
        it('wirer en input som legges til etter mount', async () => {
            const el = mount(SIMPLE);
            const items = el.querySelector('[data-field="items"]')!;
            const wrapper = document.createElement('div');
            wrapper.className = 'ix-checkbox';
            wrapper.innerHTML = '<input type="checkbox" value="ny" /><label>Ny</label>';
            items.appendChild(wrapper);
            await new Promise((r) => setTimeout(r, 0));

            const newInput = wrapper.querySelector('input')!;
            expect(newInput.id).toMatch(/^ix-checkbox-\d+$/);
        });

        it('propagerer host-name til dynamisk tilføyde inputs', async () => {
            const el = mount(`
                <ix-checkbox-group name="kontakt">
                    <span data-field="legend">Velg</span>
                    <div data-field="items">${ITEM('a', 'A')}</div>
                    <span data-field="error"></span>
                </ix-checkbox-group>
            `);
            const items = el.querySelector('[data-field="items"]')!;
            const wrapper = document.createElement('div');
            wrapper.className = 'ix-checkbox';
            wrapper.innerHTML = '<input type="checkbox" value="b" /><label>B</label>';
            items.appendChild(wrapper);
            await new Promise((r) => setTimeout(r, 0));

            expect(wrapper.querySelector('input')!.name).toBe('kontakt');
        });
    });

    describe('cleanup', () => {
        it('kobler fra error MutationObserver i disconnectedCallback', () => {
            const el = mount(SIMPLE);
            const observer = (el as unknown as { _errorObserver: MutationObserver })._errorObserver;
            expect(observer).not.toBeNull();

            const disconnectSpy = vi.spyOn(observer, 'disconnect');
            el.remove();
            expect(disconnectSpy).toHaveBeenCalled();
        });

        it('kobler fra child MutationObserver i disconnectedCallback', () => {
            const el = mount(SIMPLE);
            const observer = (el as unknown as { _childObserver: MutationObserver })._childObserver;
            expect(observer).not.toBeNull();

            const disconnectSpy = vi.spyOn(observer, 'disconnect');
            el.remove();
            expect(disconnectSpy).toHaveBeenCalled();
        });

        it('setter _errorObserver og _childObserver til null etter disconnect', () => {
            const el = mount(SIMPLE);
            el.remove();
            expect((el as unknown as { _errorObserver: unknown })._errorObserver).toBeNull();
            expect((el as unknown as { _childObserver: unknown })._childObserver).toBeNull();
        });

        it('fjerner keydown-listener i disconnectedCallback', () => {
            const el = mount(`
                <ix-checkbox-group readonly>
                    <span data-field="legend">Velg</span>
                    <div data-field="items">${ITEM('a', 'A')}</div>
                    <span data-field="error"></span>
                </ix-checkbox-group>
            `);
            expect((el as unknown as { _keydownListener: unknown })._keydownListener).not.toBeNull();

            el.remove();
            expect((el as unknown as { _keydownListener: unknown })._keydownListener).toBeNull();

            document.body.appendChild(el);
            const space = new KeyboardEvent('keydown', { key: ' ', cancelable: true, bubbles: true });
            el.dispatchEvent(space);
            expect(space.defaultPrevented).toBe(true);
        });

        it('fungerer korrekt ved remount', async () => {
            const el = mount(SIMPLE);
            el.remove();

            document.body.appendChild(el);
            const error = el.querySelector('[data-field="error"]')!;
            error.textContent = 'Feil etter remount';
            await new Promise((r) => setTimeout(r, 0));
            expect(el.getAttribute('aria-invalid')).toBe('true');
        });
    });

    describe('manglende delelementer', () => {
        it('warner (DEV) når inputs mangler', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            mount(`
                <ix-checkbox-group>
                    <span data-field="legend">Velg</span>
                    <span data-field="error"></span>
                </ix-checkbox-group>
            `);
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('input'));
            warnSpy.mockRestore();
        });

        it('krasjer ikke med tomt innhold', () => {
            expect(() => mount('<ix-checkbox-group></ix-checkbox-group>')).not.toThrow();
        });
    });
});
