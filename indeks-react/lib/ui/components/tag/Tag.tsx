import { cn } from '../../../cn';
import { forwardRef } from 'react';
import type {
    ComponentPropsWithRef,
    ElementType,
    FC,
    HTMLAttributes,
    JSX,
    ReactNode,
    RefAttributes,
} from 'react';

export type TagVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

// Flat interface som extender HTMLAttributes — ikke generisk, ikke type-alias
// med `&`. Begge deler bryter react-docgen-typescript (tom Storybook Controls).
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
    /** Semantisk status som styrer farge. Settes som `data-status` og kobler
     *  status-farge-kaskaden. @default "neutral" */
    variant?: TagVariant;
    /** Visuell profil. `emphasis` = mettet flate + hvit tekst, `subtle` =
     *  pastell-flate + farget tekst. @default "emphasis" */
    type?: 'emphasis' | 'subtle';
    /** @default "md" */
    size?: 'sm' | 'md' | 'lg';
    children?: ReactNode;
    /** Render som annet element, f.eks. "a" eller "button". @default "span" */
    as?: ElementType;
}

interface OverridableComponent<Component, Element extends HTMLElement> {
    (props: Component & RefAttributes<Element>): ReturnType<FC>;
    <As extends ElementType>(
        props: { as: As } & Component & Omit<ComponentPropsWithRef<As>, keyof Component | 'as'>,
    ): ReturnType<FC>;
}

export const Tag: OverridableComponent<TagProps, HTMLSpanElement> = forwardRef<
    HTMLSpanElement,
    TagProps
>(function Tag(
    { as, children, variant = 'neutral', type = 'emphasis', size = 'md', className, ...rest },
    ref,
): JSX.Element {
    const Component = (as ?? 'span') as ElementType;
    return (
        <Component
            ref={ref}
            className={cn('ix-tag', className)}
            data-status={variant}
            data-variant={type}
            data-size={size !== 'md' ? size : undefined}
            {...rest}
        >
            {children}
        </Component>
    );
});
