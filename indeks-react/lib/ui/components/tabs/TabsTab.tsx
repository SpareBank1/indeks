import clsx from 'clsx';
import { useContext, type JSX, type ReactNode } from 'react';
import { TabsContext } from './TabsContext';

export type TabsTabProps = {
    /**
     * Verdien som knytter fanen til sitt `Tabs.Panel` (samme `value`). Påkrevd
     * og unik innenfor samme `Tabs`.
     */
    value: string;
    /** Fane-etiketten — tekst, ikon, eller ikon + tekst. */
    children?: ReactNode;
    /**
     * Tilgjengelig navn når fanen kun viser et ikon (i18n — konsumenten
     * oversetter). Uten synlig tekst må dette settes.
     */
    ariaLabel?: string;
    className?: string;
};

/**
 * En enkelt fane i `Tabs.List`. Rendres som `<ix-tab>`; web componenten setter
 * `role`, roving `tabindex` og styrer aktiv-tilstand. React setter kun initial
 * `aria-selected` (fra `Tabs`' start-verdi) og bærer `value` via `data-value`
 * slik at `Tabs` kan mappe tilbake til verdien i sin change-bro.
 */
export function TabsTab({ value, children, ariaLabel, className }: TabsTabProps): JSX.Element {
    const ctx = useContext(TabsContext);
    const selected = ctx?.initialValue === value;

    return (
        <ix-tab
            class={clsx('ix-tabs__tab', className)}
            data-value={value}
            aria-selected={selected ? 'true' : 'false'}
            aria-label={ariaLabel}
        >
            {children}
        </ix-tab>
    );
}
