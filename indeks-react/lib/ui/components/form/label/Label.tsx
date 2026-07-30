import { cn } from '../../../../cn';
import { forwardRef, type LabelHTMLAttributes, type ReactNode } from 'react';

export type LabelProps = {
    children?: ReactNode;
    className?: string;
} & LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
    { children, className, ...restProps },
    ref
) {
    return (
        <label ref={ref} {...restProps} className={cn('ix-label', className)}>
            {children}
        </label>
    );
});
