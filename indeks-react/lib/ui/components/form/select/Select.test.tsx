import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const basicOptions = [
    { value: 'no', label: 'Norge' },
    { value: 'se', label: 'Sverige' },
    { value: 'dk', label: 'Danmark' },
];

const groupedOptions = [
    {
        label: 'Norden',
        options: [
            { value: 'no', label: 'Norge' },
            { value: 'se', label: 'Sverige' },
        ],
    },
    {
        label: 'Europa',
        options: [
            { value: 'de', label: 'Tyskland' },
            { value: 'fr', label: 'Frankrike' },
        ],
    },
];

describe('Select', () => {
    it('rendrer label koblet til select via htmlFor/id', () => {
        render(<Select label="Land" id="land" options={basicOptions} />);
        const select = screen.getByRole('combobox');
        const label = document.querySelector('label');
        expect(select.id).toBe('land');
        expect(label?.htmlFor).toBe('land');
    });

    it('genererer id automatisk når id ikke er satt', () => {
        render(<Select label="Land" options={basicOptions} />);
        const select = screen.getByRole('combobox');
        expect(select.id).toBeTruthy();
        const label = document.querySelector('label');
        expect(label?.htmlFor).toBe(select.id);
    });

    it('rendrer description-span med data-field attributt', () => {
        render(<Select label="Land" description="Velg landet du bor i" options={basicOptions} />);
        const desc = document.querySelector('[data-field="description"]');
        expect(desc).toBeDefined();
        expect(desc?.textContent).toBe('Velg landet du bor i');
    });

    it('rendrer error-span med data-field attributt', () => {
        render(<Select label="Land" errorMessage="Påkrevd felt" options={basicOptions} />);
        const error = document.querySelector('[data-field="error"]');
        expect(error).toBeDefined();
        expect(error?.textContent).toBe('Påkrevd felt');
    });

    it('rendrer error-span alltid i DOM (tomt uten feilmelding)', () => {
        render(<Select label="Land" options={basicOptions} />);
        const error = document.querySelector('[data-field="error"]');
        expect(error).toBeDefined();
        expect(error?.textContent).toBe('');
    });

    it('rendrer ix-field som wrapper-element', () => {
        const { container } = render(<Select label="Land" options={basicOptions} />);
        const ixField = container.querySelector('ix-field');
        expect(ixField).toBeDefined();
    });

    it('rendrer select med ix-select klasse', () => {
        const { container } = render(<Select label="Land" options={basicOptions} />);
        const select = container.querySelector('.ix-select');
        expect(select).toBeDefined();
        expect(select?.tagName).toBe('SELECT');
    });

    it('rendrer alle options', () => {
        render(<Select label="Land" options={basicOptions} />);
        expect(screen.getByRole('option', { name: 'Norge' })).toBeDefined();
        expect(screen.getByRole('option', { name: 'Sverige' })).toBeDefined();
        expect(screen.getByRole('option', { name: 'Danmark' })).toBeDefined();
    });

    it('rendrer placeholder som disabled option', () => {
        render(<Select label="Land" placeholder="Velg land..." options={basicOptions} />);
        const placeholder = screen.getByRole('option', { name: 'Velg land...' }) as HTMLOptionElement;
        expect(placeholder).toBeDefined();
        expect(placeholder.disabled).toBe(true);
        expect(placeholder.value).toBe('');
    });

    it('rendrer optgroup med grouped options', () => {
        const { container } = render(<Select label="Land" options={groupedOptions} />);
        const optgroups = container.querySelectorAll('optgroup');
        expect(optgroups.length).toBe(2);
        expect(optgroups[0].label).toBe('Norden');
        expect(optgroups[1].label).toBe('Europa');
    });

    it('rendrer options innenfor optgroup', () => {
        const { container } = render(<Select label="Land" options={groupedOptions} />);
        const nordenGroup = container.querySelector('optgroup[label="Norden"]');
        const options = nordenGroup?.querySelectorAll('option');
        expect(options?.length).toBe(2);
        expect(options?.[0].textContent).toBe('Norge');
        expect(options?.[1].textContent).toBe('Sverige');
    });

    it('setter disabled-attributt på select', () => {
        render(<Select label="Land" disabled options={basicOptions} />);
        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.disabled).toBe(true);
    });

    it('setter aria-invalid når errorMessage er satt', () => {
        render(<Select label="Land" errorMessage="Påkrevd felt" options={basicOptions} />);
        const select = screen.getByRole('combobox');
        expect(select.getAttribute('aria-invalid')).toBe('true');
    });

    it('setter ikke aria-invalid når errorMessage ikke er satt', () => {
        render(<Select label="Land" options={basicOptions} />);
        const select = screen.getByRole('combobox');
        expect(select.hasAttribute('aria-invalid')).toBe(false);
    });

    it('setter aria-label når ariaLabel er satt', () => {
        render(<Select ariaLabel="Velg land" options={basicOptions} />);
        const select = screen.getByRole('combobox');
        expect(select.getAttribute('aria-label')).toBe('Velg land');
    });

    it('rendrer ikke label-element når kun ariaLabel er satt', () => {
        render(<Select ariaLabel="Velg land" options={basicOptions} />);
        const label = document.querySelector('label');
        expect(label).toBeNull();
    });

    it('spreader ukjente HTML-attributter videre til select', () => {
        render(<Select label="Land" data-testid="mitt-felt" options={basicOptions} />);
        const select = screen.getByRole('combobox');
        expect(select.getAttribute('data-testid')).toBe('mitt-felt');
    });

    it('sender className videre til ix-field', () => {
        const { container } = render(<Select label="Land" className="custom-class" options={basicOptions} />);
        const ixField = container.querySelector('ix-field');
        expect(ixField?.classList.contains('custom-class')).toBe(true);
    });

    it('sender ref videre til select-elementet', () => {
        const ref = createRef<HTMLSelectElement>();
        render(<Select label="Land" ref={ref} options={basicOptions} />);
        expect(ref.current).toBeInstanceOf(HTMLSelectElement);
        expect(ref.current?.tagName).toBe('SELECT');
    });

    it('setter required-attributt på select', () => {
        render(<Select label="Land" required options={basicOptions} />);
        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.required).toBe(true);
    });

    it('videresender name til select (nativ form-støtte)', () => {
        render(<Select label="Land" name="country" options={basicOptions} />);
        const select = screen.getByRole('combobox');
        expect(select.getAttribute('name')).toBe('country');
    });

    it('setter value på select (controlled)', () => {
        render(<Select label="Land" value="se" onChange={() => {}} options={basicOptions} />);
        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('se');
    });

    it('setter defaultValue på select (uncontrolled)', () => {
        render(<Select label="Land" defaultValue="se" options={basicOptions} />);
        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('se');
    });

    it('kaller onChange når verdien endres', () => {
        const onChange = vi.fn();
        render(<Select label="Land" onChange={onChange} options={basicOptions} />);
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'se' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('støtter disabled option', () => {
        const optionsWithDisabled = [
            { value: 'no', label: 'Norge' },
            { value: 'se', label: 'Sverige', disabled: true },
        ];
        render(<Select label="Land" options={optionsWithDisabled} />);
        const disabledOption = screen.getByRole('option', { name: 'Sverige' }) as HTMLOptionElement;
        expect(disabledOption.disabled).toBe(true);
    });

    it('className går til wrapper (ix-field), ikke til select', () => {
        const { container } = render(<Select label="Land" className="custom" options={basicOptions} />);
        const ixField = container.querySelector('ix-field');
        const select = screen.getByRole('combobox');
        expect(ixField?.classList.contains('custom')).toBe(true);
        expect(select.classList.contains('custom')).toBe(false);
    });
});
