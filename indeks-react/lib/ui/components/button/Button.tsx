import clsx from 'clsx';
import { forwardRef } from 'react';
import type {
    ButtonHTMLAttributes,
    ComponentPropsWithRef,
    ElementType,
    FC,
    JSX,
    ReactNode,
    RefAttributes,
} from 'react';
import { Spinner } from '../spinner/Spinner';

type LoadingProps =
    | { loading?: false; loadingLabel?: string }
    | { loading: true; loadingLabel: string };

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
    LoadingProps & {
        /** Visuell variant. @default "primary" */
        variant?: 'primary' | 'secondary' | 'tertiary';
        /** Bruk fare-farger for destruktive handlinger. */
        danger?: boolean;
        /** @default "md" */
        size?: 'sm' | 'md' | 'lg';
        /** @default "auto" */
        width?: 'full' | 'auto';
        /** Gjør knappen rund — bruk kun når innholdet er et enkelt ikon. Krever aria-label. */
        iconOnly?: boolean;
        children?: ReactNode;
        /** Render som annet element eller komponent, f.eks. "a". */
        as?: ElementType;
    };

interface OverridableComponent<Component, Element extends HTMLElement> {
    (props: Component & RefAttributes<Element>): ReturnType<FC>;
    <As extends ElementType>(
        props: { as: As } & Component & Omit<ComponentPropsWithRef<As>, keyof Component | 'as'>,
    ): ReturnType<FC>;
}

export const Button: OverridableComponent<ButtonProps, HTMLButtonElement> = forwardRef<
    HTMLButtonElement,
    ButtonProps
>(function Button(
    {
        as,
        children,
        variant = 'primary',
        danger = false,
        loading = false,
        loadingLabel,
        size = 'md',
        width = 'auto',
        iconOnly = false,
        type = 'button',
        disabled,
        className,
        'aria-label': ariaLabel,
        ...props
    },
    ref,
): JSX.Element {
    const Component = (as ?? 'button') as ElementType;
    return (
        <Component
            ref={ref}
            className={clsx('ix-button', width === 'full' && 'ix-w-full', className)}
            data-variant={variant}
            data-size={size !== 'md' ? size : undefined}
            data-danger={danger ? 'true' : undefined}
            data-loading={loading ? 'true' : undefined}
            data-icon-only={iconOnly ? '' : undefined}
            aria-label={loading ? loadingLabel : ariaLabel}
            disabled={loading ? true : disabled}
            type={type}
            {...props}
        >
            {loading ? (
                <>
                    <Spinner aria-hidden />
                    {loadingLabel}
                </>
            ) : (
                children
            )}
        </Component>
    );
});
