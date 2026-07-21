import clsx from 'clsx';
import { forwardRef, useEffect, useRef, useState } from 'react';
import type { ForwardRefExoticComponent, JSX, ReactNode, RefAttributes } from 'react';
import { TabsContext } from './TabsContext';
import { TabsList } from './TabsList';
import { TabsTab } from './TabsTab';
import { TabsPanel } from './TabsPanel';
import type { TabsListProps } from './TabsList';
import type { TabsTabProps } from './TabsTab';
import type { TabsPanelProps } from './TabsPanel';

export type TabsProps = {
    /**
     * Kontrollert valgt fane (dens `value`). Kombiner med `onChange`. La React
     * eie tilstanden.
     */
    value?: string;
    /** Ukontrollert start-fane (dens `value`). Web componenten eier videre. */
    defaultValue?: string;
    /** Kalles med `value` for fanen brukeren aktiverer. */
    onChange?: (value: string) => void;
    /** `Tabs.List` og `Tabs.Panel`-elementer. */
    children?: ReactNode;
    className?: string;
};

// Compound-wrapper over web componentene ix-tabs/ix-tab-list/ix-tab/ix-tab-panel.
// WC-en eier all ARIA-kabling, tastatur, roving tabindex og panel-visning.
// React eier kun props-API, initial valgt fane, speiling av kontrollert `value`
// og bro fra WC-ens `change`-event til `onChange`. Valgt-tilstand uttrykkes som
// aria-selected på fanene — samme kilde WC-en leser fra.
export const Tabs = forwardRef<HTMLElement, TabsProps>(function Tabs(
    { value: controlledValue, defaultValue, onChange, children, className },
    ref,
): JSX.Element {
    const hostRef = useRef<HTMLElement | null>(null);

    const isControlled = controlledValue !== undefined;
    // Stabil start-verdi til barna (aria-selected/hidden i JSX). Lazy initializer
    // fanger verdien ved første render og endres aldri — effecten under synker
    // kontrollert `value` etter mount, og WC-en eier tilstanden ukontrollert.
    const [initialValue] = useState(() => (isControlled ? controlledValue : defaultValue));

    // Kontrollert: speil `value` inn i fanenes aria-selected når den endres.
    // WC-ens MutationObserver reconcile-r roving tabindex og panel-visning.
    useEffect(() => {
        if (!isControlled) return;
        const host = hostRef.current;
        if (!host) return;
        for (const tab of host.querySelectorAll<HTMLElement>('ix-tab, [role="tab"]')) {
            const tabValue = tab.getAttribute('data-value');
            tab.setAttribute('aria-selected', tabValue === controlledValue ? 'true' : 'false');
        }
    }, [isControlled, controlledValue]);

    // Bro: les valgt fanes value fra WC-ens change-event og rapporter til konsument.
    useEffect(() => {
        const host = hostRef.current;
        if (!host || !onChange) return;
        const handler = () => {
            const selected = host.querySelector<HTMLElement>('ix-tab[aria-selected="true"], [role="tab"][aria-selected="true"]');
            const selectedValue = selected?.getAttribute('data-value');
            if (selectedValue != null) onChange(selectedValue);
        };
        host.addEventListener('change', handler);
        return () => host.removeEventListener('change', handler);
    }, [onChange]);

    return (
        <TabsContext.Provider value={{ initialValue }}>
            <ix-tabs
                ref={(node: HTMLElement | null) => {
                    hostRef.current = node;
                    if (typeof ref === 'function') ref(node);
                    else if (ref) ref.current = node;
                }}
                class={clsx('ix-tabs', className)}
            >
                {children}
            </ix-tabs>
        </TabsContext.Provider>
    );
}) as ForwardRefExoticComponent<TabsProps & RefAttributes<HTMLElement>> & {
    List: typeof TabsList;
    Tab: typeof TabsTab;
    Panel: typeof TabsPanel;
};

Tabs.displayName = 'Tabs';
Tabs.List = TabsList;
Tabs.Tab = TabsTab;
Tabs.Panel = TabsPanel;

export type { TabsListProps, TabsTabProps, TabsPanelProps };
