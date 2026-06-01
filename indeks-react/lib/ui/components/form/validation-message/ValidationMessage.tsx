import clsx from 'clsx';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export type ValidationMessageProps = {
    children?: ReactNode;
    className?: string;
} & HTMLAttributes<HTMLSpanElement>;

export const ValidationMessage = forwardRef<HTMLSpanElement, ValidationMessageProps>(function ValidationMessage(
    { children, className, ...restProps },
    ref
) {
    return (
        <span ref={ref} {...restProps} data-field="error" className={clsx(className)}>
            {children}
        </span>
    );
});
