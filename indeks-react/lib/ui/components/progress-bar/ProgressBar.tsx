import clsx from 'clsx';
import { useId, type ComponentPropsWithoutRef, type JSX } from 'react';

export type ProgressBarState = 'active' | 'success' | 'error';

export type ProgressBarProps = {
    /** Progresjonsverdi 0–100. Clampes automatisk. @default 0 */
    value?: number;
    /** Tilstand. Utelat for active (standard). */
    state?: ProgressBarState;
    /** Synlig label over progress-linja. */
    label?: string;
    /** Ekstra CSS-klasse på rotelementet. */
    className?: string;
} & ComponentPropsWithoutRef<'div'>;

export function ProgressBar({
    value = 0,
    state,
    label,
    className,
    ...restProps
}: ProgressBarProps): JSX.Element {
    const id = useId();
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
        <ix-progress-bar
            state={state !== 'active' ? state : undefined}
            class={clsx('ix-progress-bar', className)}
            {...restProps}
        >
            {label && <label htmlFor={id}>{label}</label>}
            <progress id={label ? id : undefined} value={clampedValue} max={100} />
        </ix-progress-bar>
    );
}
