/* Modal — atferds-modul for ren HTML-bruk (ikke et custom element).
 *
 * Native <dialog class="ix-modal"> gir all tung a11y-atferd gratis: fokus-trap,
 * Escape-lukking, top-layer, fokus-retur og aria-modal. Denne modulen legger til
 * det <dialog> IKKE gir: deklarativ åpne/lukke-trigger, backdrop-klikk-lukking og
 * scroll-lås på <body>.
 *
 * Deklarativt API (samme delegerings-mønster som tooltip.ts):
 *   <button data-modal-open="min-modal">Åpne</button>       → element.showModal()
 *   <button data-modal-close>Lukk</button>                   → lukker nærmeste <dialog>
 *   <dialog class="ix-modal" id="min-modal">…</dialog>
 *
 * Backdrop-klikk lukker dialogen som standard. Sett `data-no-close-on-backdrop`
 * på <dialog> for å slå det av (trygt for skjema og destruktive handlinger der
 * utilsiktet lukking gir datatap).
 *
 * React-wrapperen bruker IKKE denne modulen — den styrer <dialog> direkte. Ingen
 * logikk er duplisert; modulen er kun for konsumenter uten React.
 */

const ATTR_OPEN = 'data-modal-open';
const ATTR_CLOSE = 'data-modal-close';
const ATTR_NO_BACKDROP = 'data-no-close-on-backdrop';

/* Antall åpne ix-modaler. Scroll-låsen holdes så lenge minst én er åpen (støtter
 * nestede modaler), og slippes først når den siste lukkes. */
let openCount = 0;
let previousBodyOverflow: string | undefined;

function lockScroll(): void {
    if (openCount === 0) {
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }
    openCount += 1;
}

function releaseScroll(): void {
    if (openCount === 0) return;
    openCount -= 1;
    if (openCount === 0) {
        document.body.style.overflow = previousBodyOverflow ?? '';
        previousBodyOverflow = undefined;
    }
}

function handleClick(e: Event): void {
    const target = e.target as Element;
    if (!target?.closest) return;

    // Åpne
    const opener = target.closest(`[${ATTR_OPEN}]`);
    if (opener) {
        const id = opener.getAttribute(ATTR_OPEN);
        const dialog = id ? document.getElementById(id) : null;
        if (dialog instanceof HTMLDialogElement && !dialog.open) {
            dialog.showModal();
            lockScroll();
        }
        return;
    }

    // Lukk via lukke-knapp — nærmeste <dialog>
    const closer = target.closest(`[${ATTR_CLOSE}]`);
    if (closer) {
        closer.closest('dialog')?.close();
        return;
    }

    // Backdrop-klikk: native ::backdrop er ikke en egen node, så et klikk på den
    // treffer selve <dialog>-elementet (e.target === dialogen). Klikk på innhold
    // treffer et barn og matcher ikke. Lukker som standard; opt-out via attributt.
    if (
        target instanceof HTMLDialogElement &&
        target.classList.contains('ix-modal') &&
        !target.hasAttribute(ATTR_NO_BACKDROP)
    ) {
        target.close();
    }
}

/* close-eventet fra <dialog> bobler ikke → lytt i capture-fasen. Dekker alle
 * lukke-veier: Escape (native), lukke-knapp og backdrop-klikk (begge kaller
 * .close()). */
function handleClose(e: Event): void {
    const target = e.target;
    if (target instanceof HTMLDialogElement && target.classList.contains('ix-modal')) {
        releaseScroll();
    }
}

document.addEventListener('click', handleClick);
document.addEventListener('close', handleClose, true);
