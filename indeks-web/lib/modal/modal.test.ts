import { afterEach, describe, expect, it } from 'vitest';

// Import side-effect — registrerer event listeners
import './modal';

/* jsdom (v29) implementerer ikke <dialog>.showModal()/close(). Vi stubber dem så
 * de speiler nettleseren: showModal setter open=true, close setter open=false og
 * fyrer et ikke-boblende `close`-event (slik native gjør). */
function patchDialog(dialog: HTMLDialogElement): void {
    dialog.showModal = function showModal() {
        this.open = true;
    };
    dialog.close = function close() {
        if (!this.open) return;
        this.open = false;
        this.dispatchEvent(new Event('close')); // native: bobler ikke
    };
}

function createModal(attrs: Record<string, string> = {}): HTMLDialogElement {
    const dialog = document.createElement('dialog');
    dialog.className = 'ix-modal';
    dialog.id = attrs.id ?? 'test-modal';
    if ('data-no-close-on-backdrop' in attrs) {
        dialog.setAttribute('data-no-close-on-backdrop', '');
    }
    dialog.innerHTML = `
        <div class="ix-modal__body"><p>Innhold</p></div>
        <button data-modal-close>Lukk</button>
    `;
    patchDialog(dialog);
    document.body.appendChild(dialog);
    return dialog;
}

function createOpener(targetId: string): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.setAttribute('data-modal-open', targetId);
    document.body.appendChild(btn);
    return btn;
}

afterEach(() => {
    // Lukk åpne modaler så den delte scroll-lås-telleren i modulen nulles ut
    // mellom tester (close() dekrementerer openCount).
    document.querySelectorAll<HTMLDialogElement>('dialog.ix-modal').forEach((d) => {
        if (d.open) d.close();
    });
    document.body.innerHTML = '';
    document.body.style.overflow = '';
});

describe('modal atferds-modul', () => {
    describe('åpning', () => {
        it('åpner dialogen når data-modal-open klikkes', () => {
            const dialog = createModal({ id: 'm1' });
            const opener = createOpener('m1');

            opener.click();

            expect(dialog.open).toBe(true);
        });

        it('gjør ingenting hvis id ikke peker på en dialog', () => {
            createModal({ id: 'm1' });
            const opener = createOpener('finnes-ikke');

            expect(() => opener.click()).not.toThrow();
        });
    });

    describe('åpningsfokus', () => {
        it('flytter fokus til dialogen (ikke lukk-knappen) og setter tabindex', () => {
            const dialog = createModal({ id: 'm1' });
            createOpener('m1').click();

            expect(document.activeElement).toBe(dialog);
            expect(dialog.getAttribute('tabindex')).toBe('-1');
        });

        it('respekterer etterkommer med autofocus', () => {
            const dialog = createModal({ id: 'm1' });
            const input = document.createElement('input');
            input.setAttribute('autofocus', '');
            dialog.querySelector('.ix-modal__body')!.appendChild(input);
            createOpener('m1').click();

            // Vi tar ikke fokus fra dialogen når en etterkommer ber om autofokus.
            expect(document.activeElement).not.toBe(dialog);
        });
    });

    describe('lukking', () => {
        it('lukker nærmeste dialog når data-modal-close klikkes', () => {
            const dialog = createModal({ id: 'm1' });
            createOpener('m1').click();
            expect(dialog.open).toBe(true);

            dialog.querySelector<HTMLButtonElement>('[data-modal-close]')!.click();

            expect(dialog.open).toBe(false);
        });
    });

    describe('backdrop-klikk', () => {
        it('lukker ved klikk på dialogen selv som standard', () => {
            const dialog = createModal({ id: 'm1' });
            createOpener('m1').click();

            // Klikk der e.target er selve <dialog> = backdrop-området
            dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            expect(dialog.open).toBe(false);
        });

        it('lukker IKKE ved backdrop-klikk med data-no-close-on-backdrop', () => {
            const dialog = createModal({ id: 'm1', 'data-no-close-on-backdrop': '' });
            createOpener('m1').click();

            dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            expect(dialog.open).toBe(true);
        });

        it('lukker IKKE når klikket treffer innhold i dialogen', () => {
            const dialog = createModal({ id: 'm1' });
            createOpener('m1').click();

            dialog.querySelector('p')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            expect(dialog.open).toBe(true);
        });
    });

    describe('scroll-lås', () => {
        it('låser body-scroll når en modal åpnes', () => {
            createModal({ id: 'm1' });
            createOpener('m1').click();

            expect(document.body.style.overflow).toBe('hidden');
        });

        it('slipper scroll-låsen når modalen lukkes', () => {
            const dialog = createModal({ id: 'm1' });
            createOpener('m1').click();
            dialog.close();

            expect(document.body.style.overflow).toBe('');
        });

        it('holder låsen til siste av flere modaler lukkes', () => {
            const first = createModal({ id: 'm1' });
            const second = createModal({ id: 'm2' });
            createOpener('m1').click();
            createOpener('m2').click();
            expect(document.body.style.overflow).toBe('hidden');

            first.close();
            expect(document.body.style.overflow).toBe('hidden');

            second.close();
            expect(document.body.style.overflow).toBe('');
        });

        it('gjenoppretter tidligere overflow-verdi', () => {
            document.body.style.overflow = 'scroll';
            const dialog = createModal({ id: 'm1' });
            createOpener('m1').click();
            dialog.close();

            expect(document.body.style.overflow).toBe('scroll');
        });
    });
});
