import { render, screen, fireEvent, act } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { Modal } from './Modal';
// Last atferds-modulet slik en ekte React-app gjør: via pakke-inngangen
// @sb1/indeks-web (den lastes uansett for <ix-icon>). Modulen registrerer globale
// document-listeners + en MutationObserver som eier scroll-lås, åpningsfokus og
// backdrop-lukking for ALLE .ix-modal. MÅ være samme spesifikator som testSetup.ts
// bruker — importeres begge veier én instans deles, ellers får hver kopi sitt eget
// openModals-Set og scroll-låsen desynker (regresjon #3).
import '@sb1/indeks-web';

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

/* Etterlign nettleserens <dialog> nærmere enn stubbene over: close() fyrer `close`
 * i en SENERE oppgave (ikke synkront), og Escape fyrer `cancel` synkront og lukker
 * bare hvis ingen kalte preventDefault(). Uten dette kan ikke racen mellom lukking
 * og `close`-hendelsen gjenskapes. `requestClose` og `cancelable` styres av testen. */
function makeNativeLike(dialog: HTMLDialogElement, opts: { requestClose?: boolean } = {}) {
    dialog.close = function close() {
        if (!this.open) return;
        this.open = false;
        setTimeout(() => this.dispatchEvent(new Event('close')), 0);
    };
    if (opts.requestClose) {
        dialog.requestClose = function requestClose() {
            if (this.dispatchEvent(new Event('cancel', { cancelable: true }))) this.close();
        };
    }
}

function pressEscape(dialog: HTMLDialogElement, cancelable = true) {
    const notPrevented = dialog.dispatchEvent(new Event('cancel', { cancelable }));
    if (notPrevented && dialog.open) dialog.close();
}

const nextTask = () => act(async () => { await new Promise((r) => setTimeout(r, 0)); });

function Controlled({ onChange }: { onChange?: (open: boolean) => void }) {
    const [open, setOpen] = useState(true);
    return (
        <>
            <button onClick={() => setOpen(true)}>Åpne</button>
            <Modal
                open={open}
                onOpenChange={(next) => {
                    onChange?.(next);
                    setOpen(next);
                }}
            >
                <Modal.Header>
                    <Modal.Title>Tittel</Modal.Title>
                    <Modal.CloseButton label="Lukk" />
                </Modal.Header>
                <Modal.Body>x</Modal.Body>
            </Modal>
        </>
    );
}

/* Konsument som svarer på lukke-forespørselen med setOpen(true) i stedet for false,
 * f.eks. «du har ikke lagret»-vakt. Verdien er true hele tiden, så React rendrer
 * ikke på nytt, og dialogen må derfor ikke ha blitt lukket av nettleseren. */
function Refusing({ onChange }: { onChange: (open: boolean) => void }) {
    const [open, setOpen] = useState(true);
    return (
        <Modal
            open={open}
            onOpenChange={(next) => {
                onChange(next);
                setOpen(true);
            }}
        >
            <Modal.Body>x</Modal.Body>
        </Modal>
    );
}

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

    it('slipper scroll-låsen når forelderen fjerner modalen i onOpenChange', async () => {
        function Conditional() {
            const [show, setShow] = useState(true);
            return show ? (
                <Modal open onOpenChange={(open) => !open && setShow(false)}>
                    <Modal.Header>
                        <Modal.Title>Tittel</Modal.Title>
                        <Modal.CloseButton label="Lukk" />
                    </Modal.Header>
                </Modal>
            ) : null;
        }
        render(<Conditional />);
        await flush();
        expect(document.body.style.overflow).toBe('hidden');

        fireEvent.click(screen.getByRole('button', { name: 'Lukk' }));
        await flush();

        expect(document.querySelector('dialog')).toBeNull();
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

    describe('lukking via cancel', () => {
        it('Escape og så setOpen(true) før `close` kommer: modalen er åpen (regresjon)', async () => {
            const { container } = render(<Refusing onChange={vi.fn()} />);
            await flush();
            const dialog = container.querySelector('dialog')!;
            makeNativeLike(dialog);

            pressEscape(dialog);
            await nextTask(); // `close` ville kommet her om dialogen ble lukket

            expect(dialog.open).toBe(true);
        });

        it('klikk utenfor og så setOpen(true) før `close` kommer: modalen er åpen (regresjon)', async () => {
            const { container } = render(<Refusing onChange={vi.fn()} />);
            await flush();
            const dialog = container.querySelector('dialog')!;
            makeNativeLike(dialog);

            fireEvent.click(dialog);
            await nextTask();

            expect(dialog.open).toBe(true);
        });

        it('klikk utenfor virker likt med requestClose() i nettleseren', async () => {
            const { container } = render(<Refusing onChange={vi.fn()} />);
            await flush();
            const dialog = container.querySelector('dialog')!;
            makeNativeLike(dialog, { requestClose: true });

            fireEvent.click(dialog);
            await nextTask();

            expect(dialog.open).toBe(true);
        });

        it('lukker modalen når konsumenten svarer med open=false (Escape)', async () => {
            const onChange = vi.fn();
            const { container } = render(<Controlled onChange={onChange} />);
            await flush();
            const dialog = container.querySelector('dialog')!;
            makeNativeLike(dialog);

            pressEscape(dialog);
            await nextTask();

            expect(dialog.open).toBe(false);
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(false);
        });

        it('onOpenChange(false) kalles nøyaktig én gang ved klikk utenfor', async () => {
            const onChange = vi.fn();
            const { container } = render(<Controlled onChange={onChange} />);
            await flush();
            const dialog = container.querySelector('dialog')!;
            makeNativeLike(dialog);

            fireEvent.click(dialog);
            await nextTask();

            expect(dialog.open).toBe(false);
            expect(onChange).toHaveBeenCalledTimes(1);
        });

        it('onOpenChange(false) kalles nøyaktig én gang ved klikk utenfor med requestClose()', async () => {
            const onChange = vi.fn();
            const { container } = render(<Controlled onChange={onChange} />);
            await flush();
            const dialog = container.querySelector('dialog')!;
            makeNativeLike(dialog, { requestClose: true });

            fireEvent.click(dialog);
            await nextTask();

            expect(dialog.open).toBe(false);
            expect(onChange).toHaveBeenCalledTimes(1);
        });

        it('onOpenChange(false) kalles nøyaktig én gang ved Modal.CloseButton', async () => {
            const onChange = vi.fn();
            const { container } = render(<Controlled onChange={onChange} />);
            await flush();
            const dialog = container.querySelector('dialog')!;
            makeNativeLike(dialog);

            fireEvent.click(screen.getByRole('button', { name: 'Lukk' }));
            await nextTask();

            expect(dialog.open).toBe(false);
            expect(onChange).toHaveBeenCalledTimes(1);
        });

        it('onOpenChange(false) kalles nøyaktig én gang når cancel ikke kan avbrytes', async () => {
            // Chromium gjør `cancel` uavbrytbar fra tredje Escape på rad. Nettleseren
            // lukker da uansett, og `close` følger etter `cancel`.
            const onChange = vi.fn();
            const { container } = render(<Controlled onChange={onChange} />);
            await flush();
            const dialog = container.querySelector('dialog')!;
            makeNativeLike(dialog);

            pressEscape(dialog, false);
            await nextTask();

            expect(dialog.open).toBe(false);
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(false);
        });

        it('varsler fortsatt via `close` når dialogen lukkes uten `cancel` (reserve)', async () => {
            const onChange = vi.fn();
            const { container } = render(<Controlled onChange={onChange} />);
            await flush();
            const dialog = container.querySelector('dialog')!;
            makeNativeLike(dialog);

            dialog.close(); // som data-modal-close
            await nextTask();

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(false);
            expect(dialog.open).toBe(false);
        });

        it('lukker seg selv ukontrollert ved Escape, med ett varsel', async () => {
            const onChange = vi.fn();
            const { container } = render(
                <Modal defaultOpen onOpenChange={onChange}>
                    <Modal.Body>x</Modal.Body>
                </Modal>,
            );
            await flush();
            const dialog = container.querySelector('dialog')!;
            makeNativeLike(dialog);

            pressEscape(dialog);
            await nextTask();

            expect(dialog.open).toBe(false);
            expect(onChange).toHaveBeenCalledTimes(1);
        });
    });
});
