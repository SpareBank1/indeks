import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { createElement } from 'react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
    it('setter role=status', () => {
        const { container } = render(createElement(Spinner));
        expect(container.querySelector('[role="status"]')).toBeTruthy();
    });

    it('bruker standard aria-label når ingenting er angitt', () => {
        const { container } = render(createElement(Spinner));
        expect(container.querySelector('[aria-label="Laster..."]')).toBeTruthy();
    });

    it('bruker label som aria-label når loadingLabel ikke er satt', () => {
        const { container } = render(createElement(Spinner, { label: 'Henter data...' }));
        expect(container.querySelector('[aria-label="Henter data..."]')).toBeTruthy();
    });

    it('bruker loadingLabel over label', () => {
        const { container } = render(createElement(Spinner, { label: 'Henter data...', loadingLabel: 'Vennligst vent' }));
        expect(container.querySelector('[aria-label="Vennligst vent"]')).toBeTruthy();
    });

    it('setter data-size', () => {
        const { container } = render(createElement(Spinner, { size: 'lg' }));
        expect(container.querySelector('[data-size="lg"]')).toBeTruthy();
    });

    it('rendrer label som tekst', () => {
        const { getByRole } = render(createElement(Spinner, { label: 'Laster inn...' }));
        expect(getByRole('status').textContent).toBe('Laster inn...');
    });
});
