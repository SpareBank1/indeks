import clsx from 'clsx';
import type { ComponentPropsWithoutRef, JSX } from 'react';

export type ProgressBarState = 'active' | 'success' | 'error';

export type ProgressBarProps = {
    /** Progresjonsverdi 0–100. Clampes automatisk. @default 0 */
    value?: number;
    /** Tilstand. @default "active" */
    state?: ProgressBarState;
    /** Synlig label over progress-linja. */
    label?: string;
    /** Støttetekst under progress-linja. */
    supportText?: string;
    /** Ekstra CSS-klasse på rotelementet. */
    className?: string;
} & ComponentPropsWithoutRef<'div'>;

export function ProgressBar({
    value = 0,
    state = 'active',
    label,
    supportText,
    className,
    ...restProps
}: ProgressBarProps): JSX.Element {
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
        <ix-progress-bar
            value={clampedValue}
            data-state={state}
            label={label}
            data-support-text={supportText}
            class={clsx('ix-progress-bar', className)}
            {...restProps}
        />
    );
}
