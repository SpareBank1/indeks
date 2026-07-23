import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from './Tabs';

function renderBasic(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
    return render(
        <Tabs {...props}>
            <Tabs.List ariaLabel="Kontoinformasjon">
                <Tabs.Tab value="oversikt">Oversikt</Tabs.Tab>
                <Tabs.Tab value="detaljer">Detaljer</Tabs.Tab>
                <Tabs.Tab value="historikk">Historikk</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="oversikt">Oversikt-innhold</Tabs.Panel>
            <Tabs.Panel value="detaljer">Detaljer-innhold</Tabs.Panel>
            <Tabs.Panel value="historikk">Historikk-innhold</Tabs.Panel>
        </Tabs>,
    );
}

describe('Tabs — rendering', () => {
    it('rendrer tablist, faner og paneler med riktige roller', () => {
        renderBasic();
        expect(screen.getByRole('tablist')).toBeTruthy();
        expect(screen.getAllByRole('tab')).toHaveLength(3);
        // Skjulte paneler er ikke i a11y-treet; kun det valgte er synlig
        expect(screen.getByRole('tabpanel')).toBeTruthy();
    });

    it('setter aria-label på tab-lista', () => {
        renderBasic();
        expect(screen.getByRole('tablist').getAttribute('aria-label')).toBe('Kontoinformasjon');
    });

    it('sender className videre til ix-tabs-roten', () => {
        const { container } = renderBasic({ className: 'egen-klasse' });
        const root = container.querySelector('ix-tabs');
        expect(root?.classList.contains('ix-tabs')).toBe(true);
        expect(root?.classList.contains('egen-klasse')).toBe(true);
    });
});

describe('Tabs — initial valg', () => {
    it('velger første fane som default', () => {
        renderBasic();
        expect(screen.getByRole('tab', { name: 'Oversikt' }).getAttribute('aria-selected')).toBe('true');
        expect(screen.getByRole('tabpanel').textContent).toBe('Oversikt-innhold');
    });

    it('respekterer defaultValue', () => {
        renderBasic({ defaultValue: 'detaljer' });
        expect(screen.getByRole('tab', { name: 'Detaljer' }).getAttribute('aria-selected')).toBe('true');
        expect(screen.getByRole('tabpanel').textContent).toBe('Detaljer-innhold');
    });

    it('respekterer kontrollert value', () => {
        renderBasic({ value: 'detaljer' });
        expect(screen.getByRole('tab', { name: 'Detaljer' }).getAttribute('aria-selected')).toBe('true');
    });
});

describe('Tabs — interaksjon og onChange', () => {
    it('kaller onChange med value når en fane klikkes', () => {
        const onChange = vi.fn();
        renderBasic({ onChange });
        fireEvent.click(screen.getByRole('tab', { name: 'Detaljer' }));
        expect(onChange).toHaveBeenCalledWith('detaljer');
    });

    it('bytter panel ved klikk (ukontrollert)', () => {
        renderBasic();
        fireEvent.click(screen.getByRole('tab', { name: 'Detaljer' }));
        expect(screen.getByRole('tabpanel').textContent).toBe('Detaljer-innhold');
    });
});

describe('Tabs — kontrollert', () => {
    it('speiler ny value inn i aria-selected når den endres', async () => {
        const { rerender } = renderBasic({ value: 'oversikt' });
        expect(screen.getByRole('tab', { name: 'Oversikt' }).getAttribute('aria-selected')).toBe('true');

        rerender(
            <Tabs value="detaljer">
                <Tabs.List ariaLabel="Kontoinformasjon">
                    <Tabs.Tab value="oversikt">Oversikt</Tabs.Tab>
                    <Tabs.Tab value="detaljer">Detaljer</Tabs.Tab>
                    <Tabs.Tab value="historikk">Historikk</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="oversikt">Oversikt-innhold</Tabs.Panel>
                <Tabs.Panel value="detaljer">Detaljer-innhold</Tabs.Panel>
                <Tabs.Panel value="historikk">Historikk-innhold</Tabs.Panel>
            </Tabs>,
        );

        expect(screen.getByRole('tab', { name: 'Detaljer' }).getAttribute('aria-selected')).toBe('true');
        expect(screen.getByRole('tab', { name: 'Oversikt' }).getAttribute('aria-selected')).toBe('false');
        // Panelvisning reconcile-s av WC-ens MutationObserver (mikrotask).
        await waitFor(() => expect(screen.getByRole('tabpanel').textContent).toBe('Detaljer-innhold'));
    });
});
