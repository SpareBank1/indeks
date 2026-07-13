import clsx from 'clsx';

/**
 * Statustema som kobles via `data-status` og `--ix-color-status-*`
 * (se @sb1/indeks-utils/css/status-colors.css). `"neutral"` gir den nøytrale
 * `main`-flaten. Delt av Surface/Card/InteractiveIcon (Message utleder sin egen
 * uten `neutral`). Verdien settes som `data-status` direkte på elementet.
 */
export type Status = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type Border = 'default' | 'dashed';
export type Radius = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'pill' | 'circle';
export type Size = '0' | '4xs' | '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type GapSize = 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
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
