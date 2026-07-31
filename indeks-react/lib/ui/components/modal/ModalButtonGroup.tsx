import { cn } from '../../../cn';
import { forwardRef } from 'react';
import type { HTMLAttributes, JSX } from 'react';

export type ModalButtonGroupProps = HTMLAttributes<HTMLDivElement>;

/**
 * Knapperad for `Modal.Footer`. Høyrejusterer handlingene og bryter dem til
 * flere linjer på smale skjermer.
 */
export const ModalButtonGroup = forwardRef<HTMLDivElement, ModalButtonGroupProps>(
    function ModalButtonGroup({ children, className, ...props }, ref): JSX.Element {
        return (
            <div ref={ref} className={cn('ix-modal__button-group', className)} {...props}>
                {children}
            </div>
        );
    },
);
