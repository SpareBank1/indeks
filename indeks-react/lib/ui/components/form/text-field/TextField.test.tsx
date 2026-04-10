import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextField } from './TextField';

describe('TextField', () => {
    it('rendrer label koblet til input via htmlFor/id', () => {
        render(<TextField label="Kontonummer" inputId="konto" />);
        const input = screen.getByRole('textbox');
        const label = document.querySelector('label');
        expect(input.id).toBe('konto');
        expect(label?.htmlFor).toBe('konto');
    });

    it('genererer id automatisk når inputId ikke er satt', () => {
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

    it('setter disabled-klasse og disabled-attributt på input', () => {
        const { container } = render(<TextField label="Beløp" disabled />);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        const ixField = container.querySelector('ix-field');
        expect(input.disabled).toBe(true);
        expect(ixField?.classList.contains('ix-field--disabled')).toBe(true);
    });

    it('setter read-only-klasse og readOnly-attributt på input', () => {
        const { container } = render(<TextField label="Referanse" readOnly />);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        const ixField = container.querySelector('ix-field');
        expect(input.readOnly).toBe(true);
        expect(ixField?.classList.contains('ix-field--read-only')).toBe(true);
    });

    it('rendrer prefix og suffix', () => {
        render(<TextField label="Beløp i kroner" prefix="kr" suffix=",00" />);
        expect(screen.getByText('kr')).toBeDefined();
        expect(screen.getByText(',00')).toBeDefined();
    });

    it('sender inputProps videre til input', () => {
        render(<TextField label="E-post" inputProps={{ type: 'email', autoComplete: 'email' }} />);
        const input = screen.getByRole('textbox');
        expect(input.getAttribute('type')).toBe('email');
        expect(input.getAttribute('autocomplete')).toBe('email');
    });

    it('eksplisitte props (disabled, readOnly) vinner over inputProps', () => {
        render(<TextField label="Test" disabled={true} inputProps={{ disabled: false } as React.InputHTMLAttributes<HTMLInputElement>} />);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.disabled).toBe(true);
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
});
