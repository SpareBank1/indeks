import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { SystemMessage } from './SystemMessage';
import { MessageRegion } from '../message-region/MessageRegion';

function getRegion(container: HTMLElement): HTMLElement | null {
    return container.querySelector('[aria-live="polite"]');
}

describe('SystemMessage', () => {
    // <SystemMessage> uten <MessageRegion> advarer i dev — demp støy.
    let warnSpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });
    afterEach(() => {
        warnSpy.mockRestore();
    });

    it('rendrer body-tekst og ix-system-message-klasse', () => {
        const { container } = render(<SystemMessage status="info">Driftsmelding</SystemMessage>);
        const root = container.firstElementChild;
        expect(root?.classList.contains('ix-system-message')).toBe(true);
        expect(screen.getByText('Driftsmelding')).toBeTruthy();
    });

    it('setter data-status', () => {
        const { container } = render(<SystemMessage status="warning">Tekst</SystemMessage>);
        expect(container.firstElementChild?.getAttribute('data-status')).toBe('warning');
    });

    it('har data-placement="inline" som standard', () => {
        const { container } = render(<SystemMessage status="info">Tekst</SystemMessage>);
        expect(container.firstElementChild?.getAttribute('data-placement')).toBe('inline');
    });

    it('setter data-placement="top" når placement er top', () => {
        const { container } = render(
            <SystemMessage status="info" placement="top">
                Tekst
            </SystemMessage>,
        );
        expect(container.firstElementChild?.getAttribute('data-placement')).toBe('top');
    });

    it('rendrer et dekorativt statusikon (ix-icon[data-badge] med aria-hidden) som første barn', () => {
        const { container } = render(<SystemMessage status="info">Tekst</SystemMessage>);
        const icon = container.firstElementChild?.firstElementChild;
        expect(icon?.tagName.toLowerCase()).toBe('ix-icon');
        expect(icon?.hasAttribute('data-badge')).toBe(true);
        expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('sender className videre til rot-elementet', () => {
        const { container } = render(
            <SystemMessage status="info" className="custom">
                Tekst
            </SystemMessage>,
        );
        expect(container.firstElementChild?.classList.contains('custom')).toBe(true);
    });

    it('forwarder ref til rot-elementet', () => {
        const ref = createRef<HTMLDivElement>();
        render(
            <SystemMessage status="info" ref={ref}>
                Tekst
            </SystemMessage>,
        );
        expect(ref.current?.classList.contains('ix-system-message')).toBe(true);
    });

    describe('lukkeknapp', () => {
        it('viser ikke lukkeknapp uten closeLabel', () => {
            render(<SystemMessage status="info">Tekst</SystemMessage>);
            expect(screen.queryByRole('button')).toBeNull();
        });

        it('viser lukkeknapp med aria-label og kaller onClose ved klikk', () => {
            const onClose = vi.fn();
            render(
                <SystemMessage status="info" closeLabel="Lukk melding" onClose={onClose}>
                    Tekst
                </SystemMessage>,
            );
            fireEvent.click(screen.getByRole('button', { name: 'Lukk melding' }));
            expect(onClose).toHaveBeenCalledOnce();
        });

        it('skjuler meldingen når lukkeknappen klikkes', () => {
            render(
                <SystemMessage status="info" closeLabel="Lukk melding">
                    Tekst
                </SystemMessage>,
            );
            expect(screen.getByText('Tekst')).toBeTruthy();
            fireEvent.click(screen.getByRole('button', { name: 'Lukk melding' }));
            expect(screen.queryByText('Tekst')).toBeNull();
        });
    });

    describe('annonsering', () => {
        it('setter ikke role på det synlige elementet uten critical', () => {
            const { container } = render(<SystemMessage status="info">Tekst</SystemMessage>);
            expect(container.firstElementChild?.hasAttribute('role')).toBe(false);
        });

        it('setter role="alert" når critical er satt', () => {
            const { container } = render(
                <SystemMessage status="danger" critical>
                    Nettbanken er nede
                </SystemMessage>,
            );
            expect(container.firstElementChild?.getAttribute('role')).toBe('alert');
        });

        it('annonserer den synlige teksten i polite-regionen (med announceOnPageLoad)', () => {
            const { container } = render(
                <MessageRegion>
                    <SystemMessage status="success" announceOnPageLoad>
                        Endringene er lagret
                    </SystemMessage>
                </MessageRegion>,
            );
            expect(getRegion(container)?.textContent).toBe('Endringene er lagret');
        });

        it('skriver ikke til polite-regionen når critical er satt (unngår dobbel opplesning)', () => {
            const { container } = render(
                <MessageRegion>
                    <SystemMessage status="danger" critical announceOnPageLoad>
                        Nettbanken er nede
                    </SystemMessage>
                </MessageRegion>,
            );
            expect(getRegion(container)?.textContent).toBe('');
        });

        it('announceText overstyrer den synlige teksten', () => {
            const { container } = render(
                <MessageRegion>
                    <SystemMessage status="info" announceOnPageLoad announceText="Kort opplest tekst">
                        <p>En lengre synlig tekst som ikke skal leses opp i sin helhet.</p>
                    </SystemMessage>
                </MessageRegion>,
            );
            expect(getRegion(container)?.textContent).toBe('Kort opplest tekst');
        });

        it('advarer i dev når ikke-kritisk SystemMessage ikke ligger i en MessageRegion', () => {
            render(<SystemMessage status="info">Tekst</SystemMessage>);
            expect(warnSpy).toHaveBeenCalled();
        });

        it('advarer ikke når critical brukes uten MessageRegion', () => {
            render(
                <SystemMessage status="danger" critical>
                    Tekst
                </SystemMessage>,
            );
            expect(warnSpy).not.toHaveBeenCalled();
        });
    });
});
