import { fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { lastEvent } from '../test-events';
import { PhoneNumberField, type PhoneNumberFieldProps } from './PhoneNumberField';

// Web componentene registreres i testSetup.ts, så de kjører i jsdom. Testene her
// sjekker at React-markupen og prop-ene når fram; selve gruppelogikken dekkes av
// indeks-web.

function renderField(props: Partial<PhoneNumberFieldProps> = {}) {
    return render(
        <PhoneNumberField
            label="Mobilnummer"
            countryLabel="Landkode"
            numberLabel="Telefonnummer"
            {...(props as object)}
        />
    );
}

const country = () => document.querySelector<HTMLInputElement>('[data-field="country"] input');
const number = () => document.querySelector<HTMLInputElement>('[data-field="number"] input')!;

describe('PhoneNumberField', () => {
    it('rendrer legend, landkode med «+» og nummerfelt', () => {
        renderField();
        expect(document.querySelector('[data-field="legend"]')?.textContent).toBe('Mobilnummer');
        expect(document.querySelector('[data-field="country"] [data-field="prefix"]')?.textContent).toBe('+');
        expect(country()?.getAttribute('aria-label')).toBe('Landkode');
        expect(number().getAttribute('aria-label')).toBe('Telefonnummer');
    });

    it('landkoden er 47 som standard, og kan settes', () => {
        renderField();
        expect(country()?.value).toBe('47');
    });

    it('defaultCountryCode setter startverdien', () => {
        renderField({ defaultCountryCode: '46' });
        expect(country()?.value).toBe('46');
    });

    it('countryCodeReadOnly låser landkoden, men ikke nummeret', () => {
        renderField({ countryCodeReadOnly: true });
        expect(country()?.readOnly).toBe(true);
        expect(number().readOnly).toBe(false);
    });

    it('hideCountryCode viser bare nummerfeltet', () => {
        render(<PhoneNumberField label="Mobilnummer" numberLabel="Telefonnummer" hideCountryCode />);
        expect(country()).toBeNull();
        expect(number().getAttribute('autocomplete')).toBe('tel-national');
    });

    it('stamper standardattributtene på begge feltene', () => {
        renderField();
        expect(country()?.getAttribute('inputmode')).toBe('numeric');
        expect(country()?.getAttribute('autocomplete')).toBe('tel-country-code');
        expect(number().getAttribute('type')).toBe('tel');
        expect(number().getAttribute('autocomplete')).toBe('tel-national');
        expect(number().getAttribute('data-format')).toBe('phone');
    });

    it('viser én feilmelding for gruppen', () => {
        renderField({ errorMessage: 'Skriv inn landkode' });
        const host = document.querySelector('ix-phone-number-field')!;
        const errors = Array.from(document.querySelectorAll('[data-field="error"]')).filter((e) => e.textContent);
        expect(errors).toHaveLength(1);
        expect(errors[0].parentElement).toBe(host);
        expect(host.getAttribute('aria-invalid')).toBe('true');
        expect(host.getAttribute('data-state')).toBe('error');
    });

    it('propagerer required og disabled til begge feltene', () => {
        renderField({ required: true, disabled: true });
        expect(country()?.required).toBe(true);
        expect(number().required).toBe(true);
        expect(country()?.disabled).toBe(true);
        expect(number().disabled).toBe(true);
    });

    it('videresender numberFormatPattern', () => {
        renderField({ numberFormat: undefined, numberFormatPattern: '000 000 000' });
        expect(number().getAttribute('data-format-pattern')).toBe('000 000 000');
    });

    describe('register()-binding (to uavhengige RHF-felt)', () => {
        it('countryField får ref til inputen og name', () => {
            const ref = createRef<HTMLInputElement>();
            renderField({ countryField: { name: 'landkode', ref } });
            expect(ref.current).toBe(country());
            expect(country()?.name).toBe('landkode');
        });

        it('countryField.onChange får bare sifrene, uten «+»', () => {
            const onChange = vi.fn();
            renderField({ countryField: { name: 'landkode', onChange } });
            fireEvent.input(country()!, { target: { value: '+358' } });
            expect(lastEvent(onChange).target).toMatchObject({ name: 'landkode', value: '358' });
        });

        it('numberField får proxy-ref og RÅ nummer i onChange', () => {
            const ref = createRef<HTMLInputElement>();
            const onChange = vi.fn();
            renderField({ numberField: { name: 'tlf', ref, onChange } });
            expect(ref.current?.name).toBe('tlf');
            const input = number();
            input.value = '12345678';
            input.setSelectionRange(8, 8);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            expect(lastEvent(onChange).target).toMatchObject({ name: 'tlf', value: '12345678' });
        });

        it('numberField.onBlur emitteres når fokus forlater nummerfeltet', () => {
            const onBlur = vi.fn();
            renderField({ numberField: { name: 'tlf', onBlur }, defaultValue: '12345678' });
            number().dispatchEvent(new FocusEvent('blur', { bubbles: true }));
            expect(onBlur).toHaveBeenCalledTimes(1);
        });
    });
});
