import { afterEach, describe, expect, it, vi } from 'vitest';
import { IxRadioGroup } from './IxRadioGroup';

if (!customElements.get('ix-radio-group')) {
    customElements.define('ix-radio-group', IxRadioGroup);
}

function mount(html: string): IxRadioGroup {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
    return wrapper.querySelector('ix-radio-group')!;
}

const SIMPLE = `
<ix-radio-group>
  <span data-field="legend">Velg kundetype</span>
  <div class="ix-radio-button"><input type="radio" value="privat" /><label>Privat</label></div>
  <div class="ix-radio-button"><input type="radio" value="bedrift" /><label>Bedrift</label></div>
  <span data-field="error"></span>
</ix-radio-group>
`;

afterEach(() => {
    document.body.innerHTML = '';
});

describe('IxRadioGroup', () => {
    describe('rolle', () => {
        it('setter role="radiogroup" på host', () => {
            const el = mount(SIMPLE);
            expect(el.getAttribute('role')).toBe('radiogroup');
        });
    });

    describe('legend og aria-labelledby', () => {
        it('setter aria-labelledby til legend-id', () => {
            const el = mount(SIMPLE);
            const legend = el.querySelector('[data-field="legend"]')!;
            expect(legend.id).toMatch(/^ix-radio-group-legend-\d+$/);
            expect(el.getAttribute('aria-labelledby')).toBe(legend.id);
        });

        it('respekterer eksisterende id på legend', () => {
            const el = mount(`
                <ix-radio-group>
                    <span data-field="legend" id="min-legend">Velg</span>
                    <div class="ix-radio-button"><input type="radio" value="a" /><label>A</label></div>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            expect(el.getAttribute('aria-labelledby')).toBe('min-legend');
        });

        it('logger warn (DEV) når legend mangler', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            mount(`
                <ix-radio-group>
                    <div class="ix-radio-button"><input type="radio" value="a" /><label>A</label></div>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('legend'));
            warnSpy.mockRestore();
        });
    });

    describe('aria-describedby', () => {
        it('setter aria-describedby med description og error (description først)', () => {
            const el = mount(`
                <ix-radio-group>
                    <span data-field="legend">Velg</span>
                    <span data-field="description">Hjelp</span>
                    <div class="ix-radio-button"><input type="radio" value="a" /><label>A</label></div>
                    <span data-field="error"></span>
                </ix-radio-group>
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
                <ix-radio-group>
                    <span data-field="legend">Velg</span>
                    <div class="ix-radio-button"><input type="radio" value="a" /><label>A</label></div>
                </ix-radio-group>
            `);
            expect(el.hasAttribute('aria-describedby')).toBe(false);
        });
    });

    describe('ID-generering og label-kobling', () => {
        it('genererer id på hvert input', () => {
            const el = mount(SIMPLE);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            for (const input of inputs) {
                expect(input.id).toMatch(/^ix-radio-\d+$/);
            }
        });

        it('setter htmlFor på label hvis den ikke har det', () => {
            const el = mount(SIMPLE);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            const labels = el.querySelectorAll<HTMLLabelElement>('label');
            expect(labels[0].htmlFor).toBe(inputs[0].id);
            expect(labels[1].htmlFor).toBe(inputs[1].id);
        });

        it('respekterer eksisterende id på input', () => {
            const el = mount(`
                <ix-radio-group>
                    <span data-field="legend">Velg</span>
                    <div class="ix-radio-button">
                        <input type="radio" id="allerede-satt" value="a" />
                        <label>A</label>
                    </div>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            expect(el.querySelector('input')!.id).toBe('allerede-satt');
        });

        it('respekterer eksisterende htmlFor på label', () => {
            const el = mount(`
                <ix-radio-group>
                    <span data-field="legend">Velg</span>
                    <div class="ix-radio-button">
                        <input type="radio" id="mitt-input" value="a" />
                        <label for="mitt-input">A</label>
                    </div>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            expect(el.querySelector('label')!.htmlFor).toBe('mitt-input');
        });

        it('genererer unike IDer for inputs på tvers av instanser', () => {
            const el1 = mount(`
                <ix-radio-group>
                    <span data-field="legend">G1</span>
                    <div class="ix-radio-button"><input type="radio" value="a" /><label>A</label></div>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            const el2 = mount(`
                <ix-radio-group>
                    <span data-field="legend">G2</span>
                    <div class="ix-radio-button"><input type="radio" value="b" /><label>B</label></div>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            const id1 = el1.querySelector('input')!.id;
            const id2 = el2.querySelector('input')!.id;
            expect(id1).not.toBe(id2);
        });
    });

    describe('name-synkronisering', () => {
        it('genererer gruppe-name når ingen input har name', () => {
            const el = mount(SIMPLE);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            const names = Array.from(inputs).map((i) => i.name);
            expect(names[0]).toMatch(/^ix-radio-group-name-\d+$/);
            expect(names[0]).toBe(names[1]);
        });

        it('propagerer name fra host til alle inputs', () => {
            const el = mount(`
                <ix-radio-group name="kundetype">
                    <span data-field="legend">Velg</span>
                    <div class="ix-radio-button">
                        <input type="radio" value="a" />
                        <label>A</label>
                    </div>
                    <div class="ix-radio-button">
                        <input type="radio" value="b" />
                        <label>B</label>
                    </div>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            expect(inputs[0].name).toBe('kundetype');
            expect(inputs[1].name).toBe('kundetype');
        });

        it('host name har prioritet over input name', () => {
            const el = mount(`
                <ix-radio-group name="host-name">
                    <span data-field="legend">Velg</span>
                    <div class="ix-radio-button">
                        <input type="radio" name="input-name" value="a" />
                        <label>A</label>
                    </div>
                    <div class="ix-radio-button">
                        <input type="radio" value="b" />
                        <label>B</label>
                    </div>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            expect(inputs[0].name).toBe('host-name');
            expect(inputs[1].name).toBe('host-name');
        });

        it('propagerer eksisterende name til alle inputs', () => {
            const el = mount(`
                <ix-radio-group>
                    <span data-field="legend">Velg</span>
                    <div class="ix-radio-button">
                        <input type="radio" name="gruppe" value="a" />
                        <label>A</label>
                    </div>
                    <div class="ix-radio-button">
                        <input type="radio" value="b" />
                        <label>B</label>
                    </div>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            expect(inputs[0].name).toBe('gruppe');
            expect(inputs[1].name).toBe('gruppe');
        });

        it('alle inputs har samme name i gruppen', () => {
            const el = mount(SIMPLE);
            const inputs = Array.from(el.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
            const uniqueNames = new Set(inputs.map((i) => i.name));
            expect(uniqueNames.size).toBe(1);
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
            error.textContent = 'Du må velge et alternativ';
            await new Promise((r) => setTimeout(r, 0));
            expect(el.getAttribute('aria-invalid')).toBe('true');
            // Inputs skal ikke ha aria-invalid — det er gruppens validitet som telles.
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            for (const input of inputs) expect(input.hasAttribute('aria-invalid')).toBe(false);
        });

        it('fjerner aria-invalid fra host når error er tom', async () => {
            const el = mount(`
                <ix-radio-group>
                    <span data-field="legend">Velg</span>
                    <div class="ix-radio-button"><input type="radio" value="a" /><label>A</label></div>
                    <span data-field="error">Feil</span>
                </ix-radio-group>
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
                <ix-radio-group>
                    <span data-field="legend">Velg</span>
                    <div class="ix-radio-button"><input type="radio" value="a" /><label>A</label></div>
                    <span data-field="error">   </span>
                </ix-radio-group>
            `);
            expect(el.hasAttribute('aria-invalid')).toBe(false);
        });
    });

    describe('disabled/readonly propagering', () => {
        it('setter disabled på alle inputs når host har disabled', () => {
            const el = mount(`
                <ix-radio-group disabled>
                    <span data-field="legend">Velg</span>
                    <div class="ix-radio-button"><input type="radio" value="a" /><label>A</label></div>
                    <div class="ix-radio-button"><input type="radio" value="b" /><label>B</label></div>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            for (const input of inputs) expect(input.disabled).toBe(true);
        });

        it('per-knapp disabled bevares gjennom group disable+enable-syklus', () => {
            const el = mount(`
                <ix-radio-group>
                    <span data-field="legend">Velg</span>
                    <div class="ix-radio-button"><input type="radio" value="a" disabled /><label>A</label></div>
                    <div class="ix-radio-button"><input type="radio" value="b" /><label>B</label></div>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            expect(inputs[0].disabled).toBe(true);
            expect(inputs[1].disabled).toBe(false);

            // Group disable: alle skal bli disabled
            el.setAttribute('disabled', '');
            expect(inputs[0].disabled).toBe(true);
            expect(inputs[1].disabled).toBe(true);

            // Group enable: per-knapp disabled på inputs[0] skal være bevart
            el.removeAttribute('disabled');
            expect(inputs[0].disabled).toBe(true);
            expect(inputs[1].disabled).toBe(false);
        });

        it('blokkerer ArrowKeys og Space på host når readonly er satt', () => {
            const el = mount(`
                <ix-radio-group readonly>
                    <span data-field="legend">Velg</span>
                    <div class="ix-radio-button"><input type="radio" value="a" /><label>A</label></div>
                    <div class="ix-radio-button"><input type="radio" value="b" /><label>B</label></div>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            const event = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true, bubbles: true });
            el.dispatchEvent(event);
            expect(event.defaultPrevented).toBe(true);

            const space = new KeyboardEvent('keydown', { key: ' ', cancelable: true, bubbles: true });
            el.dispatchEvent(space);
            expect(space.defaultPrevented).toBe(true);
        });

        it('blokkerer ikke ArrowKeys når readonly ikke er satt', () => {
            const el = mount(SIMPLE);
            const event = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true, bubbles: true });
            el.dispatchEvent(event);
            expect(event.defaultPrevented).toBe(false);
        });

        it('setter ikke readOnly på input — readOnly er en no-op for radio', () => {
            const el = mount(`
                <ix-radio-group readonly>
                    <span data-field="legend">Velg</span>
                    <div class="ix-radio-button"><input type="radio" value="a" /><label>A</label></div>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            for (const input of inputs) expect(input.readOnly).toBe(false);
        });

        it('setter aria-required på host og required kun på første input når host har required', () => {
            const el = mount(`
                <ix-radio-group required>
                    <span data-field="legend">Velg</span>
                    <div class="ix-radio-button"><input type="radio" value="a" /><label>A</label></div>
                    <div class="ix-radio-button"><input type="radio" value="b" /><label>B</label></div>
                    <div class="ix-radio-button"><input type="radio" value="c" /><label>C</label></div>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            expect(el.getAttribute('aria-required')).toBe('true');
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            expect(inputs[0].required).toBe(true);
            expect(inputs[1].required).toBe(false);
            expect(inputs[2].required).toBe(false);
        });

        it('fjerner aria-required og required når required-attributtet fjernes', () => {
            const el = mount(`
                <ix-radio-group required>
                    <span data-field="legend">Velg</span>
                    <div class="ix-radio-button"><input type="radio" value="a" /><label>A</label></div>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            el.removeAttribute('required');
            expect(el.hasAttribute('aria-required')).toBe(false);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            for (const input of inputs) expect(input.required).toBe(false);
        });

        it('oppdaterer disabled via attributeChangedCallback', () => {
            const el = mount(SIMPLE);
            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="radio"]');
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
            const wrapper = document.createElement('div');
            wrapper.className = 'ix-radio-button';
            wrapper.innerHTML = '<input type="radio" value="ny" /><label>Ny</label>';
            el.insertBefore(wrapper, el.querySelector('[data-field="error"]'));
            await new Promise((r) => setTimeout(r, 0));

            const newInput = wrapper.querySelector('input')!;
            const newLabel = wrapper.querySelector('label')!;
            expect(newInput.id).toMatch(/^ix-radio-\d+$/);
            expect(newLabel.htmlFor).toBe(newInput.id);

            // name skal være samme som de eksisterende
            const inputs = Array.from(el.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
            const uniqueNames = new Set(inputs.map((i) => i.name));
            expect(uniqueNames.size).toBe(1);
        });

        it('re-syncer required når inputs legges til', async () => {
            const el = mount(`
                <ix-radio-group required>
                    <span data-field="legend">Velg</span>
                    <div class="ix-radio-button"><input type="radio" value="a" /><label>A</label></div>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            const wrapper = document.createElement('div');
            wrapper.className = 'ix-radio-button';
            wrapper.innerHTML = '<input type="radio" value="b" /><label>B</label>';
            el.insertBefore(wrapper, el.querySelector('[data-field="error"]'));
            await new Promise((r) => setTimeout(r, 0));

            const inputs = el.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            expect(inputs[0].required).toBe(true);
            expect(inputs[1].required).toBe(false);
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
                <ix-radio-group readonly>
                    <span data-field="legend">Velg</span>
                    <div class="ix-radio-button"><input type="radio" value="a" /><label>A</label></div>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            expect((el as unknown as { _keydownListener: unknown })._keydownListener).not.toBeNull();

            el.remove();
            expect((el as unknown as { _keydownListener: unknown })._keydownListener).toBeNull();

            // Re-attach for å verifisere at en ny mount-syklus fungerer
            document.body.appendChild(el);
            const event = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true, bubbles: true });
            el.dispatchEvent(event);
            expect(event.defaultPrevented).toBe(true);
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
                <ix-radio-group>
                    <span data-field="legend">Velg</span>
                    <span data-field="error"></span>
                </ix-radio-group>
            `);
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('input'));
            warnSpy.mockRestore();
        });

        it('krasjer ikke med tomt innhold', () => {
            expect(() => mount('<ix-radio-group></ix-radio-group>')).not.toThrow();
        });
    });
});
