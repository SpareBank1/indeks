import { afterEach, describe, expect, it, vi } from 'vitest';
import { IxPhoneNumberField } from './IxPhoneNumberField';

if (!customElements.get('ix-phone-number-field')) {
    customElements.define('ix-phone-number-field', IxPhoneNumberField);
}

function mount(html: string): IxPhoneNumberField {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
    return wrapper.querySelector('ix-phone-number-field')!;
}

const SIMPLE = `
<ix-phone-number-field>
  <span data-field="legend">Mobilnummer</span>
  <span data-field="description">Vi bruker det kun til varsling</span>
  <div data-field="items">
    <ix-combobox data-field="country"><input /></ix-combobox>
    <div data-field="number"><div class="ix-text-field"><input type="tel" /></div></div>
  </div>
  <span data-field="error"></span>
</ix-phone-number-field>
`;

afterEach(() => {
    document.body.innerHTML = '';
});

describe('IxPhoneNumberField', () => {
    describe('rolle', () => {
        it('setter role="group" på host', () => {
            const el = mount(SIMPLE);
            expect(el.getAttribute('role')).toBe('group');
        });
    });

    describe('legend og aria-labelledby', () => {
        it('kobler aria-labelledby til legend-id', () => {
            const el = mount(SIMPLE);
            const legend = el.querySelector('[data-field="legend"]')!;
            expect(legend.id).toMatch(/^ix-phone-number-field-legend-\d+$/);
            expect(el.getAttribute('aria-labelledby')).toBe(legend.id);
        });

        it('respekterer eksisterende legend-id', () => {
            const el = mount(`
                <ix-phone-number-field>
                  <span data-field="legend" id="egen-id">Mobilnummer</span>
                  <div data-field="items"><ix-combobox><input /></ix-combobox></div>
                  <span data-field="error"></span>
                </ix-phone-number-field>
            `);
            expect(el.getAttribute('aria-labelledby')).toBe('egen-id');
        });

        it('advarer i DEV når legend mangler', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            mount(`
                <ix-phone-number-field>
                  <div data-field="items"><ix-combobox><input /></ix-combobox></div>
                </ix-phone-number-field>
            `);
            expect(warn).toHaveBeenCalledWith(expect.stringContaining('[ix-phone-number-field]'));
            warn.mockRestore();
        });
    });

    describe('aria-describedby', () => {
        it('peker til description og error i rekkefølge', () => {
            const el = mount(SIMPLE);
            const desc = el.querySelector('[data-field="description"]')!;
            const error = el.querySelector('[data-field="error"]')!;
            expect(el.getAttribute('aria-describedby')).toBe(`${desc.id} ${error.id}`);
        });

        it('re-kobler describedby når description legges til etter mount', async () => {
            // React kan rendre en betinget description inn i ettertid — da må den
            // fanges opp av childList-observeren og kobles på aria-describedby.
            const el = mount(`
                <ix-phone-number-field>
                  <span data-field="legend">Mobilnummer</span>
                  <div data-field="items"><ix-combobox><input /></ix-combobox></div>
                  <span data-field="error"></span>
                </ix-phone-number-field>
            `);
            const error = el.querySelector('[data-field="error"]')!;
            expect(el.getAttribute('aria-describedby')).toBe(error.id);

            const desc = document.createElement('span');
            desc.setAttribute('data-field', 'description');
            desc.textContent = 'Norsk format: 123 45 678';
            el.insertBefore(desc, el.querySelector('[data-field="items"]'));
            await Promise.resolve();

            expect(desc.id).toMatch(/^ix-phone-number-field-desc-\d+$/);
            expect(el.getAttribute('aria-describedby')).toBe(`${desc.id} ${error.id}`);
        });

        it('fjerner description-id fra describedby når description forsvinner', async () => {
            const el = mount(SIMPLE);
            const desc = el.querySelector<HTMLElement>('[data-field="description"]')!;
            const error = el.querySelector('[data-field="error"]')!;
            expect(el.getAttribute('aria-describedby')).toBe(`${desc.id} ${error.id}`);

            desc.remove();
            await Promise.resolve();

            expect(el.getAttribute('aria-describedby')).toBe(error.id);
        });
    });

    describe('aria-invalid via feiltekst', () => {
        it('settes når error får innhold og fjernes når den tømmes', async () => {
            const el = mount(SIMPLE);
            const error = el.querySelector<HTMLElement>('[data-field="error"]')!;
            expect(el.hasAttribute('aria-invalid')).toBe(false);

            error.textContent = 'Skriv inn et gyldig telefonnummer';
            await Promise.resolve();
            expect(el.getAttribute('aria-invalid')).toBe('true');

            error.textContent = '';
            await Promise.resolve();
            expect(el.hasAttribute('aria-invalid')).toBe(false);
        });

        it('setter aria-live="polite" på error-elementet', () => {
            const el = mount(SIMPLE);
            const error = el.querySelector('[data-field="error"]')!;
            expect(error.getAttribute('aria-live')).toBe('polite');
        });
    });

    describe('disabled-propagering', () => {
        it('propagerer disabled til combobox (attributt) og nummer-input (property)', () => {
            const el = mount(SIMPLE);
            el.setAttribute('disabled', '');
            const combobox = el.querySelector('ix-combobox')!;
            const input = el.querySelector<HTMLInputElement>('[data-field="number"] input')!;
            expect(combobox.hasAttribute('disabled')).toBe(true);
            expect(input.disabled).toBe(true);
        });

        it('gjenoppretter kontroll-tilstand når group-disabled fjernes', () => {
            const el = mount(SIMPLE);
            el.setAttribute('disabled', '');
            el.removeAttribute('disabled');
            const combobox = el.querySelector('ix-combobox')!;
            const input = el.querySelector<HTMLInputElement>('[data-field="number"] input')!;
            expect(combobox.hasAttribute('disabled')).toBe(false);
            expect(input.disabled).toBe(false);
        });

        it('bevarer forfatterens egen disabled på nummer-input ved group-toggle', () => {
            const el = mount(SIMPLE);
            const input = el.querySelector<HTMLInputElement>('[data-field="number"] input')!;
            input.disabled = true;
            el.setAttribute('disabled', '');
            el.removeAttribute('disabled');
            // Egen verdi (true) skal overleve group-toggelen.
            expect(input.disabled).toBe(true);
        });
    });

    describe('readonly-propagering', () => {
        it('propagerer readonly til combobox (attributt) og nummer-input (property)', () => {
            const el = mount(SIMPLE);
            el.setAttribute('readonly', '');
            const combobox = el.querySelector('ix-combobox')!;
            const input = el.querySelector<HTMLInputElement>('[data-field="number"] input')!;
            expect(combobox.hasAttribute('readonly')).toBe(true);
            expect(input.readOnly).toBe(true);
        });
    });

    describe('opprydding', () => {
        it('kobler fra observere ved disconnect', () => {
            const el = mount(SIMPLE);
            expect(() => el.remove()).not.toThrow();
        });
    });
});
