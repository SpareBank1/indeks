import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
