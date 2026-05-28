import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
    it('rendrer checkbox med label', () => {
        render(<Checkbox label="Jeg godtar vilkårene" />);
        expect(screen.getByRole('checkbox')).toBeDefined();
        expect(screen.getByText('Jeg godtar vilkårene')).toBeDefined();
    });

    it('genererer id automatisk når id ikke er satt', () => {
        render(<Checkbox label="Test" />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox.id).toBeTruthy();
    });

    it('bruker angitt id når satt', () => {
        render(<Checkbox label="Test" id="my-checkbox" />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox.id).toBe('my-checkbox');
    });

    it('rendrer description når satt', () => {
        render(<Checkbox label="Nyhetsbrev" description="Du kan melde deg av når som helst" />);
        const desc = document.querySelector('[data-field="description"]');
        expect(desc).toBeDefined();
        expect(desc?.textContent).toBe('Du kan melde deg av når som helst');
    });

    it('rendrer error-span med feilmelding', () => {
        render(<Checkbox label="Vilkår" errorMessage="Du må godta vilkårene" />);
        const error = document.querySelector('[data-field="error"]');
        expect(error).toBeDefined();
        expect(error?.textContent).toBe('Du må godta vilkårene');
    });

    it('setter aria-invalid når errorMessage er satt', () => {
        render(<Checkbox label="Vilkår" errorMessage="Påkrevd" />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox.getAttribute('aria-invalid')).toBe('true');
    });

    it('setter ikke aria-invalid når errorMessage ikke er satt', () => {
        render(<Checkbox label="Test" />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox.hasAttribute('aria-invalid')).toBe(false);
    });

    it('setter disabled-attributt på input', () => {
        render(<Checkbox label="Test" disabled />);
        const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
        expect(checkbox.disabled).toBe(true);
    });

    it('setter checked-attributt når checked er true', () => {
        render(<Checkbox label="Test" checked onChange={() => {}} />);
        const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
        expect(checkbox.checked).toBe(true);
    });

    it('setter defaultChecked for uncontrolled bruk', () => {
        render(<Checkbox label="Test" defaultChecked />);
        const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
        expect(checkbox.checked).toBe(true);
    });

    it('setter indeterminate state', () => {
        render(<Checkbox label="Velg alle" indeterminate />);
        const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
        expect(checkbox.indeterminate).toBe(true);
    });

    it('kaller onChange når checkbox klikkes', () => {
        const onChange = vi.fn();
        render(<Checkbox label="Test" onChange={onChange} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('videresender name til input (nativ form-støtte)', () => {
        render(<Checkbox label="Test" name="terms" />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox.getAttribute('name')).toBe('terms');
    });

    it('videresender value til input', () => {
        render(<Checkbox label="Test" value="accepted" />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox.getAttribute('value')).toBe('accepted');
    });

    it('sender ref videre til input-elementet', () => {
        const ref = createRef<HTMLInputElement>();
        render(<Checkbox label="Test" ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
        expect(ref.current?.type).toBe('checkbox');
    });

    it('setter aria-label når ariaLabel er satt', () => {
        render(<Checkbox label="Visuell label" ariaLabel="Skjermleser-label" />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox.getAttribute('aria-label')).toBe('Skjermleser-label');
    });

    it('sender className videre til wrapper når Field brukes', () => {
        const { container } = render(<Checkbox label="Test" description="Desc" className="custom-class" />);
        const field = container.querySelector('ix-field');
        expect(field?.classList.contains('custom-class')).toBe(true);
    });

    it('rendrer uten Field-wrapper når ingen description/error/tooltip', () => {
        const { container } = render(<Checkbox label="Test" />);
        const field = container.querySelector('ix-field');
        expect(field).toBeNull();
        expect(container.querySelector('.ix-checkbox')).toBeDefined();
    });

    it('rendrer med Field-wrapper når description er satt', () => {
        const { container } = render(<Checkbox label="Test" description="Hjelpetekst" />);
        const field = container.querySelector('ix-field');
        expect(field).toBeDefined();
    });

    it('rendrer med Field-wrapper når errorMessage er satt', () => {
        const { container } = render(<Checkbox label="Test" errorMessage="Feil" />);
        const field = container.querySelector('ix-field');
        expect(field).toBeDefined();
    });

    it('setter required-attributt på input', () => {
        render(<Checkbox label="Test" required />);
        const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
        expect(checkbox.required).toBe(true);
    });
});
