import clsx from 'clsx';
import { forwardRef } from 'react';
import type { HTMLAttributes, JSX } from 'react';

export type ModalBodyProps = HTMLAttributes<HTMLDivElement>;

/**
 * Innholdsområdet i en `Modal`. Eneste region som scroller når innholdet er
 * høyere enn dialogen — `Modal.Header` og `Modal.Footer` står fast.
 */
export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(function ModalBody(
    { children, className, ...props },
    ref,
): JSX.Element {
    return (
        <div ref={ref} className={clsx('ix-modal__body', className)} {...props}>
            {children}
        </div>
    );
});
