import clsx from 'clsx';
import type { ComponentPropsWithoutRef, ElementType, JSX, ReactNode } from 'react';
import type { GapSize } from '../../../types/types';

export type GridCols =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 'auto-fit-xs'
    | 'auto-fit-sm'
    | 'auto-fit-md'
    | 'auto-fit-lg'
    | 'auto-fill-xs'
    | 'auto-fill-sm'
    | 'auto-fill-md'
    | 'auto-fill-lg';

export type GridRows = 1 | 2 | 3 | 4;

export type GridAlign = 'start' | 'end' | 'center' | 'stretch';

export type GridJustify = 'start' | 'end' | 'center' | 'stretch';

export type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';

export type RowSpan = 1 | 2 | 3 | 4 | 'full';

export type GridProps<As extends ElementType = 'div'> = {
    as?: As;
    ref?: React.Ref<HTMLElement>;
    children?: ReactNode;
    className?: string;
    cols?: GridCols;
    rows?: GridRows;
    gap?: GapSize;
    align?: GridAlign;
    justify?: GridJustify;
    inline?: boolean;
} & Omit<ComponentPropsWithoutRef<As>, 'as'>;

export function Grid<As extends ElementType = 'div'>({
    as,
    children,
    className,
    cols,
    rows,
    gap,
    align,
    justify,
    inline,
    ...restProps
}: GridProps<As>): JSX.Element {
    if (as) {
        const Component = as as ElementType;
        const colsClass = cols ? `ix-grid-${typeof cols === 'number' ? `cols-${cols}` : cols}` : undefined;
        const rowsClass = rows ? `ix-grid-rows-${rows}` : undefined;
        const gapClass = gap && gap !== 'md' ? `ix-gap-${gap}` : undefined;
        const alignClass = align ? `ix-grid-align-${align}` : undefined;
        const justifyClass = justify ? `ix-grid-justify-${justify}` : undefined;
        const inlineClass = inline ? 'ix-inline-grid' : undefined;
        return (
            <Component
                className={clsx('ix-grid', colsClass, rowsClass, gapClass, alignClass, justifyClass, inlineClass, className)}
                {...restProps}
            >
                {children}
            </Component>
        );
    }
    return (
        <ix-grid
            cols={cols?.toString()}
            rows={rows?.toString()}
            gap={gap}
            align={align}
            justify={justify}
            inline={inline ? '' : undefined}
            class={className}
            {...restProps}
        >
            {children}
        </ix-grid>
    );
}

export type GridItemProps<As extends ElementType = 'div'> = {
    as?: As;
    ref?: React.Ref<HTMLElement>;
    children?: ReactNode;
    className?: string;
    colspan?: ColSpan;
    rowspan?: RowSpan;
} & Omit<ComponentPropsWithoutRef<As>, 'as'>;

export function GridItem<As extends ElementType = 'div'>({
    as,
    children,
    className,
    colspan,
    rowspan,
    ...restProps
}: GridItemProps<As>): JSX.Element {
    const Component = (as ?? 'div') as ElementType;
    const colspanClass = colspan ? `ix-col-span-${colspan}` : undefined;
    const rowspanClass = rowspan ? `ix-row-span-${rowspan}` : undefined;
    return (
        <Component className={clsx(colspanClass, rowspanClass, className)} {...restProps}>
            {children}
        </Component>
    );
}

Grid.Item = GridItem;
