/* Modal — atferds-modul for ALLE ix-modaler (både ren HTML og React-wrapperen).
 *
 * Native <dialog class="ix-modal"> gir all tung a11y-atferd gratis: fokus-trap,
 * Escape-lukking, top-layer, fokus-retur og aria-modal. Denne modulen legger til
 * det <dialog> IKKE gir, og gjør det for enhver ix-modal uansett hvem som åpnet
 * den:
 *   • scroll-lås på <body> mens minst én modal er åpen
 *   • åpningsfokus på selve dialogen (ikke lukk-knappen — se moveOpeningFocus)
 *   • deklarativ åpne/lukke-trigger (data-modal-open / data-modal-close)
 *   • backdrop-klikk-lukking (opt-out via data-no-close-on-backdrop)
 *
 * Scroll-lås og fokus drives av dialogens `open`-TILSTAND (via en MutationObserver
 * på `open`-attributtet), ikke av åpne-klikket. Dermed treffer det både HTML-en
 * som åpner via data-modal-open OG React-wrapperen som kaller showModal() direkte
 * — samme kodevei, ingen duplisering. React-wrapperen er et tynt lag: den rendrer
 * <dialog class="ix-modal"> og speiler `open`-propen til showModal()/close(); all
 * atferd her under eies av denne modulen (som konsumenten uansett laster for
 * <ix-icon>).
 *
 * Deklarativt API (samme delegerings-mønster som tooltip.ts):
 *   <button data-modal-open="min-modal">Åpne</button>       → element.showModal()
 *   <button data-modal-close>Lukk</button>                   → lukker nærmeste <dialog>
 *   <dialog class="ix-modal" id="min-modal">…</dialog>
 *
 * Backdrop-klikk lukker dialogen som standard. Sett `data-no-close-on-backdrop`
 * på <dialog> for å slå det av (trygt for skjema og destruktive handlinger der
 * utilsiktet lukking gir datatap).
 */

const ATTR_OPEN = 'data-modal-open';
const ATTR_CLOSE = 'data-modal-close';
const ATTR_NO_BACKDROP = 'data-no-close-on-backdrop';

/* Åpne ix-modaler, sporet på elementIDENTITET (et Set, ikke en teller). Idempotent
 * per element: å registrere samme åpne dialog to ganger (f.eks. både via klikk-
 * veien og observeren) endrer ingenting, og overlappende/nestede modaler kan aldri
 * desynke låsen. Scroll-låsen holdes så lenge settet er ikke-tomt og slippes først
 * når den siste modalen lukkes. */
const openModals = new Set<HTMLDialogElement>();
let previousBodyOverflow: string | undefined;

function handleOpened(dialog: HTMLDialogElement): void {
    if (openModals.has(dialog)) return;
    if (openModals.size === 0) {
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }
    openModals.add(dialog);
    moveOpeningFocus(dialog);
}

function handleClosed(dialog: HTMLDialogElement): void {
    if (!openModals.delete(dialog)) return;
    if (openModals.size === 0) {
        document.body.style.overflow = previousBodyOverflow ?? '';
        previousBodyOverflow = undefined;
    }
}

/* showModal() auto-fokuserer første fokuserbare etterkommer — typisk lukk-knappen.
 * Uønsket: modalen skal ikke åpne med fokusring på «Lukk». Flytt fokus til selve
 * dialogen så skjermlesere annonserer «<tittel>, dialog» og Tab går videre
 * naturlig. En etterkommer med `autofocus` vinner (da respekterer vi konsumentens
 * valg). Dialogen er ikke natively fokuserbar, så vi setter tabindex=-1 selv om
 * den mangler. */
function moveOpeningFocus(dialog: HTMLDialogElement): void {
    if (dialog.querySelector('[autofocus]')) return;
    if (!dialog.hasAttribute('tabindex')) dialog.tabIndex = -1;
    dialog.focus();
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
            // showModal() setter `open`; observeren (og handleOpened her) tar scroll-
            // lås + åpningsfokus. Vi kaller handleOpened synkront i tillegg så HTML-
            // veien låser umiddelbart uten å vente på observerens mikrotask.
            dialog.showModal();
            if (dialog.classList.contains('ix-modal')) handleOpened(dialog);
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
 * lukke-veier synkront: Escape (native), lukke-knapp, backdrop-klikk og React som
 * kaller .close() når `open` går til false. */
function handleClose(e: Event): void {
    const target = e.target;
    if (target instanceof HTMLDialogElement && target.classList.contains('ix-modal')) {
        handleClosed(target);
    }
}

/* Fanger åpne/lukke-transisjoner uansett hvem som endret `open` — særlig React som
 * kaller showModal() uten et klikk. Idempotent mot klikk-/close-veien over. */
const observer = new MutationObserver((records) => {
    for (const record of records) {
        const dialog = record.target;
        if (!(dialog instanceof HTMLDialogElement)) continue;
        if (!dialog.classList.contains('ix-modal')) continue;
        if (dialog.open) handleOpened(dialog);
        else handleClosed(dialog);
    }
});

document.addEventListener('click', handleClick);
document.addEventListener('close', handleClose, true);
observer.observe(document.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: ['open'],
});
