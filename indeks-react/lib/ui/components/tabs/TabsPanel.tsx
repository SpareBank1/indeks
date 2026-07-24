import clsx from 'clsx';
import { useContext, type JSX, type ReactNode } from 'react';
import { TabsContext } from './TabsContext';

export type TabsPanelProps = {
    /** Verdien som knytter panelet til sitt `Tabs.Tab` (samme `value`). */
    value: string;
    /** Innholdet som vises når fanen med samme `value` er valgt. */
    children?: ReactNode;
    className?: string;
};

/**
 * Innholdspanelet for én fane. Rendres som `<ix-tab-panel>`; web componenten
 * setter `role`, kobler `aria-labelledby` til fanen og styrer synlighet
 * (`hidden`). React setter kun initial `hidden` (fra `Tabs`' start-verdi) og
 * `data-value` for kobling.
 */
export function TabsPanel({ value, children, className }: TabsPanelProps): JSX.Element {
    const ctx = useContext(TabsContext);
    const selected = ctx?.initialValue === value;

    return (
        <ix-tab-panel class={clsx('ix-tabs__panel', className)} data-value={value} hidden={!selected}>
            {children}
        </ix-tab-panel>
    );
}
