import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { lastEvent } from '../test-events';
import { PhoneNumberField } from './PhoneNumberField';

// De indre custom-elementene (ix-field / ix-combobox / ix-phone-number-field)
// registreres i testSetup.ts (som importerer @sb1/indeks-web) og kjører derfor sin
// connectedCallback i jsdom — WC-ene er aktive i disse testene. React er et tynt lag:
// disse testene verifiserer at prop-ene videresendes riktig og at WC-en (som eier
// landlista, forhåndsvalg, nummer-defaults og required-propagering) gjør jobben sin
// gjennom React-markupen. Selve landdata-logikken dekkes av indeks-web sine tester.

function renderField(props: Partial<React.ComponentProps<typeof PhoneNumberField>> = {}) {
    return render(
        <PhoneNumberField
            label="Mobilnummer"
            countryLabel="Landkode"
            numberLabel="Telefonnummer"
            noHitsText="Ingen treff"
            {...props}
        />
    );
}

describe('PhoneNumberField', () => {
    it('rendrer felles legend med label-teksten', () => {
        renderField();
        const legend = document.querySelector('[data-field="legend"]');
        expect(legend?.textContent).toBe('Mobilnummer');
    });

    it('rendrer både landvelger og nummerfelt', () => {
        renderField();
        expect(document.querySelector('ix-combobox')).toBeTruthy();
        // Nummerfeltet er en type="tel"-input i sitt eget data-field="number".
        const number = document.querySelector('[data-field="number"] input');
        expect(number?.getAttribute('type')).toBe('tel');
    });

    it('setter type=tel, inputmode=numeric og autocomplete=tel-national på nummerfeltet', () => {
        renderField();
        const input = document.querySelector('[data-field="number"] input')!;
        expect(input.getAttribute('type')).toBe('tel');
        expect(input.getAttribute('inputmode')).toBe('numeric');
        expect(input.getAttribute('autocomplete')).toBe('tel-national');
    });

    it('slår på phone-formatering som default (data-format="phone")', () => {
        renderField();
        const input = document.querySelector('[data-field="number"] input')!;
        expect(input.getAttribute('data-format')).toBe('phone');
    });

    it('bruker aria-label på begge feltene (ingen egen synlig label)', () => {
        renderField();
        const combobox = document.querySelector('ix-combobox input');
        const number = document.querySelector('[data-field="number"] input');
        expect(combobox?.getAttribute('aria-label')).toBe('Landkode');
        expect(number?.getAttribute('aria-label')).toBe('Telefonnummer');
        // Ingen synlige <label> — gruppa navngir via legend/aria-label.
        expect(document.querySelectorAll('label').length).toBe(0);
    });

    it('rendrer nummer-feilmelding i nummer-feltets eget error-felt (ikke gruppe-nivå)', () => {
        renderField({ errorMessage: 'Skriv inn et gyldig telefonnummer' });
        const numberField = document.querySelector('[data-field="number"]')!;
        const error = numberField.querySelector('[data-field="error"]');
        expect(error?.textContent).toContain('Skriv inn et gyldig telefonnummer');
        // Nummer-inputen får aria-invalid fra sitt eget ix-field.
        const input = numberField.querySelector('input');
        expect(input?.getAttribute('aria-invalid')).toBe('true');
    });

    it('rendrer landkode-feilmelding i landvelgerens eget error-felt', () => {
        renderField({ countryErrorMessage: 'Velg landkode' });
        const country = document.querySelector('[data-field="country"]')!;
        const error = country.querySelector('[data-field="error"]');
        expect(error?.textContent).toContain('Velg landkode');
        expect(country.querySelector('input')?.getAttribute('aria-invalid')).toBe('true');
    });

    it('holder de to feilmeldingene uavhengige (kun landkode feiler)', () => {
        renderField({ countryErrorMessage: 'Velg landkode' });
        const numberError = document.querySelector('[data-field="number"] [data-field="error"]');
        // Nummer-feltet har ingen feil → ingen aria-invalid der.
        expect(numberError?.textContent).toBe('');
        expect(document.querySelector('[data-field="number"] input')?.getAttribute('aria-invalid')).toBeNull();
    });

    it('bruker innebygd landliste som default (Norge øverst, kallekode som label)', () => {
        renderField();
        const firstOption = document.querySelector('.ix-combobox__option .ix-combobox__option-label');
        // Kallekoden er primær (vist som valgt verdi); landnavnet ligger i description.
        expect(firstOption?.textContent).toBe('+47');
        const firstDesc = document.querySelector('.ix-combobox__option .ix-combobox__option-description');
        expect(firstDesc?.textContent).toBe('Norge');
    });

    it('lokaliserer default-listas landnavn (description) med locale="en"', () => {
        renderField({ locale: 'en' });
        const firstOption = document.querySelector('.ix-combobox__option .ix-combobox__option-label');
        expect(firstOption?.textContent).toBe('+47');
        const firstDesc = document.querySelector('.ix-combobox__option .ix-combobox__option-description');
        expect(firstDesc?.textContent).toBe('Norway');
    });

    it('lar konsumenten overstyre landlista med egne countries', () => {
        renderField({ countries: [{ value: '47', label: '+47', description: 'Bare Norge' }] });
        const labels = Array.from(document.querySelectorAll('.ix-combobox__option-label')).map((n) => n.textContent);
        expect(labels).toEqual(['+47']);
    });

    it('forhåndsvelger land via defaultCountryCode', () => {
        renderField({ defaultCountryCode: '46' });
        const selected = document.querySelector('.ix-combobox__option[aria-selected="true"] .ix-combobox__option-label');
        expect(selected?.textContent).toBe('+46');
    });

    it('seeder nummer-verdien via defaultValue på inputen', () => {
        renderField({ defaultValue: '12345678' });
        const input = document.querySelector<HTMLInputElement>('[data-field="number"] input')!;
        // I formatter-modus eier ix-field den synlige verdien; React seeder rå via defaultValue.
        expect(input.defaultValue).toBe('12345678');
    });

    it('propagerer navn fra numberField/countryField til de skjulte select/inputene', () => {
        renderField({ numberField: { name: 'tlf' }, countryField: { name: 'landkode' } });
        // I formatter-modus gir ix-field den synlige inputen `${name}_formatted` og
        // legger en skjult mirror med det opprinnelige navnet som bærer RÅ verdi
        // ved form-submit. Rå-verdien sendes altså under `tlf`.
        const visible = document.querySelector('[data-field="number"] input')!;
        expect(visible.getAttribute('name')).toBe('tlf_formatted');
        const rawMirror = document.querySelector('[data-field="number"] input[type="hidden"]');
        expect(rawMirror?.getAttribute('name')).toBe('tlf');
        expect(document.querySelector('ix-combobox select')?.getAttribute('name')).toBe('landkode');
    });

    it('propagerer required til BEGGE feltene (landvelger + nummerfelt)', () => {
        // required skal gjelde hele telefonnummeret — både at et land er valgt og
        // at nummeret er fylt ut. React setter required på host-en som config;
        // web-komponenten propagerer den videre til de to inputene (der den faktisk
        // teller — role="group" har ingen egen required-semantikk).
        renderField({ required: true });
        const comboboxInput = document.querySelector('ix-combobox input');
        const numberInput = document.querySelector('[data-field="number"] input');
        expect(comboboxInput?.hasAttribute('required')).toBe(true);
        expect(numberInput?.hasAttribute('required')).toBe(true);
        expect(document.querySelector('ix-phone-number-field')?.hasAttribute('required')).toBe(true);
    });

    it('videresender egendefinert nummerFormatPattern', () => {
        renderField({ numberFormat: undefined, numberFormatPattern: '000 000 000' });
        const input = document.querySelector('[data-field="number"] input')!;
        expect(input.getAttribute('data-format-pattern')).toBe('000 000 000');
    });

    it('videresender locale som data-locale til web-komponenten', () => {
        renderField({ locale: 'en' });
        expect(document.querySelector('ix-phone-number-field')?.getAttribute('data-locale')).toBe('en');
    });

    it('serialiserer egendefinert countries til data-countries', () => {
        const countries = [{ value: '47', label: '+47', description: 'Bare Norge' }];
        renderField({ countries });
        const raw = document.querySelector('ix-phone-number-field')?.getAttribute('data-countries');
        expect(raw).toBe(JSON.stringify(countries));
    });

    it('videresender defaultCountryCode som data-default-country-code', () => {
        renderField({ defaultCountryCode: '45' });
        expect(document.querySelector('ix-phone-number-field')?.getAttribute('data-default-country-code')).toBe('45');
    });

    describe('register()-binding (to uavhengige RHF-felt)', () => {
        // PhoneNumberField er to felt: `countryField={register('landkode')}` spres på
        // den indre Combobox, `numberField={register('tlf')}` på den indre TextField.
        // Begge indre komponenter er allerede register-kompatible, så testene her
        // verifiserer at spreadene når fram (navn, event-basert onChange, ref).

        it('ruter numberField.ref til nummer-feltets proxy (formatter-modus)', () => {
            const ref = createRef<HTMLInputElement>();
            renderField({ numberField: { name: 'tlf', ref } });
            // Formatter-modus videresender en proxy (ikke den native inputen), med value/name.
            expect(ref.current).not.toBeInstanceOf(HTMLInputElement);
            expect(ref.current?.name).toBe('tlf');
            expect(typeof ref.current?.value).toBe('string');
        });

        it('ruter countryField.ref til den indre ix-combobox', () => {
            const ref = createRef<HTMLElement>();
            renderField({ countryField: { name: 'landkode', ref: ref as never } });
            expect(ref.current?.tagName.toLowerCase()).toBe('ix-combobox');
        });

        it('numberField.onChange får RÅ nummer i target.value', () => {
            const onChange = vi.fn();
            renderField({ numberField: { name: 'tlf', onChange }, defaultValue: '' });
            const input = document.querySelector<HTMLInputElement>('[data-field="number"] input')!;
            input.value = '12345678';
            input.setSelectionRange(8, 8);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            expect(lastEvent(onChange).target).toMatchObject({ name: 'tlf', value: '12345678' });
        });

        it('countryField.onChange får landkode i target.value', () => {
            const onChange = vi.fn();
            renderField({ countryField: { name: 'landkode', onChange } });
            const no = document.querySelector<HTMLElement>('.ix-combobox__option[data-value="47"]')!;
            no.setAttribute('aria-selected', 'true');
            document.querySelector('ix-combobox')!.dispatchEvent(new CustomEvent('change', { bubbles: true }));
            expect(lastEvent(onChange).type).toBe('change');
            expect(lastEvent(onChange).target).toMatchObject({ name: 'landkode', value: '47' });
        });

        it('numberField.onBlur emitteres når fokus forlater nummer-feltet', () => {
            const onBlur = vi.fn();
            renderField({ numberField: { name: 'tlf', onBlur }, defaultValue: '12345678' });
            const input = document.querySelector<HTMLInputElement>('[data-field="number"] input')!;
            input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
            expect(onBlur).toHaveBeenCalledTimes(1);
            expect(lastEvent(onBlur).type).toBe('blur');
        });
    });
});
