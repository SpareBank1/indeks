import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tabs, Icon } from '@sb1/indeks-react';

const meta = {
    title: 'Components/Tabs',
    component: Tabs,
    tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Faner lar brukeren veksle mellom likeverdige innholdsseksjoner på samme side.
 * Piltast flytter fokus mellom fanene (manuell aktivering); Enter eller Mellomrom
 * aktiverer den fokuserte fanen. Marker start-fanen med `defaultValue`.
 */
export const Standard: Story = {
    render: () => (
        <Tabs defaultValue="oversikt">
            <Tabs.List ariaLabel="Kontoinformasjon">
                <Tabs.Tab value="oversikt">Oversikt</Tabs.Tab>
                <Tabs.Tab value="transaksjoner">Transaksjoner</Tabs.Tab>
                <Tabs.Tab value="innstillinger">Innstillinger</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="oversikt">
                <p>Saldo og nøkkeltall for kontoen.</p>
            </Tabs.Panel>
            <Tabs.Panel value="transaksjoner">
                <p>De siste inn- og utbetalingene.</p>
            </Tabs.Panel>
            <Tabs.Panel value="innstillinger">
                <p>Navn, varsler og kontoinnstillinger.</p>
            </Tabs.Panel>
        </Tabs>
    ),
};

/**
 * Fanene kan ha et ikon foran teksten. Ikonet følger samme tilstandsfarge som
 * teksten (aktiv/passiv).
 */
export const MedIkon: Story = {
    name: 'Med ikon',
    render: () => (
        <Tabs defaultValue="konto">
            <Tabs.List ariaLabel="Bankoversikt">
                <Tabs.Tab value="konto">
                    <Icon name="account_balance" /> Konto
                </Tabs.Tab>
                <Tabs.Tab value="betalinger">
                    <Icon name="payments" /> Betalinger
                </Tabs.Tab>
                <Tabs.Tab value="sparing">
                    <Icon name="savings" /> Sparing
                </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="konto">
                <p>Oversikt over kontoene dine.</p>
            </Tabs.Panel>
            <Tabs.Panel value="betalinger">
                <p>Kommende og utførte betalinger.</p>
            </Tabs.Panel>
            <Tabs.Panel value="sparing">
                <p>Sparemål og renter.</p>
            </Tabs.Panel>
        </Tabs>
    ),
};

/**
 * Faner som kun viser et ikon må ha et tilgjengelig navn via `ariaLabel`
 * (oversettes av konsumenten) — ellers får skjermlesere ingen fane-etikett.
 */
export const KunIkon: Story = {
    name: 'Kun ikon',
    render: () => (
        <Tabs defaultValue="hjem">
            <Tabs.List ariaLabel="Navigasjon">
                <Tabs.Tab value="hjem" ariaLabel="Hjem">
                    <Icon name="home" />
                </Tabs.Tab>
                <Tabs.Tab value="profil" ariaLabel="Profil">
                    <Icon name="person" />
                </Tabs.Tab>
                <Tabs.Tab value="innstillinger" ariaLabel="Innstillinger">
                    <Icon name="settings" />
                </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="hjem">
                <p>Hjem-innhold.</p>
            </Tabs.Panel>
            <Tabs.Panel value="profil">
                <p>Profil-innhold.</p>
            </Tabs.Panel>
            <Tabs.Panel value="innstillinger">
                <p>Innstillinger-innhold.</p>
            </Tabs.Panel>
        </Tabs>
    ),
};

/**
 * Ren HTML med web componenten `<ix-tabs>` — uten React-wrapper. Forfatteren
 * skriver semantisk markup og setter `aria-selected` på start-fanen og `hidden`
 * på de skjulte panelene; web componenten kobler resten (roller, `aria-controls`,
 * roving `tabindex`, tastatur og panel-visning) ved mount.
 */
export const HTML: Story = {
    render: () => (
        <ix-tabs class="ix-tabs">
            <ix-tab-list class="ix-tabs__list" aria-label="Kontoinformasjon">
                <ix-tab class="ix-tabs__tab" aria-selected="true">
                    Oversikt
                </ix-tab>
                <ix-tab class="ix-tabs__tab" aria-selected="false">
                    Transaksjoner
                </ix-tab>
                <ix-tab class="ix-tabs__tab" aria-selected="false">
                    Innstillinger
                </ix-tab>
            </ix-tab-list>
            <ix-tab-panel class="ix-tabs__panel">
                <p>Saldo og nøkkeltall for kontoen.</p>
            </ix-tab-panel>
            <ix-tab-panel class="ix-tabs__panel" hidden>
                <p>De siste inn- og utbetalingene.</p>
            </ix-tab-panel>
            <ix-tab-panel class="ix-tabs__panel" hidden>
                <p>Navn, varsler og kontoinnstillinger.</p>
            </ix-tab-panel>
        </ix-tabs>
    ),
};
