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

// Fullt combobox-scaffold med TOM listbox — slik forfatteren nå kan skrive den.
// ix-combobox er ikke registrert i denne testfila, så den er inert; vi tester
// injiseringen isolert (options + aria-selected havner i lista).
function scaffold(hostAttrs = '', numberInput = '<input />'): IxPhoneNumberField {
    return mount(`
        <ix-phone-number-field ${hostAttrs}>
          <span data-field="legend">Mobilnummer</span>
          <div data-field="items">
            <ix-combobox data-field="country" class="ix-combobox">
              <div class="ix-text-field">
                <input class="ix-text-field__input" aria-label="Landkode" />
                <button type="button" class="ix-combobox__toggle"></button>
              </div>
              <div class="ix-combobox__listbox" hidden></div>
            </ix-combobox>
            <div data-field="number"><div class="ix-text-field">${numberInput}</div></div>
          </div>
          <span data-field="error"></span>
        </ix-phone-number-field>
    `);
}

const optionLabels = (el: IxPhoneNumberField): (string | null)[] =>
    Array.from(el.querySelectorAll('.ix-combobox__option .ix-combobox__option-label')).map((n) => n.textContent);

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

    describe('landliste-injisering', () => {
        it('fyller tom combobox-liste med den innebygde landlista (Norge først, kallekode som label)', () => {
            const el = scaffold();
            const labels = optionLabels(el);
            expect(labels[0]).toBe('+47');
            const firstDesc = el.querySelector('.ix-combobox__option .ix-combobox__option-description');
            expect(firstDesc?.textContent).toBe('Norge');
            // Full kuratert liste (32 land).
            expect(labels.length).toBe(32);
        });

        it('injiserer IKKE når forfatteren allerede har lagt inn options (idempotens)', () => {
            const el = mount(`
                <ix-phone-number-field>
                  <span data-field="legend">Mobilnummer</span>
                  <div data-field="items">
                    <ix-combobox data-field="country" class="ix-combobox">
                      <div class="ix-text-field"><input /></div>
                      <div class="ix-combobox__listbox" hidden>
                        <div class="ix-combobox__option" data-value="47"><span class="ix-combobox__option-label">+47</span></div>
                      </div>
                    </ix-combobox>
                  </div>
                  <span data-field="error"></span>
                </ix-phone-number-field>
            `);
            // Kun forfatterens ene option — ingen innebygd liste lagt til.
            expect(optionLabels(el)).toEqual(['+47']);
            expect(el.querySelector('.ix-combobox__listbox')?.hasAttribute('data-ix-injected')).toBe(false);
        });

        it('lokaliserer landnavn med data-locale="en"', () => {
            const el = scaffold('data-locale="en"');
            const firstDesc = el.querySelector('.ix-combobox__option .ix-combobox__option-description');
            expect(firstDesc?.textContent).toBe('Norway');
        });

        it('overstyrer lista med gyldig data-countries (JSON)', () => {
            const countries = JSON.stringify([{ value: '47', label: '+47', description: 'Bare Norge' }]);
            const el = scaffold(`data-countries='${countries}'`);
            expect(optionLabels(el)).toEqual(['+47']);
            expect(el.querySelector('.ix-combobox__option-description')?.textContent).toBe('Bare Norge');
        });

        it('faller tilbake til innebygd liste + DEV-warn ved ugyldig data-countries', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const el = scaffold(`data-countries='{ikke json'`);
            expect(warn).toHaveBeenCalledWith(expect.stringContaining('data-countries'));
            expect(optionLabels(el)[0]).toBe('+47');
            expect(optionLabels(el).length).toBe(32);
            warn.mockRestore();
        });

        it('forhåndsvelger via data-default-country-code (aria-selected på matchende option)', () => {
            const el = scaffold('data-default-country-code="46"');
            const selected = el.querySelectorAll('.ix-combobox__option[aria-selected="true"]');
            expect(selected.length).toBe(1);
            expect(selected[0].querySelector('.ix-combobox__option-label')?.textContent).toBe('+46');
        });

        it('data-country-code (kontrollert) har forrang over data-default-country-code', () => {
            const el = scaffold('data-country-code="45" data-default-country-code="46"');
            const selected = el.querySelector('.ix-combobox__option[aria-selected="true"] .ix-combobox__option-label');
            expect(selected?.textContent).toBe('+45');
        });

        it('flytter forhåndsvalget når data-country-code endres etter mount (uten å bygge lista på nytt)', async () => {
            const el = scaffold('data-default-country-code="46"');
            const before = el.querySelectorAll('.ix-combobox__option').length;
            el.setAttribute('data-country-code', '45');
            await Promise.resolve();
            const selected = el.querySelectorAll('.ix-combobox__option[aria-selected="true"]');
            expect(selected.length).toBe(1);
            expect(selected[0].querySelector('.ix-combobox__option-label')?.textContent).toBe('+45');
            // Samme antall options — kun aria-selected flyttet.
            expect(el.querySelectorAll('.ix-combobox__option').length).toBe(before);
        });

        it('bygger lista på nytt (lokalisert) når data-locale endres etter mount', async () => {
            const el = scaffold('data-locale="nb"');
            expect(el.querySelector('.ix-combobox__option-description')?.textContent).toBe('Norge');
            el.setAttribute('data-locale', 'en');
            await Promise.resolve();
            expect(el.querySelector('.ix-combobox__option-description')?.textContent).toBe('Norway');
            expect(el.querySelectorAll('.ix-combobox__option').length).toBe(32);
        });

        it('fyller en combobox som legges til etter mount (ingen dobbel-injisering)', async () => {
            const el = mount(`
                <ix-phone-number-field>
                  <span data-field="legend">Mobilnummer</span>
                  <div data-field="items"></div>
                  <span data-field="error"></span>
                </ix-phone-number-field>
            `);
            const items = el.querySelector('[data-field="items"]')!;
            items.innerHTML = `
                <ix-combobox data-field="country" class="ix-combobox">
                  <div class="ix-text-field"><input /></div>
                  <div class="ix-combobox__listbox" hidden></div>
                </ix-combobox>`;
            await Promise.resolve();
            const labels = optionLabels(el);
            expect(labels[0]).toBe('+47');
            expect(labels.length).toBe(32);
        });
    });

    describe('nummer-defaults', () => {
        it('stamper type/inputmode/autocomplete/data-format på bar input', () => {
            const el = scaffold('', '<input />');
            const input = el.querySelector<HTMLInputElement>('[data-field="number"] input')!;
            expect(input.getAttribute('type')).toBe('tel');
            expect(input.getAttribute('inputmode')).toBe('numeric');
            expect(input.getAttribute('autocomplete')).toBe('tel-national');
            expect(input.getAttribute('data-format')).toBe('phone');
        });

        it('rører ikke attributter forfatteren har satt selv', () => {
            const el = scaffold('', '<input type="text" data-format="amount" />');
            const input = el.querySelector<HTMLInputElement>('[data-field="number"] input')!;
            expect(input.getAttribute('type')).toBe('text');
            expect(input.getAttribute('data-format')).toBe('amount');
            // De manglende fylles fortsatt.
            expect(input.getAttribute('inputmode')).toBe('numeric');
        });
    });

    describe('required-propagering', () => {
        it('propagerer required til combobox-ens indre input og nummer-input', () => {
            const el = scaffold('required');
            const comboboxInput = el.querySelector<HTMLInputElement>('ix-combobox input')!;
            const numberInput = el.querySelector<HTMLInputElement>('[data-field="number"] input')!;
            expect(comboboxInput.required).toBe(true);
            expect(numberInput.required).toBe(true);
        });

        it('gjenoppretter forfatterens egen required når group-required fjernes', () => {
            const el = scaffold('', '<input required />');
            const numberInput = el.querySelector<HTMLInputElement>('[data-field="number"] input')!;
            el.setAttribute('required', '');
            el.removeAttribute('required');
            // Forfatterens egen required (true) overlever group-toggelen.
            expect(numberInput.required).toBe(true);
        });
    });

    describe('data-state-utledning', () => {
        it('settes til "error" når feiltekst har innhold', async () => {
            const el = scaffold();
            const error = el.querySelector<HTMLElement>('[data-field="error"]')!;
            error.textContent = 'Feil';
            await Promise.resolve();
            expect(el.getAttribute('data-state')).toBe('error');
        });

        it('gjenspeiler readonly og disabled (feil vinner over begge)', () => {
            const el = scaffold('readonly');
            expect(el.getAttribute('data-state')).toBe('readonly');
            el.setAttribute('disabled', '');
            // readonly har forrang over disabled i utledningen.
            expect(el.getAttribute('data-state')).toBe('readonly');
        });
    });

    describe('opprydding', () => {
        it('kobler fra observere ved disconnect', () => {
            const el = mount(SIMPLE);
            expect(() => el.remove()).not.toThrow();
        });
    });
});
