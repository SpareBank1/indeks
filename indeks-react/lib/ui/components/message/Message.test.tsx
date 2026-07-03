import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Message } from './Message';
import { MessageRegion } from '../message-region/MessageRegion';

function getRegion(container: HTMLElement): HTMLElement | null {
    return container.querySelector('[aria-live="polite"]');
}

describe('Message', () => {
    // <Message> uten <MessageRegion> advarer i dev — demp støy i de fleste testene.
    let warnSpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });
    afterEach(() => {
        warnSpy.mockRestore();
    });

    it('rendrer body-tekst og ix-message-klasse', () => {
        const { container } = render(<Message status="info">Hei verden</Message>);
        const root = container.firstElementChild;
        expect(root?.classList.contains('ix-message')).toBe(true);
        expect(screen.getByText('Hei verden')).toBeTruthy();
    });

    it('rendrer children rått i body uten å pakke dem i <p>', () => {
        const { container } = render(
            <Message status="info">
                <p>Brødtekst</p>
                <a className="ix-link-text" href="/mer">
                    Les mer
                </a>
            </Message>,
        );
        const body = container.querySelector('.ix-message__body');
        // Lenken er en direkte etterkommer av body (ikke pakket i en ekstra <p>).
        const link = screen.getByRole('link', { name: 'Les mer' });
        expect(body?.contains(link)).toBe(true);
        expect(link.closest('p')).toBeNull();
    });

    it('rendrer et dekorativt statusikon (ix-icon[data-badge] med aria-hidden) som første barn', () => {
        const { container } = render(<Message status="info">Hei</Message>);
        const root = container.firstElementChild;
        const icon = root?.firstElementChild;
        expect(icon?.tagName.toLowerCase()).toBe('ix-icon');
        expect(icon?.hasAttribute('data-badge')).toBe(true);
        expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('setter data-status', () => {
        const { container } = render(<Message status="success">Tekst</Message>);
        expect(container.firstElementChild?.getAttribute('data-status')).toBe('success');
    });

    it('sender className videre til rot-elementet', () => {
        const { container } = render(
            <Message status="info" className="custom">
                Tekst
            </Message>,
        );
        expect(container.firstElementChild?.classList.contains('custom')).toBe(true);
    });

    it('setter ikke role/aria-live på det synlige elementet (annonsering skjer via MessageRegion)', () => {
        const { container } = render(<Message status="danger">Tekst</Message>);
        const root = container.firstElementChild;
        expect(root?.hasAttribute('role')).toBe(false);
        expect(root?.hasAttribute('aria-live')).toBe(false);
    });

    it('advarer i dev når Message ikke ligger i en MessageRegion', () => {
        render(<Message status="info">Tekst</Message>);
        expect(warnSpy).toHaveBeenCalled();
    });

    it('rendrer tittel når title er satt', () => {
        render(
            <Message status="info" title="Min tittel">
                Tekst
            </Message>,
        );
        expect(screen.getByText('Min tittel')).toBeTruthy();
    });

    it('viser ikke lukkeknapp uten closeLabel', () => {
        render(<Message status="info">Tekst</Message>);
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('viser lukkeknapp med aria-label og kaller onClose ved klikk', () => {
        const onClose = vi.fn();
        render(
            <Message status="info" closeLabel="Lukk melding" onClose={onClose}>
                Tekst
            </Message>,
        );
        fireEvent.click(screen.getByRole('button', { name: 'Lukk melding' }));
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('rendrer lukkeknappen som en InteractiveIcon med ix-icon', () => {
        render(
            <Message status="info" closeLabel="Lukk melding">
                Tekst
            </Message>,
        );
        const button = screen.getByRole('button', { name: 'Lukk melding' });
        expect(button.classList.contains('ix-interactive-icon')).toBe(true);
        expect(button.classList.contains('ix-message__close')).toBe(true);
        expect(button.querySelector('ix-icon')).not.toBeNull();
    });

    it('skjuler meldingen når lukkeknappen klikkes', () => {
        render(
            <Message status="info" closeLabel="Lukk melding">
                Tekst
            </Message>,
        );
        expect(screen.getByText('Tekst')).toBeTruthy();
        fireEvent.click(screen.getByRole('button', { name: 'Lukk melding' }));
        expect(screen.queryByText('Tekst')).toBeNull();
    });

    describe('annonsering via MessageRegion', () => {
        it('annonserer den synlige teksten i live-regionen (med announceOnPageLoad)', () => {
            const { container } = render(
                <MessageRegion>
                    <Message status="success" announceOnPageLoad>
                        Endringene er lagret
                    </Message>
                </MessageRegion>,
            );
            expect(getRegion(container)?.textContent).toBe('Endringene er lagret');
        });

        it('annonserer også warning/danger i samme live-region', () => {
            const { container } = render(
                <MessageRegion>
                    <Message status="danger" announceOnPageLoad>
                        Betalingen feilet
                    </Message>
                </MessageRegion>,
            );
            expect(getRegion(container)?.textContent).toBe('Betalingen feilet');
        });

        it('er stille ved sidelast uten announceOnPageLoad', () => {
            const { container } = render(
                <MessageRegion>
                    <Message status="info">Standing content</Message>
                </MessageRegion>,
            );
            expect(getRegion(container)?.textContent).toBe('');
        });

        it('announceText overstyrer den synlige teksten', () => {
            const { container } = render(
                <MessageRegion>
                    <Message status="danger" announceOnPageLoad announceText="Betalingen feilet">
                        <p>Vi klarte ikke å gjennomføre betalingen.</p>
                    </Message>
                </MessageRegion>,
            );
            expect(getRegion(container)?.textContent).toBe('Betalingen feilet');
        });

        it('annonserer ikke når Message ikke ligger i en MessageRegion', () => {
            // Ingen region → ingen kast, bare console.warn (dempet i beforeEach).
            expect(() => render(<Message status="info">Tekst</Message>)).not.toThrow();
        });
    });

    describe('full bredde', () => {
        it('setter ikke data-full-width som standard', () => {
            const { container } = render(<Message status="info">Tekst</Message>);
            expect(container.firstElementChild?.hasAttribute('data-full-width')).toBe(false);
        });

        it('setter data-full-width når fullWidth er satt', () => {
            const { container } = render(
                <Message status="info" fullWidth>
                    Tekst
                </Message>,
            );
            expect(container.firstElementChild?.getAttribute('data-full-width')).toBe('');
        });

        it('viser lukkeknapp også i full bredde', () => {
            render(
                <Message status="info" fullWidth closeLabel="Lukk melding">
                    Tekst
                </Message>,
            );
            expect(screen.getByRole('button', { name: 'Lukk melding' })).toBeTruthy();
        });
    });
});
