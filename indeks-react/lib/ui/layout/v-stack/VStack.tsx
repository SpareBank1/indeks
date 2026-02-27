import clsx from 'clsx';
import type { JSX } from 'react';
import { Box, type BoxProps } from '../box/Box';

export function VStack({ children, className, ...restProps }: BoxProps<'div'>): JSX.Element {
    return (
        <Box as="div" className={clsx('ix-vstack', className)} alignItems="start" {...restProps}>
            {children}
        </Box>
    );
}
