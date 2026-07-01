import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RemovableChip } from './RemovableChip';

describe('RemovableChip', () => {
    it('skal rendre som button med ix-chip og data-removable', () => {
        render(<RemovableChip removeLabel="fjern">Sparing</RemovableChip>);
        const chip = screen.getByRole('button', { name: 'Sparing fjern' });
        expect(chip.tagName).toBe('BUTTON');
        expect(chip.classList).toContain('ix-chip');
        expect(chip.hasAttribute('data-removable')).toBe(true);
    });

    it('skal sette tilgjengelig navn som "{label} {removeLabel}"', () => {
        render(<RemovableChip removeLabel="fjern">Sparing</RemovableChip>);
        const chip = screen.getByRole('button', { name: 'Sparing fjern' });
        expect(chip.getAttribute('aria-label')).toBe('Sparing fjern');
    });

    it('skal sette type=button som standard', () => {
        render(<RemovableChip removeLabel="fjern">Sparing</RemovableChip>);
        const chip = screen.getByRole('button', { name: 'Sparing fjern' });
        expect(chip.getAttribute('type')).toBe('button');
    });

    it('skal kalle både onRemove og onClick ved klikk', () => {
        const onRemove = vi.fn();
        const onClick = vi.fn();
        render(
            <RemovableChip removeLabel="fjern" onRemove={onRemove} onClick={onClick}>
                Sparing
            </RemovableChip>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Sparing fjern' }));
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('skal kalle onRemove uten at onClick er satt', () => {
        const onRemove = vi.fn();
        render(
            <RemovableChip removeLabel="fjern" onRemove={onRemove}>
                Sparing
            </RemovableChip>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Sparing fjern' }));
        expect(onRemove).toHaveBeenCalledTimes(1);
    });
});

describe('RemovableChip størrelser', () => {
    it('skal ikke sette data-size for medium (standard)', () => {
        render(<RemovableChip removeLabel="fjern">Sparing</RemovableChip>);
        const chip = screen.getByRole('button', { name: 'Sparing fjern' });
        expect(chip.hasAttribute('data-size')).toBe(false);
    });

    it('skal sette data-size=sm', () => {
        render(
            <RemovableChip size="sm" removeLabel="fjern">
                Sparing
            </RemovableChip>
        );
        const chip = screen.getByRole('button', { name: 'Sparing fjern' });
        expect(chip.getAttribute('data-size')).toBe('sm');
    });
});

describe('RemovableChip disabled-tilstand', () => {
    it('skal ha disabled-attributt når disabled=true', () => {
        render(
            <RemovableChip disabled removeLabel="fjern">
                Sparing
            </RemovableChip>
        );
        const chip = screen.getByRole('button', { name: 'Sparing fjern' });
        expect(chip).toHaveProperty('disabled', true);
    });
});
