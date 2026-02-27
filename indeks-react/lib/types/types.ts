import clsx from 'clsx';

export type SurfaceColor = 'main' | 'accent' | 'info' | 'success' | 'warning' | 'danger' | 'interactive';
export type Border = 'default' | 'dashed';
export type Size = '0' | '4xs' | '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type ComponentSize = 'sm' | 'md' | 'lg';

export type LimitedSpacingProps = {
    margin?: Size;
    padding?: Size;
    marginLeft?: Size;
    marginRight?: Size;
    marginTop?: Size;
    marginBottom?: Size;
};

export type SpacingProps = {
    margin?: Size;
    padding?: Size;
    marginLeft?: Size;
    marginRight?: Size;
    marginTop?: Size;
    marginBottom?: Size;
    paddingLeft?: Size;
    paddingRight?: Size;
    paddingTop?: Size;
    paddingBottom?: Size;
    marginX?: Size;
    marginY?: Size;
    paddingX?: Size;
    paddingY?: Size;
};

export function extractComponentSizeClassname(componentClass: string, size?: ComponentSize) {
    const cls = clsx({
        [`${componentClass}--${size}`]: size && size !== 'md',
    });
    return {
        componentSizeClassName: cls,
    };
}

export function extractSpacingClassnameFromProps(props: SpacingProps) {
    const {
        margin,
        marginX,
        marginY,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        padding,
        paddingX,
        paddingY,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        ...restProps
    } = {
        ...props,
    };
    const cls = clsx({
        [`ix-m-${margin}`]: margin,
        [`ix-mx-${marginX}`]: marginX,
        [`ix-mt-${marginTop}`]: marginTop,
        [`ix-my-${marginY}`]: marginY,
        [`ix-mb-${marginBottom}`]: marginBottom,
        [`ix-ml-${marginLeft}`]: marginLeft,
        [`ix-mr-${marginRight}`]: marginRight,
        [`ix-p-${padding}`]: padding,
        [`ix-px-${paddingX}`]: paddingX,
        [`ix-py-${paddingY}`]: paddingY,
        [`ix-pt-${paddingTop}`]: paddingTop,
        [`ix-pb-${paddingBottom}`]: paddingBottom,
        [`ix-pl-${paddingLeft}`]: paddingLeft,
        [`ix-pr-${paddingRight}`]: paddingRight,
    });
    return {
        propsWitoutSpacingProps: restProps,
        spacingClassName: cls,
    };
}
