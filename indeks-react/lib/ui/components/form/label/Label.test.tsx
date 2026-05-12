import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Label } from './Label';

describe('Label', () => {
    it('renders with ix-label class', () => {
        const { container } = render(<Label>E-postadresse</Label>);
        expect(container.querySelector('label.ix-label')).not.toBeNull();
    });

    it('forwards htmlFor to the label element', () => {
        const { container } = render(<Label htmlFor="my-input">Navn</Label>);
        expect(container.querySelector('label')?.htmlFor).toBe('my-input');
    });

    it('merges custom className', () => {
        const { container } = render(<Label className="custom">Tekst</Label>);
        expect(container.querySelector('label')?.className).toBe('ix-label custom');
    });

    it('renders children', () => {
        const { getByText } = render(<Label>Kontonummer</Label>);
        expect(getByText('Kontonummer')).not.toBeNull();
    });
});
