import clsx from 'clsx';
import { forwardRef, useState } from 'react';
import type { JSX, ReactNode } from 'react';

export type MessageStatus = 'info' | 'success' | 'warning' | 'danger';

export type MessageProps = {
    /** Status; styrer farge, ikon og ARIA. Settes som `data-status` slik at
     *  fargevariablene (`--ix-color-status-*`) kobles automatisk. */
    status: MessageStatus;
    /** Valgfri tittel. */
    title?: string;
    /** Body-tekst (ikke-expandable) / ekspandert innhold (expandable). Lenker
     *  skrives som children med Indeks-lenken `LinkText`. */
    children?: ReactNode;
    /** aria-label på lukkeknappen. Lukkeknappen vises kun når denne er satt, og
     *  kun i ikke-utvidbar modus (utvidbar Message har ingen lukkeknapp). */
    closeLabel?: string;
    /** Kalles når brukeren klikker på lukkeknappen, etter at meldingen er skjult. */
    onClose?: () => void;
    /** Aktiverer expandable-modus (native `<details>`). */
    expandable?: boolean;
    /** Alltid synlig sammendrag. Brukes kun når `expandable`. */
    summary?: string;
    /** Start ekspandert. Brukes kun når `expandable`. @default false */
    defaultOpen?: boolean;
    className?: string;
};

/** Material Design-ikon per status (sendes til badge-ikonet). */
const STATUS_ICON: Record<MessageStatus, string> = {
    info: 'info_i',
    success: 'check',
    warning: 'priority_high',
    danger: 'priority_high',
};

/** ARIA: feil/advarsel er assertive, info/suksess er polite. */
function ariaAttributes(status: MessageStatus): {
    role?: 'alert';
    'aria-live'?: 'polite';
} {
    if (status === 'warning' || status === 'danger') {
        return { role: 'alert' };
    }
    return { 'aria-live': 'polite' };
}

export const Message = forwardRef<HTMLElement, MessageProps>(function Message(
    {
        status,
        title,
        children,
        closeLabel,
        onClose,
        expandable = false,
        summary,
        defaultOpen = false,
        className,
    },
    ref,
): JSX.Element | null {
    const [closed, setClosed] = useState(false);

    if (closed) {
        return null;
    }

    function handleClose(): void {
        setClosed(true);
        onClose?.();
    }

    if (expandable) {
        return (
            <details
                ref={ref as React.Ref<HTMLDetailsElement>}
                className={clsx('ix-message', className)}
                data-status={status}
                data-expandable=""
                open={defaultOpen || undefined}
            >
                <summary className="ix-message__summary">
                    {/* Dekorativt statusikon — sirkel (status-`fill` via CSS) +
                        glyf (materialdesignname per status). */}
                    <ix-icon data-badge="" materialdesignname={STATUS_ICON[status]} aria-hidden="true" />
                    <div className="ix-message__body">
                        {title && <strong className="ix-message__title">{title}</strong>}
                        {summary && <p>{summary}</p>}
                    </div>
                </summary>
                <div className="ix-message__expanded">{children}</div>
            </details>
        );
    }

    return (
        <div
            ref={ref as React.Ref<HTMLDivElement>}
            className={clsx('ix-message', className)}
            data-status={status}
            {...ariaAttributes(status)}
        >
            {/* Dekorativt statusikon — sirkel (status-`fill` via CSS) +
                glyf (materialdesignname per status). */}
            <ix-icon data-badge="" materialdesignname={STATUS_ICON[status]} aria-hidden="true" />
            <div className="ix-message__body">
                {title && <strong className="ix-message__title">{title}</strong>}
                {children}
            </div>
            {closeLabel && (
                <button
                    className="ix-message__close"
                    type="button"
                    aria-label={closeLabel}
                    onClick={handleClose}
                />
            )}
        </div>
    );
});
