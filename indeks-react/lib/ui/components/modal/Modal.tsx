import clsx from 'clsx';
import {
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react';
import type { ForwardRefExoticComponent, JSX, ReactNode, RefAttributes } from 'react';
import { ModalContext } from './ModalContext';
import type { ModalContextValue } from './ModalContext';
import { ModalHeader } from './ModalHeader';
import { ModalTitle } from './ModalTitle';
import { ModalBody } from './ModalBody';
import { ModalFooter } from './ModalFooter';
import { ModalButtonGroup } from './ModalButtonGroup';
import { ModalCloseButton } from './ModalCloseButton';
import { ModalDescription } from './ModalDescription';

export type ModalSize = 'small' | 'medium' | 'large' | 'full';

export type ModalProps = {
    /**
     * Om dialogen er åpen. Angi denne for **kontrollert** bruk — da eier
     * konsumenten tilstanden og speiler den til native `showModal()`/`close()`.
     * Utelat for **ukontrollert** bruk (se `defaultOpen`).
     */
    open?: boolean;
    /**
     * Startverdi for åpen-tilstanden i **ukontrollert** modus, der `Modal` selv
     * eier tilstanden. Ignoreres når `open` er satt. @default false
     */
    defaultOpen?: boolean;
    /**
     * Kalles når dialogen ber om å bli lukket (eller åpnet): Escape, lukk-knapp
     * eller backdrop-klikk. I kontrollert modus setter konsumenten `open` som
     * respons; i ukontrollert modus oppdaterer `Modal` sin egen tilstand, og
     * dette er da kun en observatør.
     */
    onOpenChange?: (open: boolean) => void;
    /** Bredde på dialogen. @default "medium" */
    size?: ModalSize;
    /**
     * Lukk når brukeren klikker på backdrop (utenfor dialogen). På som standard.
     * Sett til `false` for skjemaer og destruktive handlinger der et utilsiktet
     * klikk utenfor dialogen kan gi datatap.
     * @default true
     */
    closeOnBackdropClick?: boolean;
    /** Innhold — typisk `Modal.Header`, `Modal.Body` og `Modal.Footer`. */
    children?: ReactNode;
    className?: string;
};

type ModalComponent = ForwardRefExoticComponent<ModalProps & RefAttributes<HTMLDialogElement>> & {
    Header: typeof ModalHeader;
    Title: typeof ModalTitle;
    Description: typeof ModalDescription;
    Body: typeof ModalBody;
    Footer: typeof ModalFooter;
    ButtonGroup: typeof ModalButtonGroup;
    CloseButton: typeof ModalCloseButton;
};

const SIZE_ATTR: Record<ModalSize, string | undefined> = {
    small: 'small',
    medium: undefined, // standard — ingen data-size
    large: 'large',
    full: 'full',
};

/**
 * Modal viser innhold i et dialogvindu som krever brukerens oppmerksomhet.
 *
 * Bygger på native `<dialog>` åpnet med `showModal()`. Fokus-trap,
 * Escape-lukking, top-layer-rendering og fokus-retur til triggeren kommer gratis
 * fra nettleseren. Denne komponenten legger til det `<dialog>` ikke gir:
 * kontrollert `open`-state, scroll-lås og backdrop-klikk.
 *
 * Sammensatt av underkomponenter (Radix-stil). Gi alltid en `Modal.Title` — den
 * navngir dialogen for skjermlesere via `aria-labelledby` (WCAG 1.3.1).
 *
 * @example
 * <Modal open={open} onOpenChange={setOpen}>
 *   <Modal.Header>
 *     <Modal.Title>Bekreft sletting</Modal.Title>
 *     <Modal.CloseButton label="Lukk" />
 *   </Modal.Header>
 *   <Modal.Body>
 *     <p>Er du sikker?</p>
 *   </Modal.Body>
 *   <Modal.Footer>
 *     <Modal.ButtonGroup>
 *       <Button onClick={handleDelete}>Slett</Button>
 *       <Button onClick={() => setOpen(false)}>Avbryt</Button>
 *     </Modal.ButtonGroup>
 *   </Modal.Footer>
 * </Modal>
 */
export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal(
    {
        open: openProp,
        defaultOpen = false,
        onOpenChange,
        size = 'medium',
        closeOnBackdropClick = true,
        children,
        className,
    },
    forwardedRef,
): JSX.Element {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const generatedTitleId = useId();
    const generatedDescriptionId = useId();
    const [hasTitle, setHasTitle] = useState(false);
    const [hasDescription, setHasDescription] = useState(false);

    // Kontrollert-eller-ukontrollert (samme mønster som RadioGroup): når `open` er
    // gitt eier konsumenten tilstanden, ellers eier `Modal` den selv.
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : uncontrolledOpen;

    // Samlet lukke/åpne-vei: oppdater intern tilstand i ukontrollert modus og varsle
    // konsumenten i begge modus.
    const handleOpenChange = useCallback(
        (next: boolean) => {
            if (!isControlled) setUncontrolledOpen(next);
            onOpenChange?.(next);
        },
        [isControlled, onOpenChange],
    );

    // Speil `open` til de native metodene. showModal() (ikke show()) gir
    // fokus-trap + top-layer + inert bakgrunn.
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open && !dialog.open) {
            dialog.showModal();
        } else if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    // Scroll-lås på <body> mens dialogen er åpen (det native <dialog> ikke gir).
    useEffect(() => {
        if (!open) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, [open]);

    const registerTitle = useCallback((present: boolean) => {
        setHasTitle(present);
    }, []);

    const registerDescription = useCallback((present: boolean) => {
        setHasDescription(present);
    }, []);

    const requestClose = useCallback(() => {
        handleOpenChange(false);
    }, [handleOpenChange]);

    const contextValue = useMemo<ModalContextValue>(
        () => ({
            titleId: generatedTitleId,
            registerTitle,
            descriptionId: generatedDescriptionId,
            registerDescription,
            requestClose,
        }),
        [
            generatedTitleId,
            registerTitle,
            generatedDescriptionId,
            registerDescription,
            requestClose,
        ],
    );

    // Merge intern ref og videresendt ref til samme <dialog>.
    const setRef = useCallback(
        (node: HTMLDialogElement | null) => {
            dialogRef.current = node;
            if (typeof forwardedRef === 'function') forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
        },
        [forwardedRef],
    );

    return (
        <dialog
            ref={setRef}
            className={clsx('ix-modal', className)}
            data-size={SIZE_ATTR[size]}
            data-no-close-on-backdrop={closeOnBackdropClick ? undefined : ''}
            aria-labelledby={hasTitle ? generatedTitleId : undefined}
            aria-describedby={hasDescription ? generatedDescriptionId : undefined}
            // Dekker Escape (native) og programmatisk .close() fra CloseButton.
            onCancel={() => handleOpenChange(false)}
            onClose={() => {
                // onClose fyrer også etter vår egen .close() i useEffect. Kall kun
                // handleOpenChange når state fortsatt er åpen, så vi ikke looper.
                if (open) handleOpenChange(false);
            }}
            onClick={(e) => {
                // Native ::backdrop er ikke en egen node — klikk på den treffer
                // selve <dialog> (e.target === dialogen). Klikk på innhold treffer
                // et barn.
                if (closeOnBackdropClick && e.target === dialogRef.current) {
                    handleOpenChange(false);
                }
            }}
        >
            <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>
        </dialog>
    );
}) as ModalComponent;

Modal.displayName = 'Modal';
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.ButtonGroup = ModalButtonGroup;
Modal.CloseButton = ModalCloseButton;
