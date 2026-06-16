import { fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { RadioButton } from './RadioButton';
import { RadioGroup } from './RadioGroup';

// Note: når <RadioButton> brukes inni <RadioGroup>, eier WC (ix-radio-group)
// id, name og htmlFor. React-laget setter dem ikke. Standalone-tester rendrer
// kun en bar React-komponent uten WC-en rundt seg, og verifiserer det
// React-laget faktisk eier (markup, value, disabled-prop, ref-forwarding).

describe('RadioButton', () => {
    describe('standalone (uten gruppe)', () => {
        it('rendrer wrapper-div', () => {
            const { container } = render(<RadioButton value="a" label="A" />);
            expect(container.querySelector('div')).not.toBeNull();
        });

        it('rendrer input med type="radio"', () => {
            const { container } = render(<RadioButton value="a" label="A" />);
            const input = container.querySelector('input');
            expect(input).not.toBeNull();
            expect(input?.getAttribute('type')).toBe('radio');
        });

        it('rendrer label', () => {
            const { container } = render(<RadioButton value="a" label="Alternativ A" />);
            const label = container.querySelector('label');
            expect(label).not.toBeNull();
            expect(label?.textContent).toContain('Alternativ A');
        });

        it('respekterer eksplisitt id på input', () => {
            const { container } = render(<RadioButton value="a" label="A" id="mitt-input" />);
            expect(container.querySelector('input')!.id).toBe('mitt-input');
        });

        it('setter value på input', () => {
            const { container } = render(<RadioButton value="privat" label="Privat" />);
            expect(container.querySelector('input')?.getAttribute('value')).toBe('privat');
        });

        it('setter name direkte ved standalone-bruk', () => {
            const { container } = render(<RadioButton value="a" label="A" name="min-gruppe" />);
            expect(container.querySelector('input')?.getAttribute('name')).toBe('min-gruppe');
        });

        it('setter disabled på input når prop er satt', () => {
            const { container } = render(<RadioButton value="a" label="A" disabled />);
            expect((container.querySelector('input') as HTMLInputElement).disabled).toBe(true);
        });

        it('setter className på wrapper-div', () => {
            const { container } = render(<RadioButton value="a" label="A" className="custom" />);
            expect(container.querySelector('div')?.classList.contains('custom')).toBe(true);
        });

        it('forwarder ref til input-elementet', () => {
            const ref = createRef<HTMLInputElement>();
            render(<RadioButton value="a" label="A" ref={ref} />);
            expect(ref.current).toBeInstanceOf(HTMLInputElement);
        });

        it('spreader ukjente HTML-attributter til input', () => {
            const { container } = render(
                <RadioButton value="a" label="A" data-testid="mitt-input" />
            );
            expect(container.querySelector('input')?.getAttribute('data-testid')).toBe('mitt-input');
        });
    });

    describe('inni RadioGroup (med context og WC)', () => {
        it('input får name fra gruppe-context', () => {
            const { container } = render(
                <RadioGroup legend="Velg" name="gruppe-name">
                    <RadioButton value="a" label="A" />
                </RadioGroup>
            );
            expect(container.querySelector('input')?.getAttribute('name')).toBe('gruppe-name');
        });

        it('WC kobler label til input via htmlFor/id', () => {
            const { container } = render(
                <RadioGroup legend="Velg" name="g">
                    <RadioButton value="a" label="A" />
                </RadioGroup>
            );
            const input = container.querySelector('input')!;
            const label = container.querySelector('label')!;
            expect(input.id).toBeTruthy();
            expect(label.htmlFor).toBe(input.id);
        });

        it('er sjekket når value matcher gruppe-value (kontrollert)', () => {
            const { container } = render(
                <RadioGroup legend="Velg" value="a" onChange={vi.fn()}>
                    <RadioButton value="a" label="A" />
                    <RadioButton value="b" label="B" />
                </RadioGroup>
            );
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            expect(inputs[0].checked).toBe(true);
            expect(inputs[1].checked).toBe(false);
        });

        it('kaller gruppe-onChange med value ved klikk', () => {
            const onChange = vi.fn();
            const { container } = render(
                <RadioGroup legend="Velg" value="a" onChange={onChange}>
                    <RadioButton value="a" label="A" />
                    <RadioButton value="b" label="B" />
                </RadioGroup>
            );
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            fireEvent.click(inputs[1]);
            expect(onChange).toHaveBeenCalledWith('b');
        });

        it('group-disabled på host propagerer til alle inputs (WC)', () => {
            const { container } = render(
                <RadioGroup legend="Velg" disabled>
                    <RadioButton value="a" label="A" />
                </RadioGroup>
            );
            expect((container.querySelector('input') as HTMLInputElement).disabled).toBe(true);
        });

        it('per-knapp disabled fungerer ved siden av enabled søsken', () => {
            const { container } = render(
                <RadioGroup legend="Velg">
                    <RadioButton value="a" label="A" disabled />
                    <RadioButton value="b" label="B" />
                </RadioGroup>
            );
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            expect(inputs[0].disabled).toBe(true);
            expect(inputs[1].disabled).toBe(false);
        });
    });
});
