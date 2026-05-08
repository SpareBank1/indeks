import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
    it('rendrer uten feil', () => {
        const { container } = render(<ProgressBar />);
        expect(container.querySelector('ix-progress-bar')).not.toBeNull();
    });

    it('bruker ix-progress-bar som rotelement', () => {
        const { container } = render(<ProgressBar />);
        expect(container.firstElementChild?.tagName.toLowerCase()).toBe('ix-progress-bar');
    });

    it('sender className til rotelement', () => {
        const { container } = render(<ProgressBar className="custom" />);
        const root = container.firstElementChild;
        expect(root?.classList.contains('custom')).toBe(true);
        expect(root?.classList.contains('ix-progress-bar')).toBe(true);
    });

    it('sender data-state til rotelement', () => {
        const { container } = render(<ProgressBar state="success" />);
        const root = container.firstElementChild;
        expect(root?.getAttribute('data-state')).toBe('success');
    });

    it('defaulter data-state til active', () => {
        const { container } = render(<ProgressBar />);
        const root = container.firstElementChild;
        expect(root?.getAttribute('data-state')).toBe('active');
    });

    it('sender value-attributt til ix-progress-bar', () => {
        const { container } = render(<ProgressBar value={65} />);
        const root = container.firstElementChild;
        expect(root?.getAttribute('value')).toBe('65');
    });

    it('clammer value over 100 til 100', () => {
        const { container } = render(<ProgressBar value={150} />);
        const root = container.firstElementChild;
        expect(root?.getAttribute('value')).toBe('100');
    });

    it('clammer value under 0 til 0', () => {
        const { container } = render(<ProgressBar value={-10} />);
        const root = container.firstElementChild;
        expect(root?.getAttribute('value')).toBe('0');
    });

    it('sender label-attributt til ix-progress-bar', () => {
        const { container } = render(<ProgressBar label="Laster opp dokumenter" />);
        const root = container.firstElementChild;
        expect(root?.getAttribute('label')).toBe('Laster opp dokumenter');
    });

    it('sender data-support-text-attributt til ix-progress-bar', () => {
        const { container } = render(<ProgressBar supportText="65 % fullført" />);
        const root = container.firstElementChild;
        expect(root?.getAttribute('data-support-text')).toBe('65 % fullført');
    });

    it('videresender native props til rotelement', () => {
        const { container } = render(<ProgressBar id="min-bar" data-testid="bar" />);
        const root = container.firstElementChild;
        expect(root?.getAttribute('id')).toBe('min-bar');
        expect(root?.getAttribute('data-testid')).toBe('bar');
    });
});
