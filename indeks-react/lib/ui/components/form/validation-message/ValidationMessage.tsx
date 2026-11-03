import { cn } from '../../../../cn';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export type ValidationMessageProps = {
    children?: ReactNode;
    className?: string;
    /**
     * Vis feilikonet (hvit glyf på rød badge) foran teksten.
     * Ikonet er dekorativt (`aria-hidden`) — feilen formidles av teksten.
     * @default true
     */
    showIcon?: boolean;
    /**
     * `success` gir en bekreftende melding (grønn, sirkel med hake). Settes som
     * `data-status`. @default "danger"
     */
    status?: 'danger' | 'success';
} & HTMLAttributes<HTMLSpanElement>;

export const ValidationMessage = forwardRef<HTMLSpanElement, ValidationMessageProps>(function ValidationMessage(
    { children, className, showIcon = true, status = 'danger', ...restProps },
    ref
) {
    const hasContent = children !== undefined && children !== null && children !== '' && children !== false;
    return (
        <span
            ref={ref}
            {...restProps}
            data-field="error"
            data-status={status === 'success' ? 'success' : undefined}
            className={cn(className)}
        >
            {hasContent && showIcon && (
                <ix-icon
                    data-badge=""
                    data-status={status}
                    name={status === 'success' ? 'check' : 'close'}
                    aria-hidden="true"
                />
            )}
            {children}
        </span>
    );
});
