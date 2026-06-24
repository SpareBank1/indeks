import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { Accordion } from './Accordion';

function renderBasic() {
    return render(
        <Accordion>
            <Accordion.Item>
                <Accordion.Header>Tittel 1</Accordion.Header>
                <Accordion.Content>Innhold 1</Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
                <Accordion.Header>Tittel 2</Accordion.Header>
                <Accordion.Content>Innhold 2</Accordion.Content>
            </Accordion.Item>
        </Accordion>,
    );
}

function details(container: HTMLElement): HTMLDetailsElement[] {
    return Array.from(container.querySelectorAll('details'));
}

describe('Accordion', () => {
    it('rendrer en .ix-accordion-container med seksjoner', () => {
        const { container } = renderBasic();
        const root = container.firstElementChild!;
        expect(root.tagName.toLowerCase()).toBe('div');
        expect(root.classList.contains('ix-accordion')).toBe(true);
        expect(details(container)).toHaveLength(2);
    });

    it('rendrer Header som <summary> (første barn) og Content som .ix-accordion__content', () => {
        const { container } = renderBasic();
        const firstItem = details(container)[0];
        const summary = firstItem.firstElementChild!;
        expect(summary.tagName.toLowerCase()).toBe('summary');
        expect(summary.classList.contains('ix-accordion__header')).toBe(true);
        expect(firstItem.querySelector('.ix-accordion__content')?.textContent).toBe('Innhold 1');
    });

    it('seksjonene er uavhengige — flere kan være åpne samtidig', () => {
        const { container } = render(
            <Accordion>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Tittel 1</Accordion.Header>
                    <Accordion.Content>Innhold 1</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Tittel 2</Accordion.Header>
                    <Accordion.Content>Innhold 2</Accordion.Content>
                </Accordion.Item>
            </Accordion>,
        );
        const [a, b] = details(container);
        expect(a.open).toBe(true);
        expect(b.open).toBe(true);
    });

    it('åpner seksjonen med defaultOpen', () => {
        const { container } = render(
            <Accordion>
                <Accordion.Item defaultOpen>
                    <Accordion.Header>Tittel</Accordion.Header>
                    <Accordion.Content>Innhold</Accordion.Content>
                </Accordion.Item>
            </Accordion>,
        );
        expect(details(container)[0].open).toBe(true);
    });

    it('sender className videre til rot-elementet', () => {
        const { container } = render(
            <Accordion className="custom">
                <Accordion.Item>
                    <Accordion.Header>T</Accordion.Header>
                    <Accordion.Content>I</Accordion.Content>
                </Accordion.Item>
            </Accordion>,
        );
        expect(container.firstElementChild?.classList.contains('custom')).toBe(true);
    });

    it('forwarder ref til rot-elementet', () => {
        const ref = createRef<HTMLDivElement>();
        render(
            <Accordion ref={ref}>
                <Accordion.Item>
                    <Accordion.Header>T</Accordion.Header>
                    <Accordion.Content>I</Accordion.Content>
                </Accordion.Item>
            </Accordion>,
        );
        expect(ref.current?.classList.contains('ix-accordion')).toBe(true);
    });

    it('Header støtter ReactNode (f.eks. prefiks-ikon)', () => {
        render(
            <Accordion>
                <Accordion.Item>
                    <Accordion.Header>
                        <span data-testid="ikon" /> Tittel
                    </Accordion.Header>
                    <Accordion.Content>Innhold</Accordion.Content>
                </Accordion.Item>
            </Accordion>,
        );
        expect(screen.getByTestId('ikon')).toBeTruthy();
        expect(screen.getByText(/Tittel/)).toBeTruthy();
    });
});
