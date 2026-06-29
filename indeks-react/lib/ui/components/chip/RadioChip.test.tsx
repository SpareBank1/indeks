import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RadioChip } from './RadioChip';
import { RadioChipGroup } from './RadioChipGroup';

function renderGroup(props?: Partial<Parameters<typeof RadioChipGroup>[0]>) {
    return render(
        <RadioChipGroup legend="Velg periode" {...props}>
            <RadioChip value="1m" label="1 måned" />
            <RadioChip value="3m" label="3 måneder" />
            <RadioChip value="12m" label="12 måneder" />
        </RadioChipGroup>
    );
}

describe('RadioChipGroup', () => {
    it('rendrer ix-radio-group med data-variant="chip"', () => {
        const { container } = renderGroup();
        const host = container.querySelector('ix-radio-group');
        expect(host).not.toBeNull();
        expect(host?.getAttribute('data-variant')).toBe('chip');
    });

    it('setter data-size="sm" ved size="sm"', () => {
        const { container } = renderGroup({ size: 'sm' });
        const host = container.querySelector('ix-radio-group');
        expect(host?.getAttribute('data-size')).toBe('sm');
    });

    it('setter ikke data-size ved default (md)', () => {
        const { container } = renderGroup();
        const host = container.querySelector('ix-radio-group');
        expect(host?.hasAttribute('data-size')).toBe(false);
    });

    it('rendrer ett radio-input + label per RadioChip', () => {
        const { container } = renderGroup();
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        expect(inputs).toHaveLength(3);
        expect(inputs[0].value).toBe('1m');
        const labels = container.querySelectorAll('label');
        expect(Array.from(labels).map((l) => l.textContent)).toEqual([
            '1 måned',
            '3 måneder',
            '12 måneder',
        ]);
    });

    it('alle inputs deler samme name (gjensidig utelukkelse)', () => {
        const { container } = renderGroup({ name: 'periode' });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        for (const input of inputs) {
            expect(input.name).toBe('periode');
        }
    });

    it('styrer valgt chip via value (kontrollert)', () => {
        const { container } = renderGroup({ value: '3m', onChange: vi.fn() });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        expect(inputs[0].checked).toBe(false);
        expect(inputs[1].checked).toBe(true);
        expect(inputs[2].checked).toBe(false);
    });

    it('kaller onChange med riktig value ved klikk', () => {
        const onChange = vi.fn();
        const { container } = renderGroup({ value: '1m', onChange });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        fireEvent.click(inputs[2]);
        expect(onChange).toHaveBeenCalledWith('12m');
    });

    it('oppdaterer valgt chip ukontrollert via defaultValue', () => {
        const { container } = renderGroup({ defaultValue: '1m' });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        expect(inputs[0].checked).toBe(true);
        fireEvent.click(inputs[1]);
        expect(inputs[1].checked).toBe(true);
        expect(inputs[0].checked).toBe(false);
    });

    it('disabled på gruppe propagerer til alle inputs (via WC)', () => {
        const { container } = renderGroup({ disabled: true });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        for (const input of inputs) {
            expect(input.disabled).toBe(true);
        }
    });
});
