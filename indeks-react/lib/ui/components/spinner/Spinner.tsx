import type { ComponentPropsWithoutRef, JSX } from 'react';
import clsx from 'clsx';
import { extractComponentSizeClassname, type ComponentSize } from '../../../types/types';

const texts = {
    nb: { ariaLabel: 'Laster...' },
    nn: { ariaLabel: 'Lastar...' },
    en: { ariaLabel: 'Loading...' },
};

export type SpinnerProps = {
    className?: string;
    loadingText?: React.ReactNode;
    /** 'nb', 'nn', or 'en' */
    locale?: 'nb' | 'nn' | 'en';
    size?: ComponentSize;
} & ComponentPropsWithoutRef<'div'>;

export function Spinner({ className, loadingText, locale = 'nb', size = 'md' }: SpinnerProps): JSX.Element {
    const { componentSizeClassName } = extractComponentSizeClassname('ix-loading-spinner', size);

    return (
        <div
            aria-live="assertive"
            className={clsx('ix-loading-spinner-container', className)}
            data-testid="spinner-container"
        >
            <span
                className={clsx('ix-loading-spinner', componentSizeClassName)}
                role="img"
                aria-label={typeof loadingText === 'string' ? loadingText : texts[locale].ariaLabel}
                aria-hidden={!!loadingText}
            />
            {loadingText}
        </div>
    );
}
