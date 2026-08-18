import { cn } from '../../../cn';
import { forwardRef, isValidElement, useEffect, useRef } from 'react';
import type {
    ForwardRefExoticComponent,
    HTMLAttributes,
    JSX,
    ReactElement,
    ReactNode,
    RefAttributes,
} from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Popover (root)
// ─────────────────────────────────────────────────────────────────────────────

export type PopoverProps = {
    /** Kontrollert åpen-tilstand. */
    open?: boolean;
    /** Ukontrollert start-tilstand. */
    defaultOpen?: boolean;
    /** Callback ved åpning/lukking. */
    onOpenChange?: (open: boolean) => void;
    /** Posisjon relativt til trigger. @default 'top' */
    placement?: 'top' | 'bottom' | 'left' | 'right';
    /** Vis/skjul pilmarkør. @default true */
    arrow?: boolean;
    children?: ReactNode;
    className?: string;
};

export const Popover = forwardRef<HTMLElement, PopoverProps>(function Popover(
    {
        open: controlledOpen,
        defaultOpen,
        onOpenChange,
        placement = 'top',
        arrow = true,
        children,
        className,
    },
    ref,
): JSX.Element {
    const hostRef = useRef<HTMLElement | null>(null);
    const isControlled = controlledOpen !== undefined;

    useEffect(() => {
        const host = hostRef.current;
        if (!host || !isControlled) return;

        if (controlledOpen) {
            host.setAttribute('open', '');
        } else {
            host.removeAttribute('open');
        }
    }, [isControlled, controlledOpen]);

    useEffect(() => {
        const host = hostRef.current;
        if (!host || isControlled || !defaultOpen) return;
        host.setAttribute('open', '');
    }, []);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;

        if (isControlled) {
            const handleOpenRequest = () => onOpenChange?.(true);
            const handleCloseRequest = () => onOpenChange?.(false);

            host.addEventListener('open-request', handleOpenRequest);
            host.addEventListener('close-request', handleCloseRequest);

            return () => {
                host.removeEventListener('open-request', handleOpenRequest);
                host.removeEventListener('close-request', handleCloseRequest);
            };
        } else {
            const handleOpen = () => onOpenChange?.(true);
            const handleClose = () => onOpenChange?.(false);

            host.addEventListener('open', handleOpen);
            host.addEventListener('close', handleClose);

            return () => {
                host.removeEventListener('open', handleOpen);
                host.removeEventListener('close', handleClose);
            };
        }
    }, [isControlled, onOpenChange]);

    return (
        <ix-popover
            ref={(node: HTMLElement | null) => {
                hostRef.current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref) ref.current = node;
            }}
            class={cn('ix-popover', className)}
            placement={placement}
            data-arrow={arrow ? undefined : 'false'}
            data-controlled={isControlled ? '' : undefined}
        >
            {children}
        </ix-popover>
    );
}) as ForwardRefExoticComponent<PopoverProps & RefAttributes<HTMLElement>> & {
    Trigger: typeof PopoverTrigger;
    Content: typeof PopoverContent;
    Heading: typeof PopoverHeading;
    Body: typeof PopoverBody;
    Actions: typeof PopoverActions;
};

Popover.displayName = 'Popover';

// ─────────────────────────────────────────────────────────────────────────────
// Trigger
// ─────────────────────────────────────────────────────────────────────────────

export type PopoverTriggerProps = {
    /** Trigger-element (typisk en Button). */
    children: ReactElement;
};

function PopoverTrigger({ children }: PopoverTriggerProps): JSX.Element {
    if (!isValidElement(children)) {
        throw new Error('Popover.Trigger krever et React-element som barn');
    }

    return children;
}

PopoverTrigger.displayName = 'Popover.Trigger';

// ─────────────────────────────────────────────────────────────────────────────
// Content
// ─────────────────────────────────────────────────────────────────────────────

export type PopoverContentProps = HTMLAttributes<HTMLDivElement> & {
    children?: ReactNode;
};

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
    function PopoverContent({ children, className, ...rest }, ref): JSX.Element {
        return (
            <div ref={ref} className={cn('ix-popover__content', className)} {...rest}>
                {children}
            </div>
        );
    },
);

PopoverContent.displayName = 'Popover.Content';

// ─────────────────────────────────────────────────────────────────────────────
// Heading
// ─────────────────────────────────────────────────────────────────────────────

export type PopoverHeadingProps = HTMLAttributes<HTMLDivElement> & {
    children?: ReactNode;
};

const PopoverHeading = forwardRef<HTMLDivElement, PopoverHeadingProps>(
    function PopoverHeading({ children, className, ...rest }, ref): JSX.Element {
        return (
            <div ref={ref} className={cn('ix-popover__heading', className)} {...rest}>
                {children}
            </div>
        );
    },
);

PopoverHeading.displayName = 'Popover.Heading';

// ─────────────────────────────────────────────────────────────────────────────
// Body
// ─────────────────────────────────────────────────────────────────────────────

export type PopoverBodyProps = HTMLAttributes<HTMLDivElement> & {
    children?: ReactNode;
};

const PopoverBody = forwardRef<HTMLDivElement, PopoverBodyProps>(
    function PopoverBody({ children, className, ...rest }, ref): JSX.Element {
        return (
            <div ref={ref} className={cn('ix-popover__body', className)} {...rest}>
                {children}
            </div>
        );
    },
);

PopoverBody.displayName = 'Popover.Body';

// ─────────────────────────────────────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────────────────────────────────────

export type PopoverActionsProps = HTMLAttributes<HTMLDivElement> & {
    children?: ReactNode;
};

const PopoverActions = forwardRef<HTMLDivElement, PopoverActionsProps>(
    function PopoverActions({ children, className, ...rest }, ref): JSX.Element {
        return (
            <div ref={ref} className={cn('ix-popover__actions', className)} {...rest}>
                {children}
            </div>
        );
    },
);

PopoverActions.displayName = 'Popover.Actions';

// ─────────────────────────────────────────────────────────────────────────────
// Attach sub-components
// ─────────────────────────────────────────────────────────────────────────────

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
Popover.Heading = PopoverHeading;
Popover.Body = PopoverBody;
Popover.Actions = PopoverActions;
