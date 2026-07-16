import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PhoneNumberField } from './PhoneNumberField';
import { getDefaultCountries } from './countries';

// De indre custom-elementene (ix-field / ix-combobox / ix-phone-number-field)
// registreres i testSetup.ts (som importerer @sb1/indeks-web) og kjører derfor sin
// connectedCallback i jsdom — WC-ene er aktive i disse testene. Vi verifiserer likevel
// primært den rendrede markupen og prop-gjennomføringen her; den fulle WC-oppførselen
// dekkes av IxPhoneNumberField.test.ts.

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

    it('rendrer felles feilmelding i gruppens error-felt', () => {
        renderField({ errorMessage: 'Skriv inn et gyldig telefonnummer' });
        const group = document.querySelector('ix-phone-number-field')!;
        const error = group.querySelector(':scope > [data-field="error"]');
        expect(error?.textContent).toContain('Skriv inn et gyldig telefonnummer');
    });

    it('setter data-state="error" når errorMessage er satt', () => {
        renderField({ errorMessage: 'Feil' });
        expect(document.querySelector('ix-phone-number-field')?.getAttribute('data-state')).toBe('error');
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

    it('propagerer name og countryName til de skjulte select/inputene', () => {
        renderField({ name: 'tlf', countryName: 'landkode' });
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
        // at nummeret er fylt ut. Host-elementet får IKKE et required-attributt
        // (role="group" leser det ikke); det er de to inputene som bærer det.
        renderField({ required: true });
        const comboboxInput = document.querySelector('ix-combobox input');
        const numberInput = document.querySelector('[data-field="number"] input');
        expect(comboboxInput?.hasAttribute('required')).toBe(true);
        expect(numberInput?.hasAttribute('required')).toBe(true);
        expect(document.querySelector('ix-phone-number-field')?.hasAttribute('required')).toBe(false);
    });

    it('videresender egendefinert nummerFormatPattern', () => {
        renderField({ numberFormat: undefined, numberFormatPattern: '000 000 000' });
        const input = document.querySelector('[data-field="number"] input')!;
        expect(input.getAttribute('data-format-pattern')).toBe('000 000 000');
    });
});

describe('getDefaultCountries', () => {
    it('legger Norge først, deretter Norden (sortert på landnavn)', () => {
        const list = getDefaultCountries('nb');
        // label = kallekode, description = landnavn. Sortering skjer på landnavn:
        // Danmark, Finland, Island, Sverige → kallekodene i den rekkefølgen.
        expect(list[0].label).toBe('+47');
        expect(list.slice(1, 5).map((c) => c.label)).toEqual(['+45', '+358', '+354', '+46']);
        expect(list.slice(1, 5).map((c) => c.description)).toEqual(['Danmark', 'Finland', 'Island', 'Sverige']);
    });

    it('bruker kallekoden som label og landnavnet som description', () => {
        const list = getDefaultCountries('nb');
        expect(list[0]).toMatchObject({ value: '47', label: '+47', description: 'Norge' });
    });

    it('oversetter landnavn (description) per locale', () => {
        expect(getDefaultCountries('nn')[0].description).toBe('Noreg');
        expect(getDefaultCountries('en')[0].description).toBe('Norway');
    });

    it('har unike value (kallekode) — ingen kollisjon som gjør et land uvalgbart', () => {
        // value = data-value i comboboxen; duplikat gjør ett land uvalgbart og
        // gir React duplikat-key. E.164 deler koder (+1 NANP), så lista må kuratere.
        const values = getDefaultCountries('nb').map((c) => c.value);
        expect(new Set(values).size).toBe(values.length);
    });
});
