import clsx from 'clsx';
import { forwardRef, useEffect } from 'react';
import type { HTMLAttributes, JSX } from 'react';
import { useModalContext } from './ModalContext';

export type ModalTitleProps = HTMLAttributes<HTMLHeadingElement>;

/**
 * Overskriften i en `Modal`. Rendres som `<h2>` og registrerer sin id i
 * `Modal`-konteksten, slik at `<dialog aria-labelledby>` peker hit automatisk —
 * dialogen får dermed et tilgjengelig navn uten ekstra arbeid (WCAG 1.3.1).
 *
 * Teksten kommer fra `children` og oversettes av konsumenten (i18n).
 */
export const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(function ModalTitle(
    { children, className, id, ...props },
    ref,
): JSX.Element {
    const { titleId, registerTitle } = useModalContext('Modal.Title');

    useEffect(() => {
        registerTitle(true);
        return () => registerTitle(false);
    }, [registerTitle]);

    return (
        <h2 ref={ref} id={id ?? titleId} className={clsx('ix-modal__title', className)} {...props}>
            {children}
        </h2>
    );
});
