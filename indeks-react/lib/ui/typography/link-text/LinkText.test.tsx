import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LinkText } from './LinkText';

describe('LinkText', () => {
    it('has neither data-active nor data-no-underline by default', () => {
        const { container } = render(<LinkText href="#">Lenke</LinkText>);
        const a = container.querySelector('a.ix-link-text')!;
        expect(a.hasAttribute('data-active')).toBe(false);
        expect(a.hasAttribute('data-no-underline')).toBe(false);
    });

    it('sets data-active when isActive', () => {
        const { container } = render(<LinkText href="#" isActive>Lenke</LinkText>);
        expect(container.querySelector('a')?.hasAttribute('data-active')).toBe(true);
    });

    it('sets data-no-underline when underline is false', () => {
        const { container } = render(<LinkText href="#" underline={false}>Lenke</LinkText>);
        expect(container.querySelector('a')?.hasAttribute('data-no-underline')).toBe(true);
    });

    it('has only the block class besides className', () => {
        const { container } = render(<LinkText href="#" isActive underline={false} className="custom">Lenke</LinkText>);
        expect(container.querySelector('a')?.className).toBe('ix-link-text custom');
    });
});
