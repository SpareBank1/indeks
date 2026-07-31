import { fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { firstEvent } from '../test-events';
import { CheckboxButton } from './CheckboxButton';
import { CheckboxGroup } from './CheckboxGroup';

function renderGroup(props?: Partial<Parameters<typeof CheckboxGroup>[0]>) {
    return render(
        <CheckboxGroup legend="Hvordan vil du bli kontaktet?" {...props}>
            <CheckboxButton value="epost" label="E-post" />
            <CheckboxButton value="sms" label="SMS" />
            <CheckboxButton value="telefon" label="Telefon" />
        </CheckboxGroup>
    );
}

describe('CheckboxGroup', () => {
    it('rendrer ix-checkbox-group som rot-element', () => {
        const { container } = renderGroup();
        expect(container.querySelector('ix-checkbox-group')).not.toBeNull();
    });

    it('setter role="group" på host (via WC)', () => {
        const { container } = renderGroup();
        const host = container.querySelector('ix-checkbox-group');
        expect(host?.getAttribute('role')).toBe('group');
    });

    it('rendrer legend i span[data-field="legend"]', () => {
        const { container } = renderGroup();
        const legend = container.querySelector('span[data-field="legend"]');
        expect(legend?.textContent).toBe('Hvordan vil du bli kontaktet?');
    });

    it('rendrer description i p[data-field="description"] når oppgitt', () => {
        const { container } = renderGroup({ description: 'Velg én eller flere' });
        const desc = container.querySelector('p[data-field="description"]');
        expect(desc?.textContent).toBe('Velg én eller flere');
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
        const { container } = renderGroup({ errorMessage: 'Du må velge minst ett alternativ' });
        const error = container.querySelector('span[data-field="error"]');
        expect(error?.textContent).toBe('Du må velge minst ett alternativ');
    });

    it('setter data-state="error" på host når errorMessage er satt', () => {
        const { container } = renderGroup({ errorMessage: 'Feil' });
        expect(container.querySelector('ix-checkbox-group')?.getAttribute('data-state')).toBe('error');
    });

    it('setter data-state="readonly" på host ved readOnly', () => {
        const { container } = renderGroup({ readOnly: true });
        expect(container.querySelector('ix-checkbox-group')?.getAttribute('data-state')).toBe('readonly');
    });

    it('setter data-state="disabled" på host ved disabled', () => {
        const { container } = renderGroup({ disabled: true });
        expect(container.querySelector('ix-checkbox-group')?.getAttribute('data-state')).toBe('disabled');
    });

    it('setter error-state over disabled/readonly (prioritet)', () => {
        const { container } = renderGroup({ errorMessage: 'Feil', disabled: true });
        expect(container.querySelector('ix-checkbox-group')?.getAttribute('data-state')).toBe('error');
    });

    it('setter ikke data-state uten spesielle props', () => {
        const { container } = renderGroup();
        expect(container.querySelector('ix-checkbox-group')?.hasAttribute('data-state')).toBe(false);
    });

    it('legend får ix-sr-only-klasse ved hideLegend', () => {
        const { container } = renderGroup({ hideLegend: true });
        const legend = container.querySelector('span[data-field="legend"]');
        expect(legend?.classList.contains('ix-sr-only')).toBe(true);
    });

    it('setter className på ix-checkbox-group', () => {
        const { container } = renderGroup({ className: 'min-klasse' });
        expect(container.querySelector('ix-checkbox-group')?.classList.contains('min-klasse')).toBe(true);
    });

    it('rendrer barn inni items-container', () => {
        const { container } = renderGroup();
        const items = container.querySelector('[data-field="items"]');
        expect(items?.querySelectorAll('input[type="checkbox"]').length).toBe(3);
    });

    describe('flervalg (array-state)', () => {
        it('styrer avkryssede alternativer via value (kontrollert)', () => {
            const { container } = renderGroup({ value: ['epost', 'telefon'], onChange: vi.fn() });
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            expect(inputs[0].checked).toBe(true);
            expect(inputs[1].checked).toBe(false);
            expect(inputs[2].checked).toBe(true);
        });

        // NB: på en KONTROLLERT checkbox holder React `checked`-propen, så
        // `event.target.checked` er upålitelig i jsdom (React restaurerer state).
        // Vi asserter derfor kun target.value her; checked verifiseres i register-
        // /uncontrolled-modus der DOM-toggelen er ekte (som RadioGroup gjør for value).
        it('videresender ekte change-event (target.value) når et valg legges til', () => {
            const onChange = vi.fn();
            const { container } = renderGroup({ value: ['epost'], onChange });
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            fireEvent.click(inputs[1]);
            expect(firstEvent(onChange).target.value).toBe('sms');
        });

        it('videresender ekte change-event (target.value) når et valg fjernes', () => {
            const onChange = vi.fn();
            const { container } = renderGroup({ value: ['epost', 'sms'], onChange });
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            fireEvent.click(inputs[0]);
            expect(firstEvent(onChange).target.value).toBe('epost');
        });

        it('ukontrollert: defaultValue krysser av riktige valg', () => {
            const { container } = renderGroup({ defaultValue: ['sms'] });
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            expect(inputs[1].checked).toBe(true);
        });

        it('ukontrollert: klikk toggler intern array-state', () => {
            const { container } = renderGroup({ defaultValue: [] });
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            fireEvent.click(inputs[0]);
            expect(inputs[0].checked).toBe(true);
            fireEvent.click(inputs[0]);
            expect(inputs[0].checked).toBe(false);
        });
    });

    describe('register-modus (ref satt)', () => {
        it('setter ikke checked fra React når ref er satt (RHF eier checked)', () => {
            const ref = createRef<HTMLInputElement>();
            // defaultValue skal IKKE gi checked i register-modus — RHF styrer det.
            const { container } = renderGroup({ ref, defaultValue: ['sms'] });
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            for (const input of inputs) {
                expect(input.checked).toBe(false);
            }
        });

        it('ruter ref til hver native input (RHF akkumulerer refs)', () => {
            // Callback-ref kalles én gang per input med samme funksjon.
            const seen: HTMLInputElement[] = [];
            const ref = (node: HTMLInputElement | null) => {
                if (node) seen.push(node);
            };
            const { container } = renderGroup({ ref });
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            expect(seen).toHaveLength(inputs.length);
            expect(seen).toEqual(Array.from(inputs));
        });

        it('videresender onBlur til inputene', () => {
            const onBlur = vi.fn();
            const ref = createRef<HTMLInputElement>();
            const { container } = renderGroup({ ref, onBlur });
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            fireEvent.blur(inputs[0]);
            expect(onBlur).toHaveBeenCalledTimes(1);
        });

        it('onChange får ekte event med target.value + checked i register-modus', () => {
            const onChange = vi.fn();
            const ref = createRef<HTMLInputElement>();
            const { container } = renderGroup({ ref, onChange });
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            fireEvent.click(inputs[2]);
            expect(firstEvent(onChange).target.value).toBe('telefon');
            expect(firstEvent(onChange).target.checked).toBe(true);
        });

        it('kontrollert value vinner over ref (ref slår ikke på register-modus)', () => {
            // Konsument som styrer verdien selv OG holder en ref (f.eks. for fokus/scroll):
            // `value` skal fortsatt styre checked, ikke ignoreres til fordel for register.
            const ref = createRef<HTMLInputElement>();
            const { container } = renderGroup({ ref, value: ['sms'], onChange: vi.fn() });
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            expect(inputs[0].checked).toBe(false);
            expect(inputs[1].checked).toBe(true);
            expect(inputs[2].checked).toBe(false);
        });
    });

    it('propagerer name fra host til alle inputs (via WC)', () => {
        const { container } = renderGroup({ name: 'kontakt' });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        for (const input of inputs) {
            expect(input.name).toBe('kontakt');
        }
    });

    it('disabled-attributtet på host propagerer til alle inputs (via WC)', () => {
        const { container } = renderGroup({ disabled: true });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        for (const input of inputs) {
            expect(input.disabled).toBe(true);
        }
    });

    it('setter readonly-attributt på ix-checkbox-group host', () => {
        const { container } = renderGroup({ readOnly: true });
        expect(container.querySelector('ix-checkbox-group')?.hasAttribute('readonly')).toBe(true);
    });

    describe('options-prop', () => {
        it('rendrer en CheckboxButton per option', () => {
            const { container } = render(
                <CheckboxGroup
                    legend="Velg"
                    options={[
                        { value: 'a', label: 'A' },
                        { value: 'b', label: 'B' },
                    ]}
                />
            );
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            expect(inputs.length).toBe(2);
            expect(inputs[0].value).toBe('a');
        });

        it('kontrollert value/onChange virker med options', () => {
            const onChange = vi.fn();
            const { container } = render(
                <CheckboxGroup
                    legend="Velg"
                    value={['b']}
                    onChange={onChange}
                    options={[
                        { value: 'a', label: 'A' },
                        { value: 'b', label: 'B' },
                    ]}
                />
            );
            const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
            expect(inputs[1].checked).toBe(true);
            fireEvent.click(inputs[0]);
            expect(firstEvent(onChange).target.value).toBe('a');
        });
    });
});
