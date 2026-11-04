import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Text } from './Text';

describe('Text', () => {
    it('has no data-long by default', () => {
        const { container } = render(<Text>Tekst</Text>);
        expect(container.querySelector('p.ix-text')?.hasAttribute('data-long')).toBe(false);
    });

    it('sets data-long when long', () => {
        const { container } = render(<Text long>Tekst</Text>);
        expect(container.querySelector('p')?.hasAttribute('data-long')).toBe(true);
    });

    it('keeps ix-mb-md for addRecommendedSpacing', () => {
        const { container } = render(<Text long addRecommendedSpacing className="custom">Tekst</Text>);
        expect(container.querySelector('p')?.className).toBe('ix-text ix-mb-md custom');
    });
});
