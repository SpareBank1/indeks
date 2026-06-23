import { render, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useEffect } from 'react';
import { MessageRegion } from './MessageRegion';
import { useMessageRegion, type MessageAnnounceStatus } from './MessageRegionContext';

/** Vent ut requestAnimationFrame + microtasks slik at clear-then-set fullføres. */
async function flushFrame(): Promise<void> {
    await act(async () => {
        await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    });
}

/** Liten testkonsument som annonserer via context i en effekt. */
function Announcer({
    text,
    status,
    announceOnPageLoad = false,
}: {
    text: string;
    status: MessageAnnounceStatus;
    announceOnPageLoad?: boolean;
}): null {
    const region = useMessageRegion();
    useEffect(() => {
        region?.announce(text, status, announceOnPageLoad);
    }, [region, text, status, announceOnPageLoad]);
    return null;
}

function getPolite(container: HTMLElement): HTMLElement | null {
    return container.querySelector('[aria-live="polite"]');
}

function getAssertive(container: HTMLElement): HTMLElement | null {
    return container.querySelector('[aria-live="assertive"]');
}

describe('MessageRegion', () => {
    it('rendrer to stabile, tomme live-regioner (polite + assertive)', () => {
        const { container } = render(<MessageRegion />);
        const polite = getPolite(container);
        const assertive = getAssertive(container);
        expect(polite).not.toBeNull();
        expect(assertive).not.toBeNull();
        expect(polite?.getAttribute('role')).toBe('status');
        expect(assertive?.getAttribute('role')).toBe('alert');
        expect(polite?.getAttribute('aria-atomic')).toBe('true');
        expect(assertive?.getAttribute('aria-atomic')).toBe('true');
        expect(polite?.classList.contains('ix-sr-only')).toBe(true);
        expect(polite?.textContent).toBe('');
        expect(assertive?.textContent).toBe('');
    });

    it('rendrer barna sine uendret', () => {
        const { getByText } = render(
            <MessageRegion>
                <p>Innhold</p>
            </MessageRegion>,
        );
        expect(getByText('Innhold')).toBeTruthy();
    });

    it('annonserer info/success i polite-regionen', async () => {
        const { container } = render(
            <MessageRegion>
                <Announcer text="Lagret" status="success" announceOnPageLoad />
            </MessageRegion>,
        );
        await flushFrame();
        expect(getPolite(container)?.textContent).toBe('Lagret');
        expect(getAssertive(container)?.textContent).toBe('');
    });

    it('annonserer warning/danger i assertive-regionen', async () => {
        const { container } = render(
            <MessageRegion>
                <Announcer text="Betalingen feilet" status="danger" announceOnPageLoad />
            </MessageRegion>,
        );
        await flushFrame();
        expect(getAssertive(container)?.textContent).toBe('Betalingen feilet');
        expect(getPolite(container)?.textContent).toBe('');
    });

    it('er stille ved sidelast uten announceOnPageLoad', async () => {
        const { container } = render(
            <MessageRegion>
                <Announcer text="Skal være stille" status="info" />
            </MessageRegion>,
        );
        await flushFrame();
        expect(getPolite(container)?.textContent).toBe('');
    });

    it('annonserer ved sidelast når announceOnPageLoad er satt', async () => {
        const { container } = render(
            <MessageRegion>
                <Announcer text="SSR-resultat" status="info" announceOnPageLoad />
            </MessageRegion>,
        );
        await flushFrame();
        expect(getPolite(container)?.textContent).toBe('SSR-resultat');
    });
});
