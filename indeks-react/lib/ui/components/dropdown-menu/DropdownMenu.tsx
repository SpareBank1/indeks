import clsx from 'clsx';
import { forwardRef, isValidElement, useEffect, useRef } from 'react';
import type {
    ButtonHTMLAttributes,
    ForwardRefExoticComponent,
    HTMLAttributes,
    JSX,
    MouseEvent,
    ReactElement,
    ReactNode,
    RefAttributes,
} from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// DropdownMenu (root)
// ─────────────────────────────────────────────────────────────────────────────

export type DropdownMenuProps = {
    /** Kontrollert åpen-tilstand. */
    open?: boolean;
    /** Ukontrollert start-tilstand. */
    defaultOpen?: boolean;
    /** Callback ved åpning/lukking. */
    onOpenChange?: (open: boolean) => void;
    /** Posisjon relativt til trigger. @default 'bottom-start' */
    placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
    children?: ReactNode;
    className?: string;
};

export const DropdownMenu = forwardRef<HTMLElement, DropdownMenuProps>(function DropdownMenu(
    { open: controlledOpen, defaultOpen, onOpenChange, placement = 'bottom-start', children, className },
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
        if (!host) return;

        const handleOpen = () => onOpenChange?.(true);
        const handleClose = () => onOpenChange?.(false);

        host.addEventListener('ix-open', handleOpen);
        host.addEventListener('ix-close', handleClose);

        return () => {
            host.removeEventListener('ix-open', handleOpen);
            host.removeEventListener('ix-close', handleClose);
        };
    }, [onOpenChange]);

    return (
        <ix-dropdown
            ref={(node: HTMLElement | null) => {
                hostRef.current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref) ref.current = node;
            }}
            class={clsx('ix-dropdown', className)}
            placement={placement}
            open={defaultOpen ? '' : undefined}
        >
            {children}
        </ix-dropdown>
    );
}) as ForwardRefExoticComponent<DropdownMenuProps & RefAttributes<HTMLElement>> & {
    Trigger: typeof DropdownMenuTrigger;
    Content: typeof DropdownMenuContent;
    Item: typeof DropdownMenuItem;
    Divider: typeof DropdownMenuDivider;
    Sub: typeof DropdownMenuSub;
    SubTrigger: typeof DropdownMenuSubTrigger;
    SubContent: typeof DropdownMenuSubContent;
};

DropdownMenu.displayName = 'DropdownMenu';

// ─────────────────────────────────────────────────────────────────────────────
// Trigger
// ─────────────────────────────────────────────────────────────────────────────

export type DropdownMenuTriggerProps = {
    /** Trigger-element (typisk en Button). */
    children: ReactElement;
};

function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps): JSX.Element {
    if (!isValidElement(children)) {
        throw new Error('DropdownMenu.Trigger krever et React-element som barn');
    }

    return children;
}

DropdownMenuTrigger.displayName = 'DropdownMenu.Trigger';

// ─────────────────────────────────────────────────────────────────────────────
// Content
// ─────────────────────────────────────────────────────────────────────────────

export type DropdownMenuContentProps = HTMLAttributes<HTMLDivElement> & {
    children?: ReactNode;
};

const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
    function DropdownMenuContent({ children, className, ...rest }, ref): JSX.Element {
        return (
            <div ref={ref} className={clsx('ix-dropdown__menu', className)} role="menu" {...rest}>
                {children}
            </div>
        );
    },
);

DropdownMenuContent.displayName = 'DropdownMenu.Content';

// ─────────────────────────────────────────────────────────────────────────────
// Item
// ─────────────────────────────────────────────────────────────────────────────

export type DropdownMenuItemProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
    /** Callback når item velges. */
    onSelect?: () => void;
    /** Destruktiv handling (rød tekst). */
    danger?: boolean;
    /** Valgfritt ikon foran teksten. */
    icon?: ReactNode;
    children?: ReactNode;
};

const DropdownMenuItem = forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
    function DropdownMenuItem(
        { onSelect, danger, icon, children, className, disabled, ...rest },
        ref,
    ): JSX.Element {
        const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
            if (disabled) {
                e.preventDefault();
                return;
            }
            onSelect?.();
        };

        return (
            <button
                ref={ref}
                type="button"
                role="menuitem"
                className={clsx('ix-dropdown__item', className)}
                data-danger={danger ? '' : undefined}
                disabled={disabled}
                aria-disabled={disabled ? 'true' : undefined}
                onClick={handleClick}
                {...rest}
            >
                {icon}
                {children}
            </button>
        );
    },
);

DropdownMenuItem.displayName = 'DropdownMenu.Item';

// ─────────────────────────────────────────────────────────────────────────────
// Divider
// ─────────────────────────────────────────────────────────────────────────────

export type DropdownMenuDividerProps = HTMLAttributes<HTMLHRElement>;

const DropdownMenuDivider = forwardRef<HTMLHRElement, DropdownMenuDividerProps>(
    function DropdownMenuDivider({ className, ...rest }, ref): JSX.Element {
        return (
            <hr
                ref={ref}
                role="separator"
                className={clsx('ix-dropdown__divider', className)}
                {...rest}
            />
        );
    },
);

DropdownMenuDivider.displayName = 'DropdownMenu.Divider';

// ─────────────────────────────────────────────────────────────────────────────
// Sub (submenu container)
// ─────────────────────────────────────────────────────────────────────────────

export type DropdownMenuSubProps = {
    /** Kontrollert åpen-tilstand for submenyen. */
    open?: boolean;
    /** Callback ved åpning/lukking av submenyen. */
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
    className?: string;
};

const DropdownMenuSub = forwardRef<HTMLElement, DropdownMenuSubProps>(function DropdownMenuSub(
    { open: controlledOpen, onOpenChange, children, className },
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
        if (!host) return;

        const handleOpen = () => onOpenChange?.(true);
        const handleClose = () => onOpenChange?.(false);

        host.addEventListener('ix-open', handleOpen);
        host.addEventListener('ix-close', handleClose);

        return () => {
            host.removeEventListener('ix-open', handleOpen);
            host.removeEventListener('ix-close', handleClose);
        };
    }, [onOpenChange]);

    return (
        <ix-dropdown
            ref={(node: HTMLElement | null) => {
                hostRef.current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref) ref.current = node;
            }}
            class={clsx('ix-dropdown', className)}
            data-submenu=""
        >
            {children}
        </ix-dropdown>
    );
});

DropdownMenuSub.displayName = 'DropdownMenu.Sub';

// ─────────────────────────────────────────────────────────────────────────────
// SubTrigger
// ─────────────────────────────────────────────────────────────────────────────

export type DropdownMenuSubTriggerProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
    /** Valgfritt ikon foran teksten. */
    icon?: ReactNode;
    children?: ReactNode;
};

const DropdownMenuSubTrigger = forwardRef<HTMLButtonElement, DropdownMenuSubTriggerProps>(
    function DropdownMenuSubTrigger({ icon, children, className, disabled, ...rest }, ref): JSX.Element {
        return (
            <button
                ref={ref}
                type="button"
                role="menuitem"
                className={clsx('ix-dropdown__item', 'ix-dropdown__submenu-trigger', className)}
                disabled={disabled}
                aria-disabled={disabled ? 'true' : undefined}
                {...rest}
            >
                {icon}
                {children}
                <span className="ix-dropdown__chevron" aria-hidden="true" />
            </button>
        );
    },
);

DropdownMenuSubTrigger.displayName = 'DropdownMenu.SubTrigger';

// ─────────────────────────────────────────────────────────────────────────────
// SubContent
// ─────────────────────────────────────────────────────────────────────────────

export type DropdownMenuSubContentProps = HTMLAttributes<HTMLDivElement> & {
    children?: ReactNode;
};

const DropdownMenuSubContent = forwardRef<HTMLDivElement, DropdownMenuSubContentProps>(
    function DropdownMenuSubContent({ children, className, ...rest }, ref): JSX.Element {
        return (
            <div ref={ref} className={clsx('ix-dropdown__menu', className)} role="menu" {...rest}>
                {children}
            </div>
        );
    },
);

DropdownMenuSubContent.displayName = 'DropdownMenu.SubContent';

// ─────────────────────────────────────────────────────────────────────────────
// Attach sub-components
// ─────────────────────────────────────────────────────────────────────────────

DropdownMenu.Trigger = DropdownMenuTrigger;
DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Divider = DropdownMenuDivider;
DropdownMenu.Sub = DropdownMenuSub;
DropdownMenu.SubTrigger = DropdownMenuSubTrigger;
DropdownMenu.SubContent = DropdownMenuSubContent;

