import clsx from 'clsx';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, JSX } from 'react';
import { Icon } from '../../icons';
import { useModalContext } from './ModalContext';

export type ModalCloseButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> & {
    /**
     * Tilgjengelig navn for lukk-knappen. Påkrevd — knappen viser bare et ikon,
     * så skjermlesere trenger teksten. Må oversettes av konsumenten (i18n),
     * f.eks. «Lukk» / «Lukk» / «Close».
     */
    label: string;
};

/**
 * Ikon-knapp som lukker `Modal`. Kaller `onOpenChange(false)` via konteksten.
 * En egen `onClick` kjøres i tillegg.
 */
export const ModalCloseButton = forwardRef<HTMLButtonElement, ModalCloseButtonProps>(
    function ModalCloseButton({ label, className, onClick, ...props }, ref): JSX.Element {
        const { requestClose } = useModalContext('Modal.CloseButton');

        return (
            <button
                ref={ref}
                type="button"
                className={clsx('ix-modal__close', className)}
                aria-label={label}
                onClick={(e) => {
                    onClick?.(e);
                    if (!e.defaultPrevented) requestClose();
                }}
                {...props}
            >
                <Icon name="close" aria-hidden />
            </button>
        );
    },
);
