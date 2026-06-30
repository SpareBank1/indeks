import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CheckboxChip } from './CheckboxChip';
import { CheckboxChipGroup } from './CheckboxChipGroup';

function renderGroup(props?: Partial<Parameters<typeof CheckboxChipGroup>[0]>) {
    return render(
        <CheckboxChipGroup legend="Velg interesser" {...props}>
            <CheckboxChip value="sport" label="Sport" />
            <CheckboxChip value="musikk" label="Musikk" />
            <CheckboxChip value="reise" label="Reise" />
        </CheckboxChipGroup>
    );
}

describe('CheckboxChipGroup', () => {
    it('rendrer ix-checkbox-group med data-variant="chip"', () => {
        const { container } = renderGroup();
        const host = container.querySelector('ix-checkbox-group');
        expect(host).not.toBeNull();
        expect(host?.getAttribute('data-variant')).toBe('chip');
    });

    it('setter data-size="sm" ved size="sm"', () => {
        const { container } = renderGroup({ size: 'sm' });
        const host = container.querySelector('ix-checkbox-group');
        expect(host?.getAttribute('data-size')).toBe('sm');
    });

    it('setter ikke data-size ved default (md)', () => {
        const { container } = renderGroup();
        const host = container.querySelector('ix-checkbox-group');
        expect(host?.hasAttribute('data-size')).toBe(false);
    });

    it('rendrer ett checkbox-input + label per CheckboxChip', () => {
        const { container } = renderGroup();
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        expect(inputs).toHaveLength(3);
        expect(inputs[0].value).toBe('sport');
        const labels = container.querySelectorAll('label');
        expect(Array.from(labels).map((l) => l.textContent)).toEqual(['Sport', 'Musikk', 'Reise']);
    });

    it('alle inputs deler samme name når name er satt', () => {
        const { container } = renderGroup({ name: 'interesser' });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        for (const input of inputs) {
            expect(input.name).toBe('interesser');
        }
    });

    it('styrer valgte chips via value-array (kontrollert) — flere samtidig', () => {
        const { container } = renderGroup({ value: ['sport', 'reise'], onChange: vi.fn() });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        expect(inputs[0].checked).toBe(true);
        expect(inputs[1].checked).toBe(false);
        expect(inputs[2].checked).toBe(true);
    });

    it('kaller onChange med oppdatert array ved klikk', () => {
        const onChange = vi.fn();
        const { container } = renderGroup({ value: ['sport'], onChange });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        fireEvent.click(inputs[1]);
        expect(onChange).toHaveBeenCalledWith(['sport', 'musikk']);
    });

    it('toggler valg av og på ukontrollert via defaultValue', () => {
        const { container } = renderGroup({ defaultValue: ['sport'] });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        expect(inputs[0].checked).toBe(true);
        fireEvent.click(inputs[0]);
        expect(inputs[0].checked).toBe(false);
        fireEvent.click(inputs[1]);
        expect(inputs[1].checked).toBe(true);
    });

    it('disabled på gruppe propagerer til alle inputs (via WC)', () => {
        const { container } = renderGroup({ disabled: true });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        for (const input of inputs) {
            expect(input.disabled).toBe(true);
        }
    });

    it('per-chip disabled deaktiverer kun den ene chipen og merker wrapperen', () => {
        const { container } = render(
            <CheckboxChipGroup legend="Velg interesser">
                <CheckboxChip value="sport" label="Sport" disabled />
                <CheckboxChip value="musikk" label="Musikk" />
                <CheckboxChip value="reise" label="Reise" />
            </CheckboxChipGroup>
        );
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        expect(inputs[0].disabled).toBe(true);
        expect(inputs[1].disabled).toBe(false);
        expect(inputs[2].disabled).toBe(false);
        expect(inputs[0].closest('.ix-checkbox')?.classList.contains('ix-checkbox--disabled')).toBe(
            true
        );
        expect(inputs[1].closest('.ix-checkbox')?.classList.contains('ix-checkbox--disabled')).toBe(
            false
        );
    });

    it('readOnly setter readonly-attributt og data-state="readonly" på gruppen', () => {
        const { container } = renderGroup({ readOnly: true });
        const host = container.querySelector('ix-checkbox-group');
        expect(host?.hasAttribute('readonly')).toBe(true);
        expect(host?.getAttribute('data-state')).toBe('readonly');
    });

    it('errorMessage setter data-state="error" og rendrer meldingen', () => {
        const { container, getByText } = renderGroup({ errorMessage: 'Du må velge minst ett' });
        const host = container.querySelector('ix-checkbox-group');
        expect(host?.getAttribute('data-state')).toBe('error');
        expect(getByText('Du må velge minst ett')).not.toBeNull();
    });
});
