import clsx from 'clsx';
import React, { type ComponentPropsWithoutRef } from 'react';

type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type size = '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';

function getsizeFromElement(element: HeadingElement): size {
    switch (element) {
        case 'h1':
            return '2xl';
        case 'h2':
            return 'xl';
        case 'h3':
            return 'lg';
        case 'h4':
            return 'md';
        case 'h5':
            return 'sm';
        case 'h6':
            return 'xs';
    }
}

function getSpacingFromElement(element: size): string {
    switch (element) {
        case '2xl':
            return 'ix-mb-sm';
        case 'xl':
            return 'ix-mb-xs';
        case 'lg':
            return 'ix-mb-sm';
        case 'md':
            return 'ix-mb-2xs';
        case 'sm':
            return 'ix-mb-2xs';
        default:
        case 'xs':
            return 'ix-mb-2xs';
    }
}

export type HeadingProps = React.ComponentProps<HeadingElement> & {
    as: HeadingElement;
    className?: string;
    size?: size;
    addRecommendedSpacing?: boolean;
} & ComponentPropsWithoutRef<HeadingElement>;

export const Heading = ({ as, className, size, addRecommendedSpacing, ...rest }: HeadingProps) => {
    const Component = as;
    const headingSize = size ?? getsizeFromElement(as);
    const headingClass = `ix-heading--${headingSize.toLowerCase()}`;
    const spacingClass = addRecommendedSpacing ? getSpacingFromElement(headingSize) : '';

    return <Component className={clsx('ix-heading', headingClass, spacingClass, className)} {...rest} />;
};
