import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Divider } from './Divider';

describe('Divider', () => {
    it('skal rendre som hr med klassen ix-divider og uten data-variant som standard', () => {
        render(<Divider />);
        const divider = screen.getByRole('separator');
        expect(divider.tagName).toBe('HR');
        expect(divider.classList).toContain('ix-divider');
        expect(divider.hasAttribute('data-variant')).toBe(false);
        expect(divider.hasAttribute('role')).toBe(false);
    });

    it('skal sette data-variant="emphasis" for Emphasis-varianten', () => {
        render(<Divider variant="emphasis" />);
        expect(screen.getByRole('separator').getAttribute('data-variant')).toBe('emphasis');
    });

    it('skal sette role="separator" når elementet ikke er hr', () => {
        render(<Divider as="div" />);
        const divider = screen.getByRole('separator');
        expect(divider.tagName).toBe('DIV');
        expect(divider.getAttribute('role')).toBe('separator');
    });

    it('skal slå sammen className med ix-divider', () => {
        render(<Divider className="egen" />);
        expect(screen.getByRole('separator').className).toBe('ix-divider egen');
    });
});
