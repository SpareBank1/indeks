import clsx from 'clsx';
import type { ElementType, JSX } from 'react';
import { Box, type BoxProps } from '../box/Box';

export type HStackProps<T extends ElementType = 'div'> = BoxProps<T>;

export function HStack<T extends ElementType = 'div'>({
    children,
    className,
    as,
    ...restProps
}: HStackProps<T>): JSX.Element {
    return (
        <Box as={as ?? 'div'} className={clsx('ix-hstack', className)} {...restProps}>
            {children}
        </Box>
    );
}
