import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { ReadMore } from './ReadMore';

describe('ReadMore', () => {
    it('rendrer et <details>.ix-read-more med label og innhold', () => {
        const { container } = render(<ReadMore label="Les mer">Innhold</ReadMore>);
        const root = container.firstElementChild!;
        expect(root.tagName.toLowerCase()).toBe('details');
        expect(root.classList.contains('ix-read-more')).toBe(true);
        expect(root.querySelector('.ix-read-more__content')?.textContent).toBe('Innhold');
    });

    it('rendrer label som <summary> (første barn)', () => {
        const { container } = render(<ReadMore label="Les mer">Innhold</ReadMore>);
        const summary = container.firstElementChild!.firstElementChild!;
        expect(summary.tagName.toLowerCase()).toBe('summary');
        expect(summary.textContent).toBe('Les mer');
    });

    it('er lukket som standard', () => {
        const { container } = render(<ReadMore label="Les mer">Innhold</ReadMore>);
        expect((container.firstElementChild as HTMLDetailsElement).open).toBe(false);
    });

    it('åpner seksjonen med defaultOpen', () => {
        const { container } = render(
            <ReadMore label="Les mer" defaultOpen>
                Innhold
            </ReadMore>,
        );
        expect((container.firstElementChild as HTMLDetailsElement).open).toBe(true);
    });

    it('sender className videre til rot-elementet', () => {
        const { container } = render(
            <ReadMore label="Les mer" className="custom">
                Innhold
            </ReadMore>,
        );
        expect(container.firstElementChild?.classList.contains('custom')).toBe(true);
    });

    it('forwarder ref til rot-elementet', () => {
        const ref = createRef<HTMLDetailsElement>();
        render(
            <ReadMore ref={ref} label="Les mer">
                Innhold
            </ReadMore>,
        );
        expect(ref.current?.classList.contains('ix-read-more')).toBe(true);
    });

    it('label støtter ReactNode (f.eks. prefiks-ikon)', () => {
        render(
            <ReadMore
                label={
                    <>
                        <span data-testid="ikon" /> Les mer
                    </>
                }
            >
                Innhold
            </ReadMore>,
        );
        expect(screen.getByTestId('ikon')).toBeTruthy();
        expect(screen.getByText(/Les mer/)).toBeTruthy();
    });
});
