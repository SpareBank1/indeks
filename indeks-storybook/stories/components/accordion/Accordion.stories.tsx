import type { Meta, StoryObj } from '@storybook/react-vite';

import { Accordion, Icon, LinkText, ListElement } from '@sb1/indeks-react';

const meta = {
    title: 'Components/Accordion',
    component: Accordion,
    tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Seksjonene er uavhengige — brukeren kan ha flere åpne samtidig. Marker
 * seksjoner som bør være åpne ved start med `defaultOpen`.
 */
export const Standard: Story = {
    render: () => (
        <Accordion>
            <Accordion.Item defaultOpen>
                <Accordion.Header>Hvordan logger jeg inn?</Accordion.Header>
                <Accordion.Content>
                    <p>Du logger inn med BankID eller BankID på mobil øverst til høyre.</p>
                </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
                <Accordion.Header>Hvordan endrer jeg passord?</Accordion.Header>
                <Accordion.Content>
                    <p>Gå til Innstillinger → Sikkerhet og velg «Endre passord».</p>
                </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
                <Accordion.Header>Hvordan sperrer jeg kortet?</Accordion.Header>
                <Accordion.Content>
                    <p>Du kan sperre kortet under Kort → Sperr kort, eller ringe kundeservice.</p>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    ),
};

/**
 * Headeren støtter et prefiks-ikon foran tittelen (`Accordion.Header` tar
 * ReactNode).
 */
export const MedIkon: Story = {
    name: 'Med prefiks-ikon',
    render: () => (
        <Accordion>
            <Accordion.Item>
                <Accordion.Header>
                    <Icon name="betalingskort" /> Kort og betaling
                </Accordion.Header>
                <Accordion.Content>
                    <p>Administrer kortene dine, sperr kort og se betalinger.</p>
                </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
                <Accordion.Header>
                    <Icon name="innstillinger" /> Sikkerhet
                </Accordion.Header>
                <Accordion.Content>
                    <p>Endre passord og se påloggingshistorikk.</p>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    ),
};

/**
 * Innholdet kan bestå av tekst, lister, lenker og andre komponenter.
 */
export const RiktInnhold: Story = {
    name: 'Rikt innhold',
    render: () => (
        <Accordion>
            <Accordion.Item defaultOpen>
                <Accordion.Header>Hva er inkludert?</Accordion.Header>
                <Accordion.Content>
                    <p>Avtalen inkluderer blant annet:</p>
                    <ListElement as="ul">
                        <li>Nettbank og mobilbank</li>
                        <li>Gratis kortbruk i Norge</li>
                        <li>Varsling på SMS</li>
                    </ListElement>
                    <p>
                        Les mer i <LinkText href="#">vilkårene</LinkText>.
                    </p>
                </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
                <Accordion.Header>Hva koster det?</Accordion.Header>
                <Accordion.Content>
                    <p>Se gjeldende priser i prislisten.</p>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    ),
};

/**
 * Ren HTML uten React-wrapper. Native `<details>/<summary>` gir semantikk og
 * tastatur — ingen JavaScript eller ARIA-attributter er nødvendig.
 */
export const HTML: Story = {
    render: () => (
        <div className="ix-accordion">
            <details className="ix-accordion__item" open>
                <summary className="ix-accordion__header">Første seksjon</summary>
                <div className="ix-accordion__content">
                    <p>Innhold i første seksjon.</p>
                </div>
            </details>
            <details className="ix-accordion__item">
                <summary className="ix-accordion__header">Andre seksjon</summary>
                <div className="ix-accordion__content">
                    <p>Innhold i andre seksjon.</p>
                </div>
            </details>
        </div>
    ),
};
