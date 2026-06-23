import { render, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useEffect } from 'react';
import { MessageRegion } from './MessageRegion';
import { useMessageRegion } from './MessageRegionContext';

/** Liten testkonsument som annonserer via context i en effekt. */
function Announcer({
    text,
    announceOnPageLoad = false,
}: {
    text: string;
    announceOnPageLoad?: boolean;
}): null {
    const region = useMessageRegion();
    useEffect(() => {
        region?.announce(text, announceOnPageLoad);
    }, [region, text, announceOnPageLoad]);
    return null;
}

function getRegion(container: HTMLElement): HTMLElement | null {
    return container.querySelector('[aria-live="polite"]');
}

describe('MessageRegion', () => {
    it('rendrer én stabil, tom polite live-region', () => {
        const { container } = render(<MessageRegion />);
        const region = getRegion(container);
        expect(region).not.toBeNull();
        expect(region?.getAttribute('role')).toBe('status');
        expect(region?.getAttribute('aria-atomic')).toBe('false');
        expect(region?.classList.contains('ix-sr-only')).toBe(true);
        expect(region?.textContent).toBe('');
    });

    it('rendrer barna sine uendret', () => {
        const { getByText } = render(
            <MessageRegion>
                <p>Innhold</p>
            </MessageRegion>,
        );
        expect(getByText('Innhold')).toBeTruthy();
    });

    it('annonserer en melding som en egen node i regionen', () => {
        const { container } = render(
            <MessageRegion>
                <Announcer text="Lagret" announceOnPageLoad />
            </MessageRegion>,
        );
        const region = getRegion(container);
        expect(region?.children.length).toBe(1);
        expect(region?.textContent).toBe('Lagret');
    });

    it('legger flere meldinger til som separate noder slik at alle leses', () => {
        const { container } = render(
            <MessageRegion>
                <Announcer text="Feil A" announceOnPageLoad />
                <Announcer text="Feil B" announceOnPageLoad />
                <Announcer text="Feil C" announceOnPageLoad />
            </MessageRegion>,
        );
        const region = getRegion(container);
        expect(region?.children.length).toBe(3);
        expect(Array.from(region?.children ?? []).map((n) => n.textContent)).toEqual([
            'Feil A',
            'Feil B',
            'Feil C',
        ]);
    });

    it('rydder bort en node etter at den er lest', () => {
        vi.useFakeTimers();
        try {
            const { container } = render(
                <MessageRegion>
                    <Announcer text="Lagret" announceOnPageLoad />
                </MessageRegion>,
            );
            const region = getRegion(container);
            expect(region?.children.length).toBe(1);
            act(() => {
                vi.advanceTimersByTime(1000);
            });
            expect(region?.children.length).toBe(0);
        } finally {
            vi.useRealTimers();
        }
    });

    it('er stille ved sidelast uten announceOnPageLoad', () => {
        const { container } = render(
            <MessageRegion>
                <Announcer text="Skal være stille" />
            </MessageRegion>,
        );
        expect(getRegion(container)?.textContent).toBe('');
    });

    it('annonserer ved sidelast når announceOnPageLoad er satt', () => {
        const { container } = render(
            <MessageRegion>
                <Announcer text="SSR-resultat" announceOnPageLoad />
            </MessageRegion>,
        );
        expect(getRegion(container)?.textContent).toBe('SSR-resultat');
    });
});
