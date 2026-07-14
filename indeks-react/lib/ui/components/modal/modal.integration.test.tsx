import { render, screen, fireEvent, act } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { Modal } from './Modal';
// Last atferds-modulet slik en ekte React-app gjør (den lastes uansett for
// <ix-icon>). Modulen registrerer globale document-listeners + en MutationObserver
// som eier scroll-lås, åpningsfokus og backdrop-lukking for ALLE .ix-modal.
import '../../../../../indeks-web/lib/modal/modal';

/* jsdom implementerer ikke <dialog>.showModal()/close(). Speil nettleseren:
 * showModal setter open=true, close setter open=false og fyrer et close-event. */
beforeAll(() => {
    if (!HTMLDialogElement.prototype.showModal) {
        HTMLDialogElement.prototype.showModal = function showModal() {
            this.open = true;
        };
    }
    if (!HTMLDialogElement.prototype.close) {
        HTMLDialogElement.prototype.close = function close() {
            if (!this.open) return;
            this.open = false;
            this.dispatchEvent(new Event('close'));
        };
    }
});

afterEach(() => {
    document.querySelectorAll<HTMLDialogElement>('dialog.ix-modal').forEach((d) => {
        if (d.open) d.close();
    });
    document.body.style.overflow = '';
});

/* MutationObserver-callbacks kjører som mikrotask. Tøm køen etter en åpning slik at
 * observeren (scroll-lås/fokus) har kjørt før vi asserter. */
const flush = () => act(async () => { await Promise.resolve(); });

describe('Modal + @sb1/indeks-web (integrasjon)', () => {
    it('web-modulet fyrer onOpenChange nøyaktig én gang ved backdrop-klikk (regresjon #1)', async () => {
        const onOpenChange = vi.fn();
        const { container } = render(
            <Modal open onOpenChange={onOpenChange}>
                <Modal.Body>x</Modal.Body>
            </Modal>,
        );
        await flush();
        const dialog = container.querySelector('dialog')!;

        // Klikk der target === selve <dialog> = backdrop. Web-modulet kaller .close(),
        // som fyrer `close` → wrapperens onClose synker til onOpenChange(false).
        fireEvent.click(dialog);

        expect(onOpenChange).toHaveBeenCalledTimes(1);
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('respekterer closeOnBackdropClick={false} (data-no-close-on-backdrop)', async () => {
        const onOpenChange = vi.fn();
        const { container } = render(
            <Modal open onOpenChange={onOpenChange} closeOnBackdropClick={false}>
                <Modal.Body>x</Modal.Body>
            </Modal>,
        );
        await flush();
        fireEvent.click(container.querySelector('dialog')!);
        expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('overlappende modaler holder scroll-låsen riktig (regresjon #3)', async () => {
        function Two() {
            const [a, setA] = useState(true);
            const [b, setB] = useState(true);
            return (
                <>
                    <Modal open={a} onOpenChange={setA}>
                        <Modal.Body>A</Modal.Body>
                    </Modal>
                    <Modal open={b} onOpenChange={setB}>
                        <Modal.Body>B</Modal.Body>
                    </Modal>
                    <button onClick={() => setA(false)}>close-a</button>
                    <button onClick={() => setB(false)}>close-b</button>
                </>
            );
        }
        render(<Two />);
        await flush();
        expect(document.body.style.overflow).toBe('hidden');

        // Lukk A først — B er fortsatt åpen, så låsen SKAL holde.
        fireEvent.click(screen.getByText('close-a'));
        await flush();
        expect(document.body.style.overflow).toBe('hidden');

        // Lukk B — ingen åpne modaler igjen, låsen slippes.
        fireEvent.click(screen.getByText('close-b'));
        await flush();
        expect(document.body.style.overflow).toBe('');
    });

    it('flytter åpningsfokus til dialogen, ikke lukk-knappen', async () => {
        const { container } = render(
            <Modal open onOpenChange={vi.fn()}>
                <Modal.Header>
                    <Modal.Title>Tittel</Modal.Title>
                    <Modal.CloseButton label="Lukk" />
                </Modal.Header>
                <Modal.Body>x</Modal.Body>
            </Modal>,
        );
        await flush();
        const dialog = container.querySelector('dialog')!;
        expect(document.activeElement).toBe(dialog);
        expect(dialog.getAttribute('tabindex')).toBe('-1');
    });

    it('stjeler ikke fokus når en etterkommer har autofocus', async () => {
        render(
            <Modal open onOpenChange={vi.fn()}>
                <Modal.Body>
                    <input {...{ autofocus: '' }} aria-label="Navn" />
                </Modal.Body>
            </Modal>,
        );
        await flush();
        expect(document.activeElement).not.toBe(document.querySelector('dialog'));
    });
});
