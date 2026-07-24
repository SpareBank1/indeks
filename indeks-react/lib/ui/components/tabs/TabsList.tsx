import clsx from 'clsx';
import { type JSX, type ReactNode } from 'react';

export type TabsListProps = {
    /** Fanene — `Tabs.Tab`-elementer. */
    children?: ReactNode;
    /**
     * Tilgjengelig navn på fane-lista (i18n — konsumenten oversetter). Anbefalt
     * når flere `Tabs` finnes på samme side, så skjermlesere kan skille dem.
     */
    ariaLabel?: string;
    className?: string;
};

/**
 * Beholderen for fanene. Rendres som `<ix-tab-list>`; web componenten setter
 * `role="tablist"` og `aria-orientation`, og håndterer tastaturnavigasjon.
 */
export function TabsList({ children, ariaLabel, className }: TabsListProps): JSX.Element {
    return (
        <ix-tab-list class={clsx('ix-tabs__list', className)} aria-label={ariaLabel}>
            {children}
        </ix-tab-list>
    );
}
