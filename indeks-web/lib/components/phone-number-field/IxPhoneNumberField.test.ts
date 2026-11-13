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

// ix-field er ikke registrert her, så de indre feltene er inerte.
function scaffold(hostAttrs = '', countryInput = '<input aria-label="Landkode" value="47" />', numberInput = '<input aria-label="Telefonnummer" />'): IxPhoneNumberField {
    return mount(`
        <ix-phone-number-field ${hostAttrs}>
          <span data-field="legend">Mobilnummer</span>
          <span data-field="description">Vi bruker det kun til varsling</span>
          <div data-field="items">
            <ix-field data-field="country"><div class="ix-text-field"><div data-field="prefix">+</div>${countryInput}</div></ix-field>
            <ix-field data-field="number"><div class="ix-text-field">${numberInput}</div></ix-field>
          </div>
          <span data-field="error"></span>
        </ix-phone-number-field>
    `);
}

function withoutCountry(hostAttrs = ''): IxPhoneNumberField {
    return mount(`
        <ix-phone-number-field ${hostAttrs}>
          <span data-field="legend">Mobilnummer</span>
          <div data-field="items">
            <ix-field data-field="number"><div class="ix-text-field"><input aria-label="Telefonnummer" /></div></ix-field>
          </div>
          <span data-field="error"></span>
        </ix-phone-number-field>
    `);
}

const country = (el: IxPhoneNumberField) => el.querySelector<HTMLInputElement>('[data-field="country"] input')!;
const number = (el: IxPhoneNumberField) => el.querySelector<HTMLInputElement>('[data-field="number"] input')!;
const error = (el: IxPhoneNumberField) => el.querySelector<HTMLElement>(':scope > [data-field="error"]')!;

function type(input: HTMLInputElement, value: string): void {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('IxPhoneNumberField', () => {
    describe('rolle og navn', () => {
        it('setter role="group" og kobler aria-labelledby til legend', () => {
            const el = scaffold();
            const legend = el.querySelector('[data-field="legend"]')!;
            expect(el.getAttribute('role')).toBe('group');
            expect(legend.id).toMatch(/^ix-phone-number-field-legend-\d+$/);
            expect(el.getAttribute('aria-labelledby')).toBe(legend.id);
        });

        it('respekterer eksisterende legend-id', () => {
            const el = mount(`
                <ix-phone-number-field>
                  <span data-field="legend" id="egen-id">Mobilnummer</span>
                </ix-phone-number-field>
            `);
            expect(el.getAttribute('aria-labelledby')).toBe('egen-id');
        });

        it('advarer i DEV når legend mangler', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            mount('<ix-phone-number-field></ix-phone-number-field>');
            expect(warn).toHaveBeenCalledWith(expect.stringContaining('[ix-phone-number-field]'));
            warn.mockRestore();
        });
    });

    describe('aria-describedby', () => {
        it('peker til description og error i rekkefølge', () => {
            const el = scaffold();
            const desc = el.querySelector('[data-field="description"]')!;
            expect(el.getAttribute('aria-describedby')).toBe(`${desc.id} ${error(el).id}`);
        });

        it('kobler på description som legges til etter mount', async () => {
            const el = withoutCountry();
            expect(el.getAttribute('aria-describedby')).toBe(error(el).id);

            const desc = document.createElement('span');
            desc.setAttribute('data-field', 'description');
            desc.textContent = 'Norsk format: 123 45 678';
            el.insertBefore(desc, el.querySelector('[data-field="items"]'));
            await Promise.resolve();

            expect(el.getAttribute('aria-describedby')).toBe(`${desc.id} ${error(el).id}`);
        });

        it('fjerner description fra describedby når den forsvinner', async () => {
            const el = scaffold();
            el.querySelector('[data-field="description"]')!.remove();
            await Promise.resolve();
            expect(el.getAttribute('aria-describedby')).toBe(error(el).id);
        });
    });

    describe('én feilmelding for gruppen', () => {
        it('aria-invalid og data-state="error" følger feilteksten', async () => {
            const el = scaffold();
            expect(el.hasAttribute('aria-invalid')).toBe(false);

            error(el).textContent = 'Skriv inn landkode';
            await Promise.resolve();
            expect(el.getAttribute('aria-invalid')).toBe('true');
            expect(el.getAttribute('data-state')).toBe('error');

            error(el).textContent = '';
            await Promise.resolve();
            expect(el.hasAttribute('aria-invalid')).toBe(false);
            expect(el.hasAttribute('data-state')).toBe(false);
        });

        it('en suksessmelding er ingen feil', async () => {
            const el = scaffold();
            error(el).dataset.status = 'success';
            error(el).textContent = 'Telefonnummeret er gyldig';
            await Promise.resolve();
            expect(el.hasAttribute('aria-invalid')).toBe(false);
            expect(el.getAttribute('data-state')).not.toBe('error');
        });

        it('setter aria-live="polite" på feilmeldingen', () => {
            expect(error(scaffold()).getAttribute('aria-live')).toBe('polite');
        });
    });

    describe('landkode', () => {
        it('stamper inputmode og autocomplete, ikke maxlength', () => {
            const el = scaffold();
            expect(country(el).getAttribute('inputmode')).toBe('numeric');
            expect(country(el).getAttribute('autocomplete')).toBe('tel-country-code');
            expect(country(el).hasAttribute('maxlength')).toBe(false);
        });

        it('tar bare sifre, maks tre', () => {
            const el = scaffold();
            type(country(el), '4a6');
            expect(country(el).value).toBe('46');
            type(country(el), '35899');
            expect(country(el).value).toBe('358');
        });

        it('fjerner plusstegnet fra autofyll', () => {
            const el = scaffold();
            type(country(el), '+358');
            expect(country(el).value).toBe('358');
        });

        it('rører ikke nummerfeltet', () => {
            const el = scaffold();
            type(number(el), '+47 123');
            expect(number(el).value).toBe('+47 123');
        });

        it('virker for en input som rendres inn etter mount', async () => {
            const el = scaffold();
            const fresh = document.createElement('input');
            country(el).replaceWith(fresh);
            await Promise.resolve();
            expect(fresh.getAttribute('autocomplete')).toBe('tel-country-code');
            type(fresh, '+1');
            expect(fresh.value).toBe('1');
        });

        it('en låst landkode forblir låst når readonly på gruppen slås av', () => {
            const el = scaffold('', '<input aria-label="Landkode" value="47" readonly />');
            el.setAttribute('readonly', '');
            expect(number(el).readOnly).toBe(true);
            el.removeAttribute('readonly');
            expect(country(el).readOnly).toBe(true);
            expect(number(el).readOnly).toBe(false);
        });

        it('gruppen virker uten landkodefelt', () => {
            const el = withoutCountry('required disabled');
            expect(number(el).required).toBe(true);
            expect(number(el).disabled).toBe(true);
            expect(number(el).getAttribute('autocomplete')).toBe('tel-national');
        });
    });

    describe('nummer-defaults', () => {
        it('stamper type, inputmode, autocomplete og data-format', () => {
            const el = scaffold();
            expect(number(el).getAttribute('type')).toBe('tel');
            expect(number(el).getAttribute('inputmode')).toBe('numeric');
            expect(number(el).getAttribute('autocomplete')).toBe('tel-national');
            expect(number(el).getAttribute('data-format')).toBe('phone');
        });

        it('rører ikke attributter forfatteren har satt selv', () => {
            const el = scaffold('', undefined, '<input type="text" data-format="amount" />');
            expect(number(el).getAttribute('type')).toBe('text');
            expect(number(el).getAttribute('data-format')).toBe('amount');
            expect(number(el).getAttribute('inputmode')).toBe('numeric');
        });

        it('hopper over den skjulte mirror-inputen fra formatteren', () => {
            const el = scaffold('', undefined, '<input type="hidden" /><input aria-label="Telefonnummer" />');
            const visible = el.querySelector<HTMLInputElement>('[data-field="number"] input[aria-label]')!;
            expect(visible.getAttribute('autocomplete')).toBe('tel-national');
            expect(number(el).hasAttribute('autocomplete')).toBe(false);
        });
    });

    describe('disabled, readonly og required', () => {
        it('propagerer til begge inputene og setter dem tilbake', () => {
            const el = scaffold();
            for (const [attr, prop] of [['disabled', 'disabled'], ['readonly', 'readOnly'], ['required', 'required']] as const) {
                el.setAttribute(attr, '');
                expect(country(el)[prop]).toBe(true);
                expect(number(el)[prop]).toBe(true);
                el.removeAttribute(attr);
                expect(country(el)[prop]).toBe(false);
                expect(number(el)[prop]).toBe(false);
            }
        });

        it('bevarer inputens egen verdi', () => {
            const el = scaffold('', undefined, '<input disabled required />');
            el.setAttribute('disabled', '');
            el.setAttribute('required', '');
            el.removeAttribute('disabled');
            el.removeAttribute('required');
            expect(number(el).disabled).toBe(true);
            expect(number(el).required).toBe(true);
        });

        it('data-state: readonly vinner over disabled', () => {
            const el = scaffold('readonly');
            expect(el.getAttribute('data-state')).toBe('readonly');
            el.setAttribute('disabled', '');
            expect(el.getAttribute('data-state')).toBe('readonly');
        });
    });

    describe('opprydding', () => {
        it('fjerner input-lytteren ved disconnect', () => {
            const el = scaffold();
            const input = country(el);
            el.remove();
            type(input, '+47');
            expect(input.value).toBe('+47');
        });
    });
});
