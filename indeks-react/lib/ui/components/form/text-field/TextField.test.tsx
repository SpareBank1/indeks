import { fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TextField } from './TextField';
import { IxField } from '@sb1/indeks-web';

// Formaterings-oppførsel (focus/blur/refreshFormat) bor i ix-field-WC-en.
// Registrer den lokalt for de controlled-testene som trenger den. Payoff:
// øvrige tester i fila er skrevet mot inert ix-field, men å definere elementet
// er trygt — uten formatter og med korrekt ARIA-lim endrer WC-en ingenting de sjekker.
if (!customElements.get('ix-field')) {
    customElements.define('ix-field', IxField);
}

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

    it('setter data-format paa input naar format er et variant-navn', () => {
        const { container } = render(<TextField label="Telefon" format="phone" />);
        const input = container.querySelector('input');
        expect(input?.getAttribute('data-format')).toBe('phone');
    });

    it('setter data-format-pattern paa input naar formatPattern er satt', () => {
        const { container } = render(<TextField label="Dato" formatPattern="00.00.0000" />);
        const input = container.querySelector('input');
        expect(input?.getAttribute('data-format-pattern')).toBe('00.00.0000');
    });

    it('setter data-format-live paa input naar formatLive er satt', () => {
        const { container } = render(<TextField label="Telefon" format="phone" formatLive={false} />);
        const input = container.querySelector('input');
        expect(input?.getAttribute('data-format-live')).toBe('false');
    });

    it('setter ikke data-format-live naar formatLive er utelatt', () => {
        const { container } = render(<TextField label="Telefon" format="phone" />);
        const input = container.querySelector('input');
        expect(input?.hasAttribute('data-format-live')).toBe(false);
    });

    it('formatLive={false} tvinger innebygd variant til blur (rå ved fokus)', () => {
        const { container } = render(<TextField label="Telefon" name="tlf" format="phone" defaultValue="12345678" formatLive={false} />);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.value).toBe('123 45 678');
        input.focus();
        fireEvent.focus(input);
        expect(input.value).toBe('12345678');
        expect((container.querySelector('input[type="hidden"]') as HTMLInputElement).value).toBe('12345678');
    });

    it('setter ikke data-format naar format er et objekt (bruker property via ref)', () => {
        const formatter = { format: (r: string) => r, parse: (d: string) => d };
        const { container } = render(<TextField label="Egen" format={formatter} />);
        const input = container.querySelector('input');
        expect(input?.hasAttribute('data-format')).toBe(false);
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

    describe('controlled formatering (mirror-modell)', () => {
        // Mirror-modell: synlig input viser formatert tekst (live) eller rå ved
        // fokus (blur); en skjult input[type=hidden] bærer den rå verdien.
        const mirrorValue = (container: HTMLElement): string | undefined => (container.querySelector('input[type="hidden"]') as HTMLInputElement | null)?.value;

        it('synlig input viser formatert (live), mirror holder rå (controlled)', () => {
            const { container } = render(<TextField label="Tlf" name="tlf" format="phone" value="12345678" onChange={() => {}} />);
            const input = screen.getByRole('textbox') as HTMLInputElement;
            expect(input.value).toBe('123 45 678');
            expect(mirrorValue(container)).toBe('12345678');
        });

        it('beholder visning ved urelatert re-render (controlled)', () => {
            function Wrap() {
                const [, force] = useState(0);
                return (
                    <>
                        <TextField label="Tlf" name="tlf" format="phone" value="12345678" onChange={() => {}} />
                        <button onClick={() => force((n) => n + 1)}>rerender</button>
                    </>
                );
            }
            const { container } = render(<Wrap />);
            const input = screen.getByRole('textbox') as HTMLInputElement;
            expect(input.value).toBe('123 45 678');
            expect(mirrorValue(container)).toBe('12345678');
            fireEvent.click(screen.getByText('rerender'));
            expect(input.value).toBe('123 45 678');
            expect(mirrorValue(container)).toBe('12345678');
        });

        it('reformaterer synlig input når ny verdi settes programmatisk (controlled)', () => {
            function Wrap() {
                const [v, setV] = useState('12345678');
                return (
                    <>
                        <TextField label="Tlf" name="tlf" format="phone" value={v} onChange={(e) => setV((e.target as HTMLInputElement).value)} />
                        <button onClick={() => setV('87654321')}>sett ny</button>
                    </>
                );
            }
            const { container } = render(<Wrap />);
            const input = screen.getByRole('textbox') as HTMLInputElement;
            expect(input.value).toBe('123 45 678');
            fireEvent.click(screen.getByText('sett ny'));
            // Synlig input re-formateres via refreshFormat i useLayoutEffect; mirror rå.
            expect(input.value).toBe('876 54 321');
            expect(mirrorValue(container)).toBe('87654321');
        });

        it('onChange gir rå verdi i live-modus (form/input.value er formatert)', () => {
            const onChange = vi.fn();
            const { container } = render(<TextField label="Tlf" name="tlf" format="phone" defaultValue="" onChange={onChange} />);
            const input = screen.getByRole('textbox') as HTMLInputElement;
            input.value = '12345678';
            input.setSelectionRange(8, 8);
            fireEvent.input(input);
            // Synlig input formateres, men onChange leverer rå verdi til konsumenten.
            expect(input.value).toBe('123 45 678');
            expect(mirrorValue(container)).toBe('12345678');
            expect((onChange.mock.lastCall![0].target as HTMLInputElement).value).toBe('12345678');
        });

        it('uncontrolled live (defaultValue) rendrer formatert startverdi', () => {
            const { container } = render(<TextField label="Tlf" name="tlf" format="phone" defaultValue="12345678" />);
            const input = screen.getByRole('textbox') as HTMLInputElement;
            expect(input.value).toBe('123 45 678');
            expect(mirrorValue(container)).toBe('12345678');
        });
    });
});
