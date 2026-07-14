import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TextField } from './TextField';

describe('TextField', () => {
    it('rendrer label koblet til input via htmlFor/id', () => {
        render(<TextField label="Kontonummer" id="konto" />);
        const input = screen.getByRole('textbox');
        const label = document.querySelector('label');
        expect(input.id).toBe('konto');
        expect(label?.htmlFor).toBe('konto');
    });

    it('genererer id automatisk når id ikke er satt', () => {
        render(<TextField label="E-post" />);
        const input = screen.getByRole('textbox');
        expect(input.id).toBeTruthy();
        const label = document.querySelector('label');
        expect(label?.htmlFor).toBe(input.id);
    });

    it('rendrer description-span med data-field attributt', () => {
        render(<TextField label="Beløp" description="Uten desimaler" />);
        const desc = document.querySelector('[data-field="description"]');
        expect(desc).toBeDefined();
        expect(desc?.textContent).toBe('Uten desimaler');
    });

    it('rendrer description-span selv uten description (alltid i DOM)', () => {
        render(<TextField label="Beløp" />);
        const desc = document.querySelector('[data-field="description"]');
        expect(desc).toBeDefined();
    });

    it('rendrer error-span med data-field attributt', () => {
        render(<TextField label="Kontonummer" errorMessage="Må ha 11 siffer" />);
        const error = document.querySelector('[data-field="error"]');
        expect(error).toBeDefined();
        expect(error?.textContent).toBe('Må ha 11 siffer');
    });

    it('rendrer error-span alltid i DOM (tomt uten feilmelding)', () => {
        render(<TextField label="Kontonummer" />);
        const error = document.querySelector('[data-field="error"]');
        expect(error).toBeDefined();
        expect(error?.textContent).toBe('');
    });

    it('rendrer ix-field som wrapper-element', () => {
        const { container } = render(<TextField label="Test" />);
        const ixField = container.querySelector('ix-field');
        expect(ixField).toBeDefined();
    });

    it('rendrer ix-text-field som wrapper rundt input', () => {
        const { container } = render(<TextField label="Test" />);
        const wrapper = container.querySelector('.ix-text-field');
        expect(wrapper).toBeDefined();
        expect(wrapper?.querySelector('input')).toBeDefined();
    });

    it('setter type-propen på input', () => {
        render(<TextField label="E-post" type="email" />);
        const input = screen.getByRole('textbox');
        expect(input.getAttribute('type')).toBe('email');
    });

    it('spreader ukjente HTML-attributter videre til input', () => {
        render(<TextField label="Test" data-testid="mitt-felt" />);
        const input = screen.getByRole('textbox');
        expect(input.getAttribute('data-testid')).toBe('mitt-felt');
    });

    it('setter disabled-attributt paa input (CSS :has(:disabled) styler field)', () => {
        render(<TextField label="Beløp" disabled />);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    it('setter readOnly-attributt paa input (CSS :has(:read-only) styler field)', () => {
        render(<TextField label="Referanse" readOnly />);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.readOnly).toBe(true);
    });

    it('rendrer prefix og suffix', () => {
        render(<TextField label="Beløp i kroner" prefix="kr" suffix=",00" />);
        expect(screen.getByText('kr')).toBeDefined();
        expect(screen.getByText(',00')).toBeDefined();
    });

    it('setter autocomplete paa input via spread', () => {
        render(<TextField label="E-post" type="email" autoComplete="email" />);
        const input = screen.getByRole('textbox');
        expect(input.getAttribute('type')).toBe('email');
        expect(input.getAttribute('autocomplete')).toBe('email');
    });

    it('setter placeholder på input', () => {
        render(<TextField label="Søk" placeholder="Skriv her..." />);
        const input = screen.getByPlaceholderText('Skriv her...');
        expect(input).toBeDefined();
    });

    it('sender className videre til ix-field', () => {
        const { container } = render(<TextField label="Test" className="custom-class" />);
        const ixField = container.querySelector('ix-field');
        expect(ixField?.classList.contains('custom-class')).toBe(true);
    });

    it('sender ref videre til input-elementet', () => {
        const ref = createRef<HTMLInputElement>();
        render(<TextField label="Test" ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
        expect(ref.current?.tagName).toBe('INPUT');
    });

    it('setter required-attributt paa input', () => {
        render(<TextField label="E-post" required />);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    it('rendrer ingen React-basert required-indikator (haandteres av CSS :has(:required))', () => {
        const { container } = render(<TextField label="E-post" required />);
        const indicator = container.querySelector('.ix-field__required');
        expect(indicator).toBeNull();
    });

    it('setter aria-label paa input naar ariaLabel er satt', () => {
        render(<TextField ariaLabel="Søk" />);
        const input = screen.getByRole('textbox');
        expect(input.getAttribute('aria-label')).toBe('Søk');
    });

    it('renderer ikke label-element naar kun ariaLabel er satt', () => {
        render(<TextField ariaLabel="Søk" />);
        const label = document.querySelector('label');
        expect(label).toBeNull();
    });

    it('setter top-level value paa input (controlled)', () => {
        render(<TextField label="E-post" value="ola@sb1.no" onChange={() => {}} />);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.value).toBe('ola@sb1.no');
    });

    it('setter top-level defaultValue paa input (uncontrolled)', () => {
        render(<TextField label="E-post" defaultValue="ola@sb1.no" />);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.value).toBe('ola@sb1.no');
    });

    it('kaller top-level onChange naar verdien endres', () => {
        const onChange = vi.fn();
        render(<TextField label="E-post" defaultValue="" onChange={onChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'ny verdi' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('setter data-format paa ix-field naar format er et variant-navn', () => {
        const { container } = render(<TextField label="Telefon" format="phone" />);
        const ixField = container.querySelector('ix-field');
        expect(ixField?.getAttribute('data-format')).toBe('phone');
    });

    it('setter data-format-pattern paa ix-field naar formatPattern er satt', () => {
        const { container } = render(<TextField label="Dato" formatPattern="00.00.0000" />);
        const ixField = container.querySelector('ix-field');
        expect(ixField?.getAttribute('data-format-pattern')).toBe('00.00.0000');
    });

    it('setter ikke data-format naar format er et objekt (bruker property via ref)', () => {
        const formatter = { format: (r: string) => r, parse: (d: string) => d };
        const { container } = render(<TextField label="Egen" format={formatter} />);
        const ixField = container.querySelector('ix-field');
        expect(ixField?.hasAttribute('data-format')).toBe(false);
    });

    it('lar native pattern-attributt gaa uroert til input (ikke formatPattern)', () => {
        render(<TextField label="Postnr" pattern="[0-9]{4}" />);
        const input = screen.getByRole('textbox');
        expect(input.getAttribute('pattern')).toBe('[0-9]{4}');
    });

    it('className gaar til wrapper (ix-field), ikke til input', () => {
        const { container } = render(<TextField label="Test" className="custom" />);
        const ixField = container.querySelector('ix-field');
        const input = screen.getByRole('textbox');
        expect(ixField?.classList.contains('custom')).toBe(true);
        expect(input.classList.contains('custom')).toBe(false);
    });
});
