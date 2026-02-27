import clsx from 'clsx';
import React from 'react';

type ButtonProps<T extends React.ElementType = 'button'> = {
    as?: T;
    variant?: 'primary' | 'secondary' | 'tertiary';
    danger?: boolean;
    loading?: boolean;
    loadingLabel?: string;
    size?: 'sm' | 'md' | 'lg';
    width?: 'full' | 'auto';
    children: React.ReactNode;
    className?: string;
    ariaLabel?: string;
} & React.ComponentPropsWithoutRef<T>;

export function Button<T extends React.ElementType = 'button'>({
    as,
    children,
    variant = 'primary',
    danger = false,
    loading = false,
    loadingLabel,
    size = 'md',
    width = 'auto',
    type = 'button',
    className,
    ariaLabel,
    ...props
}: ButtonProps<T>) {
    const Component = as || 'button';
    return (
        <Component
            className={clsx(
                'ix-button',
                `ix-button--${variant}${danger ? '-danger' : ''}`,
                { [`ix-button--${size}`]: size !== 'md' },
                { 'ix-w-full': width === 'full' },
                className
            )}
            aria-label={loading ? loadingLabel : ariaLabel}
            aria-disabled={loading ? 'true' : undefined}
            type={type}
            {...props}
        >
            {loading ? 'Loading...' : children}
        </Component>
    );
}
