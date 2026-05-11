import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
    it('rendrer ix-progress-bar som rotelement', () => {
        const { container } = render(<ProgressBar />);
        expect(container.firstElementChild?.tagName.toLowerCase()).toBe('ix-progress-bar');
    });

    it('sender className til rotelement', () => {
        const { container } = render(<ProgressBar className="custom" />);
        const root = container.firstElementChild;
        expect(root?.classList.contains('custom')).toBe(true);
        expect(root?.classList.contains('ix-progress-bar')).toBe(true);
    });

    it('setter state-attributt ved success', () => {
        const { container } = render(<ProgressBar value={100} state="success" />);
        expect(container.firstElementChild?.getAttribute('state')).toBe('success');
    });

    it('setter state-attributt ved error', () => {
        const { container } = render(<ProgressBar value={40} state="error" />);
        expect(container.firstElementChild?.getAttribute('state')).toBe('error');
    });

    it('setter ikke state-attributt ved active', () => {
        const { container } = render(<ProgressBar state="active" />);
        expect(container.firstElementChild?.hasAttribute('state')).toBe(false);
    });

    it('setter ikke state-attributt uten state-prop', () => {
        const { container } = render(<ProgressBar />);
        expect(container.firstElementChild?.hasAttribute('state')).toBe(false);
    });

    it('rendrer progress-element med korrekt value og max', () => {
        const { container } = render(<ProgressBar value={65} />);
        const progress = container.querySelector('progress');
        expect(progress).not.toBeNull();
        expect(progress?.getAttribute('value')).toBe('65');
        expect(progress?.getAttribute('max')).toBe('100');
    });

    it('rendrer label-element når label-prop er satt', () => {
        const { container } = render(<ProgressBar value={65} label="Laster opp dokumenter" />);
        const label = container.querySelector('label');
        expect(label).not.toBeNull();
        expect(label?.textContent).toBe('Laster opp dokumenter');
    });

    it('rendrer ikke label-element når label-prop mangler', () => {
        const { container } = render(<ProgressBar value={65} />);
        expect(container.querySelector('label')).toBeNull();
    });

    it('kobler label til progress via htmlFor/id', () => {
        const { container } = render(<ProgressBar value={65} label="Laster opp" />);
        const label = container.querySelector('label');
        const progress = container.querySelector('progress');
        expect(label?.htmlFor).toBeTruthy();
        expect(label?.htmlFor).toBe(progress?.id);
    });

    it('setter ingen id på progress når label mangler', () => {
        const { container } = render(<ProgressBar value={65} />);
        expect(container.querySelector('progress')?.id).toBeFalsy();
    });

    it('clammer value over 100 til 100', () => {
        const { container } = render(<ProgressBar value={150} />);
        expect(container.querySelector('progress')?.getAttribute('value')).toBe('100');
    });

    it('clammer value under 0 til 0', () => {
        const { container } = render(<ProgressBar value={-10} />);
        expect(container.querySelector('progress')?.getAttribute('value')).toBe('0');
    });

    it('videresender native props til rotelement', () => {
        const { container } = render(<ProgressBar id="min-bar" data-testid="bar" />);
        const root = container.firstElementChild;
        expect(root?.getAttribute('id')).toBe('min-bar');
        expect(root?.getAttribute('data-testid')).toBe('bar');
    });
});
