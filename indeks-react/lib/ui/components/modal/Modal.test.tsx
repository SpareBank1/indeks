import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { Modal } from './Modal';

/* jsdom (v29) implementerer ikke <dialog>.showModal()/close(). Vi stubber dem så
 * de speiler nettleseren: showModal setter open=true, close setter open=false og
 * fyrer et `close`-event. */
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
    document.body.style.overflow = '';
});

function renderModal(props: Partial<React.ComponentProps<typeof Modal>> = {}) {
    const onOpenChange = vi.fn();
    const result = render(
        <Modal open onOpenChange={onOpenChange} {...props}>
            <Modal.Header>
                <Modal.Title>Bekreft sletting</Modal.Title>
                <Modal.CloseButton label="Lukk" />
            </Modal.Header>
            <Modal.Body>
                <p>Er du sikker?</p>
            </Modal.Body>
            <Modal.Footer>
                <Modal.ButtonGroup>
                    <button>Slett</button>
                </Modal.ButtonGroup>
            </Modal.Footer>
        </Modal>,
    );
    return { onOpenChange, ...result };
}

describe('Modal', () => {
    it('rendrer et <dialog class="ix-modal"> med underregioner', () => {
        const { container } = renderModal();
        const dialog = container.querySelector('dialog.ix-modal');
        expect(dialog).not.toBeNull();
        expect(dialog!.querySelector('.ix-modal__header')).not.toBeNull();
        expect(dialog!.querySelector('.ix-modal__body')).not.toBeNull();
        expect(dialog!.querySelector('.ix-modal__footer')).not.toBeNull();
        expect(dialog!.querySelector('.ix-modal__button-group')).not.toBeNull();
    });

    it('åpner dialogen (showModal) når open=true', () => {
        const { container } = renderModal();
        expect(container.querySelector('dialog')!.open).toBe(true);
    });

    it('lukker dialogen når open går fra true til false', () => {
        const { container, rerender } = renderModal();
        const dialog = container.querySelector('dialog')!;
        expect(dialog.open).toBe(true);

        rerender(
            <Modal open={false} onOpenChange={vi.fn()}>
                <Modal.Body>tom</Modal.Body>
            </Modal>,
        );
        expect(dialog.open).toBe(false);
    });

    it('kobler aria-labelledby til Modal.Title', () => {
        const { container } = renderModal();
        const dialog = container.querySelector('dialog')!;
        const title = container.querySelector('.ix-modal__title')!;
        expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
        expect(title.id).toBeTruthy();
    });

    it('setter ikke aria-labelledby uten Modal.Title', () => {
        const { container } = render(
            <Modal open onOpenChange={vi.fn()}>
                <Modal.Body>Uten tittel</Modal.Body>
            </Modal>,
        );
        expect(container.querySelector('dialog')!.getAttribute('aria-labelledby')).toBeNull();
    });

    it('kobler aria-describedby til Modal.Description', () => {
        const { container } = render(
            <Modal open onOpenChange={vi.fn()}>
                <Modal.Body>
                    <Modal.Description>En beskrivelse</Modal.Description>
                </Modal.Body>
            </Modal>,
        );
        const dialog = container.querySelector('dialog')!;
        const description = container.querySelector('.ix-modal__description')!;
        expect(dialog.getAttribute('aria-describedby')).toBe(description.id);
        expect(description.id).toBeTruthy();
    });

    it('setter ikke aria-describedby uten Modal.Description', () => {
        const { container } = renderModal();
        expect(container.querySelector('dialog')!.getAttribute('aria-describedby')).toBeNull();
    });

    it('speiler size til data-size (medium = ingen attributt)', () => {
        const { container, rerender } = renderModal({ size: 'medium' });
        const dialog = container.querySelector('dialog')!;
        expect(dialog.getAttribute('data-size')).toBeNull();

        rerender(
            <Modal open onOpenChange={vi.fn()} size="large">
                <Modal.Body>x</Modal.Body>
            </Modal>,
        );
        expect(dialog.getAttribute('data-size')).toBe('large');
    });

    it('Modal.CloseButton kaller onOpenChange(false)', () => {
        const { onOpenChange } = renderModal();
        fireEvent.click(screen.getByRole('button', { name: 'Lukk' }));
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('lukker ved backdrop-klikk som standard', () => {
        const { container, onOpenChange } = renderModal();
        const dialog = container.querySelector('dialog')!;
        expect(dialog.getAttribute('data-no-close-on-backdrop')).toBeNull();

        // Klikk der target er selve <dialog> = backdrop
        fireEvent.click(dialog);
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('lukker IKKE ved backdrop-klikk når closeOnBackdropClick=false', () => {
        const { container, onOpenChange } = renderModal({ closeOnBackdropClick: false });
        const dialog = container.querySelector('dialog')!;
        expect(dialog.getAttribute('data-no-close-on-backdrop')).toBe('');

        fireEvent.click(dialog);
        expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('lukker IKKE når klikk treffer innhold i dialogen', () => {
        const { onOpenChange } = renderModal();
        fireEvent.click(screen.getByText('Er du sikker?'));
        expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('kaller onOpenChange(false) ved Escape (cancel-event)', () => {
        const { container, onOpenChange } = renderModal();
        fireEvent(container.querySelector('dialog')!, new Event('cancel'));
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('låser body-scroll mens den er åpen og slipper ved lukking', () => {
        const { rerender } = renderModal();
        expect(document.body.style.overflow).toBe('hidden');

        rerender(
            <Modal open={false} onOpenChange={vi.fn()}>
                <Modal.Body>x</Modal.Body>
            </Modal>,
        );
        expect(document.body.style.overflow).toBe('');
    });

    it('åpner ukontrollert via defaultOpen (uten open-prop)', () => {
        const { container } = render(
            <Modal defaultOpen>
                <Modal.Body>x</Modal.Body>
            </Modal>,
        );
        expect(container.querySelector('dialog')!.open).toBe(true);
    });

    it('er lukket ukontrollert som standard (uten open og defaultOpen)', () => {
        const { container } = render(
            <Modal>
                <Modal.Body>x</Modal.Body>
            </Modal>,
        );
        expect(container.querySelector('dialog')!.open).toBe(false);
    });

    it('lukker seg selv ukontrollert når lukk-knappen klikkes', () => {
        const { container } = render(
            <Modal defaultOpen>
                <Modal.Header>
                    <Modal.CloseButton label="Lukk" />
                </Modal.Header>
                <Modal.Body>x</Modal.Body>
            </Modal>,
        );
        const dialog = container.querySelector('dialog')!;
        expect(dialog.open).toBe(true);

        fireEvent.click(screen.getByRole('button', { name: 'Lukk' }));
        expect(dialog.open).toBe(false);
    });

    it('kaller onOpenChange også i ukontrollert modus', () => {
        const onOpenChange = vi.fn();
        render(
            <Modal defaultOpen onOpenChange={onOpenChange}>
                <Modal.Header>
                    <Modal.CloseButton label="Lukk" />
                </Modal.Header>
                <Modal.Body>x</Modal.Body>
            </Modal>,
        );
        fireEvent.click(screen.getByRole('button', { name: 'Lukk' }));
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('kontrollert: intern state endres ikke — open-prop styrer', () => {
        // Uten at konsumenten oppdaterer open forblir dialogen åpen selv etter
        // et lukke-forsøk (kontrollert modus eier tilstanden).
        const onOpenChange = vi.fn();
        const { container } = render(
            <Modal open onOpenChange={onOpenChange}>
                <Modal.Header>
                    <Modal.CloseButton label="Lukk" />
                </Modal.Header>
                <Modal.Body>x</Modal.Body>
            </Modal>,
        );
        const dialog = container.querySelector('dialog')!;
        fireEvent.click(screen.getByRole('button', { name: 'Lukk' }));
        expect(onOpenChange).toHaveBeenCalledWith(false);
        // open-prop er fortsatt true → dialogen forblir åpen.
        expect(dialog.open).toBe(true);
    });

    it('videresender ref til <dialog>', () => {
        const ref = createRef<HTMLDialogElement>();
        render(
            <Modal ref={ref} open onOpenChange={vi.fn()}>
                <Modal.Body>x</Modal.Body>
            </Modal>,
        );
        expect(ref.current?.tagName.toLowerCase()).toBe('dialog');
    });

    it('CloseButton rendrer et dekorativt ix-icon', () => {
        renderModal();
        const btn = screen.getByRole('button', { name: 'Lukk' });
        const icon = btn.querySelector('ix-icon');
        expect(icon?.getAttribute('name')).toBe('close');
    });
});
