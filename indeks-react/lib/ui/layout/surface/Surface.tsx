import clsx from 'clsx';
import type { ComponentPropsWithoutRef, ElementType, JSX, ReactNode } from 'react';
import {
    extractSpacingClassnameFromProps,
    type Border,
    type GapSize,
    type Radius,
    type SpacingProps,
    type Status,
} from '../../../types/types';

export type SurfaceProps<As extends ElementType = 'div'> = {
    as?: As;
    ref?: React.Ref<HTMLElement>;
    children?: ReactNode;
    className?: string;
    /**
     * Statusfarge på flaten. Settes som `data-status` og kobler
     * `--ix-color-status-*` (samme system som Message/Card). `"neutral"` gir
     * den nøytrale flaten. @default "neutral"
     */
    status?: Status;
    border?: Border;
    radius?: Radius;
    fullWidth?: boolean;
    direction?: 'row' | 'column';
    justifyContent?: 'start' | 'end' | 'center' | 'space-between';
    alignItems?: 'start' | 'end' | 'center' | 'baseline';
    gap?: GapSize;
} & SpacingProps &
    ComponentPropsWithoutRef<As>;

const justifyClass: Record<NonNullable<SurfaceProps['justifyContent']>, string> = {
    start: 'ix-justify-start',
    end: 'ix-justify-end',
    center: 'ix-justify-center',
    'space-between': 'ix-justify-between',
};

/**
 * Surface er en enkel visuell flate som grupperer innhold, gjerne med en
 * surface-farge. Den er bevisst enklere enn Card (ingen elevation eller
 * klikk-affordanse), og bygger i sin helhet på utility-klasser.
 */
export function Surface<As extends ElementType = 'div'>(props: SurfaceProps<As>): JSX.Element {
    const {
        border,
        radius,
        gap,
        className,
        status = 'neutral',
        fullWidth,
        direction,
        justifyContent,
        alignItems,
        as: Component = 'div',
        ...restProps
    } = {
        ...props,
    };

    const { spacingClassName, propsWitoutSpacingProps } = extractSpacingClassnameFromProps(restProps);

    const _className = clsx(
        'ix-surface',
        {
            [`ix-border-${border}`]: border,
            [`ix-radius-${radius}`]: radius,
            [`ix-gap-${gap}`]: gap,
            'ix-w-full': !!fullWidth,
            [`ix-flex-${direction === 'row' ? 'row' : 'col'}`]: direction,
            [justifyClass[justifyContent as NonNullable<typeof justifyContent>]]: justifyContent,
            [`ix-items-${alignItems}`]: alignItems,
        },
        spacingClassName,
        className
    );

    // Statustema kobles via data-status (som Card/Message): CSS leser
    // --ix-color-status-surface. "neutral" ligger i default-gruppen i
    // status-colors.css og gir den nøytrale flaten på elementet, uansett forelder.
    return <Component {...propsWitoutSpacingProps} className={_className} data-status={status} />;
}
