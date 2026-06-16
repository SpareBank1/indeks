import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RadioButton } from './RadioButton';
import { RadioGroup } from './RadioGroup';

function renderGroup(props?: Partial<Parameters<typeof RadioGroup>[0]>) {
    return render(
        <RadioGroup legend="Velg kundetype" {...props}>
            <RadioButton value="privat" label="Privat" />
            <RadioButton value="bedrift" label="Bedrift" />
            <RadioButton value="annet" label="Annet" />
        </RadioGroup>
    );
}

describe('RadioGroup', () => {
    it('rendrer ix-radio-group som rot-element', () => {
        const { container } = renderGroup();
        expect(container.querySelector('ix-radio-group')).not.toBeNull();
    });

    it('rendrer legend i span[data-field="legend"]', () => {
        const { container } = renderGroup();
        const legend = container.querySelector('span[data-field="legend"]');
        expect(legend).not.toBeNull();
        expect(legend?.textContent).toBe('Velg kundetype');
    });

    it('rendrer description i p[data-field="description"] når oppgitt', () => {
        const { container } = renderGroup({ description: 'Beskriv deg selv' });
        const desc = container.querySelector('p[data-field="description"]');
        expect(desc).not.toBeNull();
        expect(desc?.textContent).toBe('Beskriv deg selv');
    });

    it('rendrer ikke description-element når description mangler', () => {
        const { container } = renderGroup();
        expect(container.querySelector('p[data-field="description"]')).toBeNull();
    });

    it('rendrer ValidationMessage (span[data-field="error"]) alltid i DOM', () => {
        const { container } = renderGroup();
        expect(container.querySelector('span[data-field="error"]')).not.toBeNull();
    });

    it('rendrer errorMessage i ValidationMessage', () => {
        const { container } = renderGroup({ errorMessage: 'Du må velge et alternativ' });
        const error = container.querySelector('span[data-field="error"]');
        expect(error?.textContent).toBe('Du må velge et alternativ');
    });

    it('setter data-state="error" på host når errorMessage er satt', () => {
        const { container } = renderGroup({ errorMessage: 'Feil' });
        const host = container.querySelector('ix-radio-group');
        expect(host?.getAttribute('data-state')).toBe('error');
    });

    it('setter data-state="readonly" på host ved readOnly', () => {
        const { container } = renderGroup({ readOnly: true });
        const host = container.querySelector('ix-radio-group');
        expect(host?.getAttribute('data-state')).toBe('readonly');
    });

    it('setter data-state="disabled" på host ved disabled', () => {
        const { container } = renderGroup({ disabled: true });
        const host = container.querySelector('ix-radio-group');
        expect(host?.getAttribute('data-state')).toBe('disabled');
    });

    it('setter error-state over disabled/readonly (prioritet)', () => {
        const { container } = renderGroup({ errorMessage: 'Feil', disabled: true });
        const host = container.querySelector('ix-radio-group');
        expect(host?.getAttribute('data-state')).toBe('error');
    });

    it('setter ikke data-state uten spesielle props', () => {
        const { container } = renderGroup();
        const host = container.querySelector('ix-radio-group');
        expect(host?.hasAttribute('data-state')).toBe(false);
    });

    it('setter data-orientation="horizontal" ved orientation="horizontal"', () => {
        const { container } = renderGroup({ orientation: 'horizontal' });
        const host = container.querySelector('ix-radio-group');
        expect(host?.getAttribute('data-orientation')).toBe('horizontal');
    });

    it('setter ikke data-orientation ved default (vertical)', () => {
        const { container } = renderGroup();
        const host = container.querySelector('ix-radio-group');
        expect(host?.hasAttribute('data-orientation')).toBe(false);
    });

    it('legend får ix-sr-only-klasse ved hideLegend', () => {
        const { container } = renderGroup({ hideLegend: true });
        const legend = container.querySelector('span[data-field="legend"]');
        expect(legend?.classList.contains('ix-sr-only')).toBe(true);
    });

    it('legend har ingen ix-sr-only-klasse uten hideLegend', () => {
        const { container } = renderGroup();
        const legend = container.querySelector('span[data-field="legend"]');
        expect(legend?.classList.contains('ix-sr-only')).toBe(false);
    });

    it('sender name via context — alle inputs får samme name fra WC', () => {
        const { container } = renderGroup({ name: 'min-gruppe' });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        for (const input of inputs) {
            expect(input.name).toBe('min-gruppe');
        }
    });

    it('når name ikke oppgis, genererer WC et stabilt gruppe-name', () => {
        const { container } = renderGroup();
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        const names = Array.from(inputs).map((i) => i.name);
        expect(names[0]).toBeTruthy();
        expect(new Set(names).size).toBe(1);
    });

    it('styrer sjekket alternativ via value (kontrollert)', () => {
        const { container } = renderGroup({ value: 'bedrift', onChange: vi.fn() });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        expect(inputs[0].checked).toBe(false);
        expect(inputs[1].checked).toBe(true);
        expect(inputs[2].checked).toBe(false);
    });

    it('kaller onChange med riktig value ved klikk', () => {
        const onChange = vi.fn();
        const { container } = renderGroup({ value: 'privat', onChange });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        fireEvent.click(inputs[1]);
        expect(onChange).toHaveBeenCalledWith('bedrift');
    });

    it('disabled-attributtet på host propagerer til alle inputs (via WC)', () => {
        const { container } = renderGroup({ disabled: true });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        for (const input of inputs) {
            expect(input.disabled).toBe(true);
        }
    });

    it('setter readonly-attributt på ix-radio-group host', () => {
        const { container } = renderGroup({ readOnly: true });
        const host = container.querySelector('ix-radio-group');
        expect(host?.hasAttribute('readonly')).toBe(true);
    });

    it('setter required-attributt på ix-radio-group host', () => {
        const { container } = renderGroup({ required: true });
        const host = container.querySelector('ix-radio-group');
        expect(host?.hasAttribute('required')).toBe(true);
    });

    it('setter className på ix-radio-group', () => {
        const { container } = renderGroup({ className: 'min-klasse' });
        const host = container.querySelector('ix-radio-group');
        expect(host?.classList.contains('min-klasse')).toBe(true);
    });

    it('rendrer barn inni items-container', () => {
        const { container } = renderGroup();
        const items = container.querySelector('[data-field="items"]');
        expect(items?.querySelectorAll('input[type="radio"]').length).toBe(3);
    });

    describe('options-prop', () => {
        it('rendrer en RadioButton per option', () => {
            const { container } = render(
                <RadioGroup
                    legend="Velg kundetype"
                    options={[
                        { value: 'privat', label: 'Privat' },
                        { value: 'bedrift', label: 'Bedrift' },
                    ]}
                />
            );
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            expect(inputs.length).toBe(2);
            expect(inputs[0].value).toBe('privat');
            expect(inputs[1].value).toBe('bedrift');
        });

        it('rendrer label-tekst per option', () => {
            const { container } = render(
                <RadioGroup
                    legend="Velg"
                    options={[
                        { value: 'a', label: 'Alternativ A' },
                        { value: 'b', label: 'Alternativ B' },
                    ]}
                />
            );
            const labels = container.querySelectorAll('label');
            expect(labels[0].textContent).toBe('Alternativ A');
            expect(labels[1].textContent).toBe('Alternativ B');
        });

        it('options overstyrer children når begge er gitt', () => {
            const { container } = render(
                <RadioGroup
                    legend="Velg"
                    options={[{ value: 'a', label: 'A' }]}
                >
                    <RadioButton value="ignorert" label="Ignorert" />
                </RadioGroup>
            );
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            expect(inputs.length).toBe(1);
            expect(inputs[0].value).toBe('a');
        });

        it('kontrollert value/onChange virker med options', () => {
            const onChange = vi.fn();
            const { container } = render(
                <RadioGroup
                    legend="Velg"
                    value="b"
                    onChange={onChange}
                    options={[
                        { value: 'a', label: 'A' },
                        { value: 'b', label: 'B' },
                    ]}
                />
            );
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
            expect(inputs[1].checked).toBe(true);
            fireEvent.click(inputs[0]);
            expect(onChange).toHaveBeenCalledWith('a');
        });
    });
});
