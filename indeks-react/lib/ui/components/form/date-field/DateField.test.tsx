import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { lastEvent } from '../test-events';
import { DateField } from './DateField';

function renderDateField(props: Partial<React.ComponentProps<typeof DateField>> = {}) {
    return render(<DateField label="Fødselsdato" openLabel="Åpne kalender" {...props} />);
}

describe('DateField', () => {
    it('rendrer label koblet til input via htmlFor/id', () => {
        renderDateField({ id: 'fodt' });
        const input = document.querySelector<HTMLInputElement>('.ix-text-field input')!;
        expect(input.id).toBe('fodt');
        expect(document.querySelector('label')?.htmlFor).toBe('fodt');
    });

    it('genererer id automatisk når id ikke er satt', () => {
        renderDateField();
        const input = document.querySelector<HTMLInputElement>('.ix-text-field input')!;
        expect(input.id).toBeTruthy();
        expect(document.querySelector('label')?.htmlFor).toBe(input.id);
    });

    it('rendrer synlig input med data-format="date" og inputmode numeric', () => {
        renderDateField();
        const input = document.querySelector<HTMLInputElement>('.ix-text-field input')!;
        expect(input.getAttribute('data-format')).toBe('date');
        expect(input.getAttribute('inputmode')).toBe('numeric');
    });

    it('sender name videre til host (WC flytter det til native ISO-input)', () => {
        const { container } = renderDateField({ name: 'fodt' });
        expect(container.querySelector('ix-date-field')?.getAttribute('name')).toBe('fodt');
    });

    it('speiler min/max til host', () => {
        const { container } = renderDateField({ min: '2020-01-01', max: '2030-12-31' });
        const host = container.querySelector('ix-date-field');
        expect(host?.getAttribute('min')).toBe('2020-01-01');
        expect(host?.getAttribute('max')).toBe('2030-12-31');
    });

    it('setter data-open-label på host (i18n)', () => {
        const { container } = renderDateField({ openLabel: 'Open calendar' });
        expect(container.querySelector('ix-date-field')?.getAttribute('data-open-label')).toBe('Open calendar');
    });

    it('setter value-attributt (ISO) på host i kontrollert modus', () => {
        const { container } = renderDateField({ value: '2000-12-24', onChange: () => {} });
        expect(container.querySelector('ix-date-field')?.getAttribute('value')).toBe('2000-12-24');
    });

    it('setter value-attributt (ISO) fra defaultValue i ukontrollert modus', () => {
        const { container } = renderDateField({ defaultValue: '1990-05-17' });
        expect(container.querySelector('ix-date-field')?.getAttribute('value')).toBe('1990-05-17');
    });

    it('kaller onChange med syntetisk event (ISO i target.value) når brukeren skriver dd.mm.åååå', () => {
        // Integrasjon: WC-runtime (ix-date-field) er registrert i testmiljøet, så
        // dette driver den ekte to-veis synken — skriving i den synlige inputen
        // skal gi ISO på den native inputen og et event-basert onChange med ISO i
        // target.value (delt form med de andre felt-komponentene → {...register()}).
        const onChange = vi.fn();
        const { container } = renderDateField({ name: 'fodt', onChange });
        const host = container.querySelector('ix-date-field')!;
        const visible = host.querySelector<HTMLInputElement>('.ix-text-field input:not(.ix-date-field__native)')!;
        visible.value = '17.05.1990';
        visible.dispatchEvent(new Event('input', { bubbles: true }));
        expect(lastEvent(onChange).type).toBe('change');
        expect(lastEvent(onChange).target).toMatchObject({ name: 'fodt', value: '1990-05-17' });
    });

    it('genererer kalenderknapp og native ISO-input via WC', () => {
        const { container } = renderDateField();
        const host = container.querySelector('ix-date-field')!;
        expect(host.querySelector('button.ix-date-field__toggle')).not.toBeNull();
        expect(host.querySelector('input.ix-date-field__native')).not.toBeNull();
    });

    it('rendrer error-span og aria-invalid ved feilmelding', () => {
        renderDateField({ errorMessage: 'Påkrevd' });
        expect(document.querySelector('[data-field="error"]')?.textContent).toBe('Påkrevd');
        expect(document.querySelector<HTMLInputElement>('.ix-text-field input')?.getAttribute('aria-invalid')).toBe('true');
    });

    it('setter data-state på host ved feil', () => {
        const { container } = renderDateField({ errorMessage: 'Påkrevd' });
        expect(container.querySelector('ix-date-field')?.getAttribute('data-state')).toBe('error');
    });

    it('setter disabled på host og input', () => {
        const { container } = renderDateField({ disabled: true });
        expect(container.querySelector('ix-date-field')?.hasAttribute('disabled')).toBe(true);
        expect(document.querySelector<HTMLInputElement>('.ix-text-field input')?.disabled).toBe(true);
    });

    it('rendrer ikke label-element når kun ariaLabel er satt', () => {
        renderDateField({ label: undefined, ariaLabel: 'Fødselsdato' });
        expect(document.querySelector('label')).toBeNull();
        expect(document.querySelector<HTMLInputElement>('.ix-text-field input')?.getAttribute('aria-label')).toBe('Fødselsdato');
    });

    it('sender className videre til ix-field', () => {
        const { container } = renderDateField({ className: 'custom' });
        expect(container.querySelector('ix-field')?.classList.contains('custom')).toBe(true);
    });

    it('setter placeholder på input', () => {
        renderDateField({ placeholder: 'dd.mm.åååå' });
        expect(document.querySelector<HTMLInputElement>('.ix-text-field input')?.getAttribute('placeholder')).toBe('dd.mm.åååå');
    });

    describe('register()-modus (proxy-ref)', () => {
        // Som TextField formatter-modus videresendes en proxy til `ref` (ikke host
        // eller den native inputen): `get value` gir ISO fra den native inputen,
        // `set value` skriver value-attributtet på host (WC seeder synlig + native),
        // `focus()` delegerer til den synlige inputen. Slik binder {...register('felt')}.

        it('ref er en proxy (ikke host-elementet) med value/focus/name', () => {
            const ref = createRef<HTMLInputElement>();
            renderDateField({ name: 'fodt', ref });
            expect(ref.current).not.toBeInstanceOf(HTMLElement);
            expect((ref.current as unknown as HTMLElement)?.tagName).toBeUndefined();
            expect(typeof ref.current?.focus).toBe('function');
            expect(ref.current?.name).toBe('fodt');
            expect(typeof ref.current?.value).toBe('string');
        });

        it('proxy.value gir ISO etter at brukeren har skrevet en dato', () => {
            const ref = createRef<HTMLInputElement>();
            const { container } = renderDateField({ name: 'fodt', ref });
            const host = container.querySelector('ix-date-field')!;
            const visible = host.querySelector<HTMLInputElement>('.ix-text-field input:not(.ix-date-field__native)')!;
            visible.value = '17.05.1990';
            visible.dispatchEvent(new Event('input', { bubbles: true }));
            expect(ref.current?.value).toBe('1990-05-17');
        });

        it('proxy.value = ISO seeder synlig + native input (som RHF reset/setValue)', () => {
            const ref = createRef<HTMLInputElement>();
            const { container } = renderDateField({ name: 'fodt', ref });
            (ref.current as unknown as { value: string }).value = '1990-05-17';
            const host = container.querySelector('ix-date-field')!;
            const native = host.querySelector<HTMLInputElement>('input.ix-date-field__native')!;
            expect(native.value).toBe('1990-05-17');
            expect(ref.current?.value).toBe('1990-05-17');
        });

        it('proxy.value = null gir tom streng uten å kaste', () => {
            const ref = createRef<HTMLInputElement>();
            renderDateField({ name: 'fodt', defaultValue: '1990-05-17', ref });
            expect(() => {
                (ref.current as unknown as { value: string | null }).value = null;
            }).not.toThrow();
            expect(ref.current?.value).toBe('');
        });

        it('proxy.focus() delegerer til den synlige inputen', () => {
            const ref = createRef<HTMLInputElement>();
            const { container } = renderDateField({ name: 'fodt', ref });
            const visible = container.querySelector<HTMLInputElement>('.ix-text-field input:not(.ix-date-field__native)')!;
            ref.current?.focus();
            expect(document.activeElement).toBe(visible);
        });

        it('emitterer syntetisk blur når fokus forlater feltet', () => {
            const onBlur = vi.fn();
            const { container } = renderDateField({ name: 'fodt', onBlur });
            const host = container.querySelector('ix-date-field')!;
            const outside = document.createElement('button');
            document.body.appendChild(outside);
            host.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: outside }));
            expect(onBlur).toHaveBeenCalledTimes(1);
            expect(lastEvent(onBlur).type).toBe('blur');
            outside.remove();
        });

        it('emitterer IKKE blur ved intern fokusflytting innad i feltet', () => {
            const onBlur = vi.fn();
            const { container } = renderDateField({ name: 'fodt', onBlur });
            const host = container.querySelector('ix-date-field')!;
            const toggle = host.querySelector('button.ix-date-field__toggle')!;
            host.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: toggle }));
            expect(onBlur).not.toHaveBeenCalled();
        });
    });
});
