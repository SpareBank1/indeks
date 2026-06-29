import { fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CheckboxButton } from './CheckboxButton';
import { CheckboxGroup } from './CheckboxGroup';

// Note: når <CheckboxButton> brukes inni <CheckboxGroup>, eier WC
// (ix-checkbox-group) id og name. React-laget setter dem ikke. Standalone-tester
// rendrer kun en bar React-komponent uten WC-en rundt seg.

describe('CheckboxButton', () => {
    describe('standalone (uten gruppe)', () => {
        it('rendrer div.ix-checkbox-wrapper', () => {
            const { container } = render(<CheckboxButton value="a" label="A" />);
            expect(container.querySelector('div.ix-checkbox')).not.toBeNull();
        });

        it('rendrer naken input med type="checkbox" (ingen BEM-klasse)', () => {
            const { container } = render(<CheckboxButton value="a" label="A" />);
            const input = container.querySelector('input');
            expect(input?.getAttribute('type')).toBe('checkbox');
            expect(input?.classList.contains('ix-checkbox__input')).toBe(false);
        });

        it('rendrer label-tekst som søsken til input', () => {
            const { container } = render(<CheckboxButton value="a" label="Alternativ A" />);
            const label = container.querySelector('label');
            expect(label).not.toBeNull();
            expect(label?.textContent).toBe('Alternativ A');
        });

        it('setter value på input', () => {
            const { container } = render(<CheckboxButton value="epost" label="E-post" />);
            expect(container.querySelector('input')?.getAttribute('value')).toBe('epost');
        });

        it('setter disabled på input og --disabled-modifier på wrapper', () => {
            const { container } = render(<CheckboxButton value="a" label="A" disabled />);
            expect((container.querySelector('input') as HTMLInputElement).disabled).toBe(true);
            expect(container.querySelector('.ix-checkbox')?.classList.contains('ix-checkbox--disabled')).toBe(true);
        });

        it('legger className på wrapperen', () => {
            const { container } = render(<CheckboxButton value="a" label="A" className="custom" />);
            expect(container.querySelector('.ix-checkbox')?.classList.contains('custom')).toBe(true);
        });

        it('forwarder ref til input-elementet', () => {
            const ref = createRef<HTMLInputElement>();
            render(<CheckboxButton value="a" label="A" ref={ref} />);
            expect(ref.current).toBeInstanceOf(HTMLInputElement);
        });

        it('spreader ukjente HTML-attributter til input', () => {
            const { container } = render(<CheckboxButton value="a" label="A" data-testid="cb" />);
            expect(container.querySelector('input')?.getAttribute('data-testid')).toBe('cb');
        });
    });

    describe('inni CheckboxGroup (med context og WC)', () => {
        it('input får name fra gruppe-context', () => {
            const { container } = render(
                <CheckboxGroup legend="Velg" name="gruppe-name">
                    <CheckboxButton value="a" label="A" />
                </CheckboxGroup>
            );
            expect(container.querySelector('input')?.getAttribute('name')).toBe('gruppe-name');
        });

        it('WC genererer id på input', () => {
            const { container } = render(
                <CheckboxGroup legend="Velg" name="g">
                    <CheckboxButton value="a" label="A" />
                </CheckboxGroup>
            );
            expect(container.querySelector('input')!.id).toBeTruthy();
        });

        it('er avkrysset når value inneholder verdien (kontrollert)', () => {
            const { container } = render(
                <CheckboxGroup legend="Velg" value={['a']} onChange={vi.fn()}>
                    <CheckboxButton value="a" label="A" />
                    <CheckboxButton value="b" label="B" />
                </CheckboxGroup>
            );
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            expect(inputs[0].checked).toBe(true);
            expect(inputs[1].checked).toBe(false);
        });

        it('kaller gruppe-onChange med oppdatert array ved klikk', () => {
            const onChange = vi.fn();
            const { container } = render(
                <CheckboxGroup legend="Velg" value={['a']} onChange={onChange}>
                    <CheckboxButton value="a" label="A" />
                    <CheckboxButton value="b" label="B" />
                </CheckboxGroup>
            );
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            fireEvent.click(inputs[1]);
            expect(onChange).toHaveBeenCalledWith(['a', 'b']);
        });

        it('group-disabled på host propagerer til alle inputs (WC)', () => {
            const { container } = render(
                <CheckboxGroup legend="Velg" disabled>
                    <CheckboxButton value="a" label="A" />
                </CheckboxGroup>
            );
            expect((container.querySelector('input') as HTMLInputElement).disabled).toBe(true);
        });

        it('per-knapp disabled fungerer ved siden av enabled søsken', () => {
            const { container } = render(
                <CheckboxGroup legend="Velg">
                    <CheckboxButton value="a" label="A" disabled />
                    <CheckboxButton value="b" label="B" />
                </CheckboxGroup>
            );
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            expect(inputs[0].disabled).toBe(true);
            expect(inputs[1].disabled).toBe(false);
        });
    });
});
