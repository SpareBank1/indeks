import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { createElement } from 'react';
import { ProgressBar } from './ProgressBar';

function host(container: HTMLElement): HTMLElement {
    return container.querySelector('ix-progress-bar')!;
}

describe('ProgressBar', () => {
    it('rendrer ix-progress-bar med ix-progress-bar-klassen', () => {
        const { container } = render(createElement(ProgressBar, { value: 25 }));
        const el = host(container);
        expect(el).toBeTruthy();
        expect(el.classList.contains('ix-progress-bar')).toBe(true);
    });

    it('videresender className til host', () => {
        const { container } = render(createElement(ProgressBar, { value: 25, className: 'custom' }));
        expect(host(container).classList.contains('custom')).toBe(true);
    });

    it('setter value-attributtet', () => {
        const { container } = render(createElement(ProgressBar, { value: 25 }));
        expect(host(container).getAttribute('value')).toBe('25');
    });

    it('utelater data-state for active (default)', () => {
        const { container } = render(createElement(ProgressBar, { value: 25 }));
        expect(host(container).hasAttribute('data-state')).toBe(false);
    });

    it('setter data-state=success', () => {
        const { container } = render(createElement(ProgressBar, { value: 100, state: 'success' }));
        expect(host(container).getAttribute('data-state')).toBe('success');
    });

    it('setter data-state=error', () => {
        const { container } = render(createElement(ProgressBar, { value: 60, state: 'error' }));
        expect(host(container).getAttribute('data-state')).toBe('error');
    });

    it('setter label-attributtet', () => {
        const { container } = render(createElement(ProgressBar, { value: 25, label: 'Laster opp' }));
        expect(host(container).getAttribute('label')).toBe('Laster opp');
    });

    it('mapper supportText til data-support-text', () => {
        const { container } = render(createElement(ProgressBar, { value: 25, supportText: 'Vent litt' }));
        expect(host(container).getAttribute('data-support-text')).toBe('Vent litt');
    });

    it('mapper showValue til data-show-value når true', () => {
        const { container } = render(createElement(ProgressBar, { value: 25, showValue: true }));
        expect(host(container).hasAttribute('data-show-value')).toBe(true);
    });

    it('utelater data-show-value når false', () => {
        const { container } = render(createElement(ProgressBar, { value: 25, showValue: false }));
        expect(host(container).hasAttribute('data-show-value')).toBe(false);
    });

    it('mapper valueText til data-value-text', () => {
        const { container } = render(createElement(ProgressBar, { value: 25, valueText: '25 av 100' }));
        expect(host(container).getAttribute('data-value-text')).toBe('25 av 100');
    });

    it('lar web componenten sette role=progressbar i active', () => {
        const { container } = render(createElement(ProgressBar, { value: 25 }));
        expect(host(container).getAttribute('role')).toBe('progressbar');
        expect(host(container).getAttribute('aria-valuenow')).toBe('25');
    });

    it('lar web componenten fjerne role i success', () => {
        const { container } = render(createElement(ProgressBar, { value: 100, state: 'success' }));
        expect(host(container).hasAttribute('role')).toBe(false);
        expect(host(container).getAttribute('data-status')).toBe('success');
    });
});
