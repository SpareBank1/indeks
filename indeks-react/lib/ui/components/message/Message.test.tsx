import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Message } from './Message';

describe('Message', () => {
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

    it('rendrer statusikon inne i summary i utvidbar modus', () => {
        const { container } = render(
            <Message status="warning" expandable summary="Sammendrag">
                Detaljer
            </Message>,
        );
        const icon = container.querySelector('.ix-message__summary > ix-icon[data-badge]');
        expect(icon).not.toBeNull();
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

    it('bruker role=alert for warning og danger', () => {
        const { container: warning } = render(<Message status="warning">Tekst</Message>);
        expect(warning.firstElementChild?.getAttribute('role')).toBe('alert');

        const { container: danger } = render(<Message status="danger">Tekst</Message>);
        expect(danger.firstElementChild?.getAttribute('role')).toBe('alert');
    });

    it('bruker aria-live=polite for info og success', () => {
        const { container: info } = render(<Message status="info">Tekst</Message>);
        expect(info.firstElementChild?.getAttribute('aria-live')).toBe('polite');
        expect(info.firstElementChild?.hasAttribute('role')).toBe(false);

        const { container: success } = render(<Message status="success">Tekst</Message>);
        expect(success.firstElementChild?.getAttribute('aria-live')).toBe('polite');
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

    describe('expandable', () => {
        it('rendrer som details med summary og ekspandert innhold', () => {
            const { container } = render(
                <Message status="warning" expandable summary="Kort sammendrag">
                    <p>Lang tekst</p>
                </Message>,
            );
            const root = container.firstElementChild as HTMLDetailsElement;
            expect(root.tagName).toBe('DETAILS');
            expect(root.getAttribute('data-expandable')).toBe('');
            expect(root.querySelector('summary')).toBeTruthy();
            expect(screen.getByText('Kort sammendrag')).toBeTruthy();
            expect(screen.getByText('Lang tekst')).toBeTruthy();
        });

        it('er lukket som standard', () => {
            const { container } = render(
                <Message status="info" expandable summary="Sammendrag">
                    Innhold
                </Message>,
            );
            expect((container.firstElementChild as HTMLDetailsElement).open).toBe(false);
        });

        it('starter åpen når defaultOpen er satt', () => {
            const { container } = render(
                <Message status="info" expandable summary="Sammendrag" defaultOpen>
                    Innhold
                </Message>,
            );
            expect((container.firstElementChild as HTMLDetailsElement).open).toBe(true);
        });

        it('viser ikke lukkeknapp i utvidbar modus selv med closeLabel', () => {
            const { container } = render(
                <Message status="warning" expandable summary="Sammendrag" closeLabel="Lukk melding">
                    Innhold
                </Message>,
            );
            expect(screen.queryByRole('button', { name: 'Lukk melding' })).toBeNull();
            expect(container.querySelector('.ix-message__close')).toBeNull();
        });

        it('setter ikke role/aria-live på details-roten', () => {
            const { container } = render(
                <Message status="danger" expandable summary="Sammendrag">
                    Innhold
                </Message>,
            );
            const root = container.firstElementChild;
            expect(root?.hasAttribute('role')).toBe(false);
            expect(root?.hasAttribute('aria-live')).toBe(false);
        });
    });
});
