import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TextArea } from './TextArea';

describe('TextArea', () => {
    it('rendrer label koblet til textarea via htmlFor/id', () => {
        render(<TextArea label="Tilbakemelding" inputId="feedback" />);
        const textarea = screen.getByRole('textbox');
        const label = document.querySelector('label');
        expect(textarea.id).toBe('feedback');
        expect(label?.htmlFor).toBe('feedback');
    });

    it('genererer id automatisk når inputId ikke er satt', () => {
        render(<TextArea label="Tilbakemelding" />);
        const textarea = screen.getByRole('textbox');
        expect(textarea.id).toBeTruthy();
        const label = document.querySelector('label');
        expect(label?.htmlFor).toBe(textarea.id);
    });

    it('rendrer description-span med data-field attributt', () => {
        render(<TextArea label="Tilbakemelding" description="Maks 500 tegn" />);
        const desc = document.querySelector('[data-field="description"]');
        expect(desc).toBeDefined();
        expect(desc?.textContent).toBe('Maks 500 tegn');
    });

    it('rendrer description-span selv uten description (alltid i DOM)', () => {
        render(<TextArea label="Tilbakemelding" />);
        const desc = document.querySelector('[data-field="description"]');
        expect(desc).toBeDefined();
    });

    it('rendrer error-span med data-field attributt', () => {
        render(<TextArea label="Tilbakemelding" errorMessage="Feltet er påkrevd" />);
        const error = document.querySelector('[data-field="error"]');
        expect(error).toBeDefined();
        expect(error?.textContent).toBe('Feltet er påkrevd');
    });

    it('rendrer error-span alltid i DOM (tomt uten feilmelding)', () => {
        render(<TextArea label="Tilbakemelding" />);
        const error = document.querySelector('[data-field="error"]');
        expect(error).toBeDefined();
        expect(error?.textContent).toBe('');
    });

    it('rendrer ix-field som wrapper-element', () => {
        const { container } = render(<TextArea label="Test" />);
        const ixField = container.querySelector('ix-field');
        expect(ixField).toBeDefined();
    });

    it('rendrer ix-text-area som wrapper rundt textarea', () => {
        const { container } = render(<TextArea label="Test" />);
        const wrapper = container.querySelector('.ix-text-area');
        expect(wrapper).toBeDefined();
        expect(wrapper?.querySelector('textarea')).toBeDefined();
    });

    it('setter disabled-attributt paa textarea (CSS :has(:disabled) styler field)', () => {
        render(<TextArea label="Tilbakemelding" disabled />);
        const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
        expect(textarea.disabled).toBe(true);
    });

    it('setter readOnly-attributt paa textarea (CSS :has(:read-only) styler field)', () => {
        render(<TextArea label="Referanse" readOnly />);
        const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
        expect(textarea.readOnly).toBe(true);
    });

    it('sender inputProps videre til textarea', () => {
        render(<TextArea label="Tilbakemelding" inputProps={{ rows: 5, maxLength: 500 }} />);
        const textarea = screen.getByRole('textbox');
        expect(textarea.getAttribute('rows')).toBe('5');
        expect(textarea.getAttribute('maxlength')).toBe('500');
    });

    it('eksplisitte props (disabled, readOnly) vinner over inputProps', () => {
        render(<TextArea label="Test" disabled={true} inputProps={{ disabled: false } as React.TextareaHTMLAttributes<HTMLTextAreaElement>} />);
        const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
        expect(textarea.disabled).toBe(true);
    });

    it('setter placeholder på textarea', () => {
        render(<TextArea label="Søk" placeholder="Skriv her..." />);
        const textarea = screen.getByPlaceholderText('Skriv her...');
        expect(textarea).toBeDefined();
    });

    it('sender className videre til ix-field', () => {
        const { container } = render(<TextArea label="Test" className="custom-class" />);
        const ixField = container.querySelector('ix-field');
        expect(ixField?.classList.contains('custom-class')).toBe(true);
    });

    it('sender ref videre til textarea-elementet', () => {
        const ref = createRef<HTMLTextAreaElement>();
        render(<TextArea label="Test" ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
        expect(ref.current?.tagName).toBe('TEXTAREA');
    });

    it('setter required-attributt paa textarea', () => {
        render(<TextArea label="Tilbakemelding" required />);
        const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
        expect(textarea.required).toBe(true);
    });

    it('rendrer ingen React-basert required-indikator (haandteres av CSS :has(:required))', () => {
        const { container } = render(<TextArea label="Tilbakemelding" required />);
        const indicator = container.querySelector('.ix-field__required');
        expect(indicator).toBeNull();
    });

    it('setter aria-label paa textarea naar ariaLabel er satt', () => {
        render(<TextArea ariaLabel="Søk" />);
        const textarea = screen.getByRole('textbox');
        expect(textarea.getAttribute('aria-label')).toBe('Søk');
    });

    it('renderer ikke label-element naar kun ariaLabel er satt', () => {
        render(<TextArea ariaLabel="Søk" />);
        const label = document.querySelector('label');
        expect(label).toBeNull();
    });

    it('logger advarsel naar verken label eller ariaLabel er satt', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        render(<TextArea />);
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('label'));
        warnSpy.mockRestore();
    });
});
