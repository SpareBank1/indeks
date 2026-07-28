import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export type ValidationMessageProps = {
    children?: ReactNode;
    className?: string;
    /**
     * Vis feilikonet (en badge: hvit glyf på rød sirkel) foran teksten.
     * Ikonet er dekorativt (`aria-hidden`) — feilen formidles av teksten.
     * @default true
     */
    showIcon?: boolean;
} & HTMLAttributes<HTMLSpanElement>;

export const ValidationMessage = forwardRef<HTMLSpanElement, ValidationMessageProps>(function ValidationMessage(
    { children, className, showIcon = true, ...restProps },
    ref
) {
    const hasContent = children !== undefined && children !== null && children !== '' && children !== false;
    return (
        <span ref={ref} {...restProps} data-field="error" className={clsx(className)}>
            {hasContent && showIcon && <ix-icon data-badge="" data-status="danger" name="close" aria-hidden="true" />}
            {children}
        </span>
    );
});
