import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Combobox, type ComboboxOption } from './Combobox';

const OPTIONS: ComboboxOption[] = [
    { value: 'no', label: 'Norge', description: '+47' },
    { value: 'se', label: 'Sverige' },
    { value: 'dk', label: 'Danmark', disabled: true },
];

function renderCombobox(props: Partial<React.ComponentProps<typeof Combobox>> = {}) {
    return render(<Combobox label="Land" options={OPTIONS} noHitsText="Ingen treff" {...props} />);
}

describe('Combobox', () => {
    it('rendrer label koblet til input via htmlFor/id', () => {
        renderCombobox({ id: 'land' });
        const input = screen.getByRole('combobox');
        const label = document.querySelector('label');
        expect(input.id).toBe('land');
        expect(label?.htmlFor).toBe('land');
    });

    it('genererer id automatisk når id ikke er satt', () => {
        renderCombobox();
        const input = screen.getByRole('combobox');
        expect(input.id).toBeTruthy();
        expect(document.querySelector('label')?.htmlFor).toBe(input.id);
    });

    it('rendrer alle options med data-value', () => {
        const { container } = renderCombobox();
        const opts = container.querySelectorAll('.ix-combobox__option');
        expect(opts).toHaveLength(3);
        expect(opts[0].getAttribute('data-value')).toBe('no');
    });

    it('rendrer beskrivelse (andrelinje) når satt', () => {
        const { container } = renderCombobox();
        const desc = container.querySelector('.ix-combobox__option-description');
        expect(desc?.textContent).toBe('+47');
    });

    it('markerer disabled option med aria-disabled', () => {
        const { container } = renderCombobox();
        const dk = container.querySelector('[data-value="dk"]');
        expect(dk?.getAttribute('aria-disabled')).toBe('true');
    });

    it('rendrer chips-wrapper kun i multi', () => {
        const { container, rerender } = renderCombobox();
        expect(container.querySelector('[data-field="chips"]')).toBeNull();
        rerender(<Combobox label="Land" options={OPTIONS} noHitsText="Ingen treff" multiple />);
        expect(container.querySelector('[data-field="chips"]')).not.toBeNull();
    });

    it('setter multiple-attributt på ix-combobox i multi', () => {
        const { container } = renderCombobox({ multiple: true });
        expect(container.querySelector('ix-combobox')?.hasAttribute('multiple')).toBe(true);
    });

    it('rendrer skjult select med name for form-innsending', () => {
        const { container } = renderCombobox({ name: 'land' });
        const select = container.querySelector('select[data-field="native"]');
        expect(select).not.toBeNull();
        expect(select?.getAttribute('name')).toBe('land');
    });

    it('sender noHitsText til data-no-hits-text og lar WC eie live-regionen', () => {
        const { container } = renderCombobox({ noHitsText: 'Fant ingenting' });
        const host = container.querySelector('ix-combobox');
        expect(host?.getAttribute('data-no-hits-text')).toBe('Fant ingenting');
        // no-hits er en role="status" live region: WC-en starter den tom (skjult
        // av CSS :empty) og fyller inn teksten fra data-no-hits-text ved 0 treff.
        const noHits = container.querySelector('.ix-combobox__no-hits');
        expect(noHits).not.toBeNull();
        expect(noHits?.getAttribute('role')).toBe('status');
        expect(noHits?.textContent).toBe('');
        expect(noHits?.hasAttribute('hidden')).toBe(false);
    });

    it('sender i18n-tekster videre til WC-attributter', () => {
        const { container } = renderCombobox({
            multiple: true,
            toggleLabel: 'Vis liste',
            removeChipLabel: 'fjern',
            arrowHintText: 'Bruk piltast',
        });
        const host = container.querySelector('ix-combobox');
        expect(host?.getAttribute('data-remove-chip-label')).toBe('fjern');
        expect(host?.getAttribute('data-arrow-hint-text')).toBe('Bruk piltast');
        expect(container.querySelector('.ix-combobox__toggle')?.getAttribute('aria-label')).toBe('Vis liste');
    });

    it('markerer defaultValue som aria-selected (ukontrollert, single)', () => {
        const { container } = renderCombobox({ defaultValue: 'se' });
        expect(container.querySelector('[data-value="se"]')?.getAttribute('aria-selected')).toBe('true');
        expect(container.querySelector('[data-value="no"]')?.getAttribute('aria-selected')).toBe('false');
    });

    it('markerer value som aria-selected (kontrollert, multi)', () => {
        const { container } = renderCombobox({ multiple: true, value: ['no', 'se'], onChange: () => {} });
        expect(container.querySelector('[data-value="no"]')?.getAttribute('aria-selected')).toBe('true');
        expect(container.querySelector('[data-value="se"]')?.getAttribute('aria-selected')).toBe('true');
        expect(container.querySelector('[data-value="dk"]')?.getAttribute('aria-selected')).toBe('false');
    });

    it('speiler kontrollert value inn ved endring', () => {
        const { container, rerender } = renderCombobox({ value: 'no', onChange: () => {} });
        expect(container.querySelector('[data-value="no"]')?.getAttribute('aria-selected')).toBe('true');
        rerender(<Combobox label="Land" options={OPTIONS} noHitsText="x" value="se" onChange={() => {}} />);
        expect(container.querySelector('[data-value="no"]')?.getAttribute('aria-selected')).toBe('false');
        expect(container.querySelector('[data-value="se"]')?.getAttribute('aria-selected')).toBe('true');
    });

    it('kaller onChange med valgt verdi når WC emitter change (single)', () => {
        const onChange = vi.fn();
        const { container } = renderCombobox({ onChange });
        const no = container.querySelector<HTMLElement>('[data-value="no"]')!;
        no.setAttribute('aria-selected', 'true');
        container.querySelector('ix-combobox')!.dispatchEvent(new CustomEvent('change', { bubbles: true }));
        expect(onChange).toHaveBeenCalledWith('no');
    });

    it('kaller onChange med array i multi', () => {
        const onChange = vi.fn();
        const { container } = renderCombobox({ multiple: true, onChange });
        container.querySelector('[data-value="no"]')!.setAttribute('aria-selected', 'true');
        container.querySelector('[data-value="se"]')!.setAttribute('aria-selected', 'true');
        container.querySelector('ix-combobox')!.dispatchEvent(new CustomEvent('change', { bubbles: true }));
        expect(onChange).toHaveBeenCalledWith(['no', 'se']);
    });

    it('rendrer error-span og aria-invalid ved feilmelding', () => {
        renderCombobox({ errorMessage: 'Påkrevd' });
        expect(document.querySelector('[data-field="error"]')?.textContent).toBe('Påkrevd');
        expect(screen.getByRole('combobox').getAttribute('aria-invalid')).toBe('true');
    });

    it('setter data-state på host ved feil', () => {
        const { container } = renderCombobox({ errorMessage: 'Påkrevd' });
        expect(container.querySelector('ix-combobox')?.getAttribute('data-state')).toBe('error');
    });

    it('setter disabled på host og input', () => {
        const { container } = renderCombobox({ disabled: true });
        expect(container.querySelector('ix-combobox')?.hasAttribute('disabled')).toBe(true);
    });

    it('rendrer ikke label-element når kun ariaLabel er satt', () => {
        renderCombobox({ label: undefined, ariaLabel: 'Velg land' });
        expect(document.querySelector('label')).toBeNull();
        expect(screen.getByRole('combobox').getAttribute('aria-label')).toBe('Velg land');
    });

    it('sender className videre til ix-field', () => {
        const { container } = renderCombobox({ className: 'custom' });
        expect(container.querySelector('ix-field')?.classList.contains('custom')).toBe(true);
    });

    it('videresender ref til ix-combobox-elementet', () => {
        const ref = createRef<HTMLElement>();
        renderCombobox({ ref: ref as never });
        expect(ref.current?.tagName.toLowerCase()).toBe('ix-combobox');
    });

    it('setter placeholder på input', () => {
        renderCombobox({ placeholder: 'Søk …' });
        expect(screen.getByRole('combobox').getAttribute('placeholder')).toBe('Søk …');
    });
});
