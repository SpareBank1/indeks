import clsx from 'clsx';
import { forwardRef } from 'react';
import type { HTMLAttributes, JSX } from 'react';

export type ModalFooterProps = HTMLAttributes<HTMLDivElement>;

/**
 * Bunnseksjonen i en `Modal` — typisk en `Modal.ButtonGroup` med handlinger.
 * Står fast når `Modal.Body` scroller.
 */
export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(function ModalFooter(
    { children, className, ...props },
    ref,
): JSX.Element {
    return (
        <div ref={ref} className={clsx('ix-modal__footer', className)} {...props}>
            {children}
        </div>
    );
});
