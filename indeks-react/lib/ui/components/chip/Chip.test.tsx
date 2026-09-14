import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Chip } from './Chip';

describe('Chip', () => {
    it('skal rendre som button som standard med riktig className', () => {
        render(<Chip>Chip label</Chip>);
        const chip = screen.getByRole('button', { name: 'Chip label' });
        expect(chip.tagName).toBe('BUTTON');
        expect(chip.classList).toContain('ix-chip');
    });

    it('skal sette type=button som standard på button-element', () => {
        render(<Chip>Chip label</Chip>);
        const chip = screen.getByRole('button', { name: 'Chip label' });
        expect(chip.getAttribute('type')).toBe('button');
    });

    it('skal rendre som lenke når as="a"', () => {
        render(
            <Chip as="a" href="https://example.com">
                Chip label
            </Chip>
        );
        const link = screen.getByRole('link', { name: 'Chip label' });
        expect(link.tagName).toBe('A');
        expect(link.getAttribute('href')).toBe('https://example.com');
        // type-attributtet skal ikke settes på lenker
        expect(link.hasAttribute('type')).toBe(false);
    });

    it('skal videresende ekstra props til elementet', () => {
        render(
            <Chip id="custom-id" data-test="test-value">
                Chip label
            </Chip>
        );
        const chip = screen.getByRole('button', { name: 'Chip label' });
        expect(chip.getAttribute('id')).toBe('custom-id');
        expect(chip.getAttribute('data-test')).toBe('test-value');
    });
});

describe('Chip størrelser', () => {
    it('skal ikke sette data-size for medium (standard)', () => {
        render(<Chip>Chip label</Chip>);
        const chip = screen.getByRole('button', { name: 'Chip label' });
        expect(chip.hasAttribute('data-size')).toBe(false);
    });

    it('skal sette data-size=sm', () => {
        render(<Chip size="sm">Chip label</Chip>);
        const chip = screen.getByRole('button', { name: 'Chip label' });
        expect(chip.getAttribute('data-size')).toBe('sm');
    });
});

describe('Chip disabled-tilstand', () => {
    it('skal ha disabled-attributt når disabled=true', () => {
        render(<Chip disabled>Chip label</Chip>);
        const chip = screen.getByRole('button', { name: 'Chip label' });
        expect(chip).toHaveProperty('disabled', true);
    });
});

describe('Chip error- og read-only-tilstand', () => {
    it('skal ikke sette data-state uten error eller readOnly', () => {
        render(<Chip>Chip label</Chip>);
        const chip = screen.getByRole('button', { name: 'Chip label' });
        expect(chip.hasAttribute('data-state')).toBe(false);
        expect(chip.hasAttribute('aria-disabled')).toBe(false);
    });

    it('skal sette data-state=error når error=true', () => {
        render(<Chip error>Chip label</Chip>);
        const chip = screen.getByRole('button', { name: 'Chip label' });
        expect(chip.getAttribute('data-state')).toBe('error');
        expect(chip.hasAttribute('aria-disabled')).toBe(false);
    });

    it('skal sette data-state=readonly og aria-disabled når readOnly=true', () => {
        render(<Chip readOnly>Chip label</Chip>);
        const chip = screen.getByRole('button', { name: 'Chip label' });
        expect(chip.getAttribute('data-state')).toBe('readonly');
        expect(chip.getAttribute('aria-disabled')).toBe('true');
    });

    it('skal la error slå readOnly når begge er satt', () => {
        render(
            <Chip error readOnly>
                Chip label
            </Chip>
        );
        const chip = screen.getByRole('button', { name: 'Chip label' });
        expect(chip.getAttribute('data-state')).toBe('error');
    });

    it('skal ikke kalle onClick når readOnly=true', () => {
        const onClick = vi.fn();
        render(
            <Chip readOnly onClick={onClick}>
                Chip label
            </Chip>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Chip label' }));
        expect(onClick).not.toHaveBeenCalled();
    });
});
