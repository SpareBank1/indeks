import clsx from 'clsx';
import { forwardRef } from 'react';
import type { HTMLAttributes, JSX } from 'react';

export type ModalHeaderProps = HTMLAttributes<HTMLDivElement>;

/**
 * Toppseksjonen i en `Modal` — inneholder typisk `Modal.Title` og
 * `Modal.CloseButton`. Står fast når `Modal.Body` scroller.
 */
export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(function ModalHeader(
    { children, className, ...props },
    ref,
): JSX.Element {
    return (
        <div ref={ref} className={clsx('ix-modal__header', className)} {...props}>
            {children}
        </div>
    );
});
