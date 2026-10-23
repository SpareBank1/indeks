import React, { type ReactNode } from 'react';
import {
    Accordion,
    Button,
    Card,
    Checkbox,
    CheckboxGroup,
    Combobox,
    DateField,
    Grid,
    Heading,
    Icon,
    InteractiveIcon,
    Label,
    Message,
    MessageRegion,
    Pagination,
    PhoneNumberField,
    ProgressBar,
    RadioGroup,
    ReadMore,
    Select,
    Spinner,
    Surface,
    Tabs,
    Tag,
    Text,
    TextArea,
    TextField,
    ValidationMessage,
    VStack,
} from '@sb1/indeks-react';

// Rekkefølgen her er rekkefølgen i kategorivisningen.
export const kategorier = ['Primitiver', 'Layout', 'Innhold', 'Overlay', 'Navigasjon', 'Varsling', 'Skjema'] as const;

export type Kategori = (typeof kategorier)[number];

export interface KomponentOppføring {
    navn: string;
    href: string;
    kategori: Kategori;
    beskrivelse: string;
    /** Statisk utsnitt av komponenten. Vises inert og skjult for skjermleser. */
    forhåndsvisning: ReactNode;
}

const celle = 'ix-color-surface-info-default ix-px-sm ix-py-2xs';

export const komponenter: KomponentOppføring[] = [
    {
        navn: 'Accordion',
        href: '/docs/komponenter/accordion',
        kategori: 'Innhold',
        beskrivelse: 'Viser og skjuler innhold i seksjoner.',
        forhåndsvisning: (
            <Accordion>
                <Accordion.Item>
                    <Accordion.Header>Hvordan logger jeg inn?</Accordion.Header>
                    <Accordion.Content>Med BankID.</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Header>Hva koster det?</Accordion.Header>
                    <Accordion.Content>Ingenting.</Accordion.Content>
                </Accordion.Item>
            </Accordion>
        ),
    },
    {
        navn: 'Button',
        href: '/docs/komponenter/button',
        kategori: 'Primitiver',
        beskrivelse: 'Lar brukeren utføre en handling, som å sende inn et skjema eller gå videre.',
        forhåndsvisning: <Button>Send inn</Button>,
    },
    {
        navn: 'Card',
        href: '/docs/komponenter/card',
        kategori: 'Innhold',
        beskrivelse: 'En avgrenset, selvstendig innholdsenhet med fast ramme og bakgrunn.',
        forhåndsvisning: (
            <Card padding="md">
                <Text>Brukskonto</Text>
                <Text>12 345,00 kr</Text>
            </Card>
        ),
    },
    {
        navn: 'Checkbox',
        href: '/docs/komponenter/skjema/checkbox',
        kategori: 'Skjema',
        beskrivelse: 'Ett enkelt ja/nei-valg, for eksempel å godta vilkår.',
        forhåndsvisning: <Checkbox label="Jeg godtar vilkårene" name="oversikt-checkbox" defaultChecked />,
    },
    {
        navn: 'CheckboxGroup',
        href: '/docs/komponenter/skjema/checkbox-group',
        kategori: 'Skjema',
        beskrivelse: 'Flere relaterte valg der brukeren kan velge ett eller flere.',
        forhåndsvisning: (
            <CheckboxGroup
                legend="Hvordan vil du bli kontaktet?"
                name="oversikt-checkbox-group"
                defaultValue={['epost']}
                options={[
                    { value: 'epost', label: 'E-post' },
                    { value: 'sms', label: 'SMS' },
                ]}
            />
        ),
    },
    {
        navn: 'Chip',
        href: '/docs/komponenter/chip',
        kategori: 'Skjema',
        beskrivelse: 'Små, interaktive elementer for raske valg, filtrering eller handlinger.',
        forhåndsvisning: (
            <RadioGroup
                variant="chip"
                orientation="horizontal"
                legend="Periode"
                hideLegend
                name="oversikt-chip"
                defaultValue="3m"
                options={[
                    { value: '1m', label: '1 mnd' },
                    { value: '3m', label: '3 mnd' },
                    { value: '12m', label: '12 mnd' },
                ]}
            />
        ),
    },
    {
        navn: 'Combobox',
        href: '/docs/komponenter/skjema/combobox',
        kategori: 'Skjema',
        beskrivelse: 'Lar brukeren søke etter og velge fra en liste.',
        forhåndsvisning: (
            <Combobox
                label="Land"
                noHitsText="Ingen treff"
                toggleLabel="Vis alternativer"
                options={[
                    { value: 'no', label: 'Norge' },
                    { value: 'se', label: 'Sverige' },
                ]}
            />
        ),
    },
    {
        navn: 'DateField',
        href: '/docs/komponenter/skjema/date-field',
        kategori: 'Skjema',
        beskrivelse: 'Dato i norsk format, med enhetens innebygde kalender.',
        forhåndsvisning: <DateField label="Fødselsdato" openLabel="Åpne kalender" name="oversikt-date-field" />,
    },
    {
        navn: 'DropdownMenu',
        href: '/docs/komponenter/dropdown-menu',
        kategori: 'Overlay',
        beskrivelse: 'Nedtrekksmeny for handlinger eller navigasjon.',
        forhåndsvisning: (
            <Button variant="secondary">
                Handlinger <Icon name="expand_more" />
            </Button>
        ),
    },
    {
        navn: 'Grid',
        href: '/docs/komponenter/primitives/grid',
        kategori: 'Layout',
        beskrivelse: 'Layout-primitiv som legger innhold i rader og kolonner.',
        forhåndsvisning: (
            <Grid cols={3}>
                <div className={celle}>1</div>
                <div className={celle}>2</div>
                <div className={celle}>3</div>
                <div className={celle}>4</div>
                <div className={celle}>5</div>
                <div className={celle}>6</div>
            </Grid>
        ),
    },
    {
        navn: 'Icon',
        href: '/docs/komponenter/icon',
        kategori: 'Primitiver',
        beskrivelse: 'SVG-ikoner fra SpareBank 1s ikonsett.',
        forhåndsvisning: (
            <div className="ix-flex ix-gap-sm">
                <Icon name="home" size="lg" />
                <Icon name="search" size="lg" />
                <Icon name="settings" size="lg" />
            </div>
        ),
    },
    {
        navn: 'InteractiveIcon',
        href: '/docs/komponenter/interactive-icon',
        kategori: 'Primitiver',
        beskrivelse: 'En kompakt knapp som bare viser et ikon.',
        forhåndsvisning: <InteractiveIcon name="edit" aria-label="Rediger" />,
    },
    {
        navn: 'Label',
        href: '/docs/komponenter/skjema/label',
        kategori: 'Skjema',
        beskrivelse: 'Ledeteksten til et skjemafelt.',
        forhåndsvisning: <Label>Kontonummer</Label>,
    },
    {
        navn: 'Message',
        href: '/docs/komponenter/message',
        kategori: 'Varsling',
        beskrivelse: 'Formidler status eller resultatet av en handling uten å avbryte flyten.',
        forhåndsvisning: (
            <MessageRegion>
                <Message status="success">Betalingen er sendt</Message>
            </MessageRegion>
        ),
    },
    {
        navn: 'Modal',
        href: '/docs/komponenter/modal',
        kategori: 'Overlay',
        beskrivelse: 'Innhold oppå siden som brukeren må forholde seg til før hen går videre.',
        forhåndsvisning: <Button variant="secondary">Vis detaljer</Button>,
    },
    {
        navn: 'Pagination',
        href: '/docs/komponenter/pagination',
        kategori: 'Navigasjon',
        beskrivelse: 'Deler store mengder innhold i sider.',
        forhåndsvisning: (
            <Pagination
                page={2}
                count={5}
                onPageChange={() => {}}
                previousLabel="Forrige"
                nextLabel="Neste"
                ariaLabel="Sidenavigering"
                pageLabel={(side) => `Side ${side}`}
            />
        ),
    },
    {
        navn: 'PhoneNumberField',
        href: '/docs/komponenter/skjema/phone-number-field',
        kategori: 'Skjema',
        beskrivelse: 'Telefonnummer med landkode.',
        forhåndsvisning: (
            <PhoneNumberField
                label="Mobilnummer"
                countryLabel="Landkode"
                numberLabel="Telefonnummer"
                noHitsText="Ingen treff"
                defaultCountryCode="47"
            />
        ),
    },
    {
        navn: 'Popover',
        href: '/docs/komponenter/popover',
        kategori: 'Overlay',
        beskrivelse: 'Kontekstuell informasjon eller handlinger knyttet til et element.',
        forhåndsvisning: <Button variant="secondary">Åpne popover</Button>,
    },
    {
        navn: 'ProgressBar',
        href: '/docs/komponenter/progress-bar',
        kategori: 'Primitiver',
        beskrivelse: 'Viser fremdriften i én sammenhengende prosess.',
        forhåndsvisning: <ProgressBar value={60} label="Laster opp" showValue />,
    },
    {
        navn: 'RadioGroup',
        href: '/docs/komponenter/skjema/radio-group',
        kategori: 'Skjema',
        beskrivelse: 'Ett valg fra en liste av gjensidig utelukkende alternativer.',
        forhåndsvisning: (
            <RadioGroup
                legend="Kundetype"
                name="oversikt-radio-group"
                defaultValue="privat"
                options={[
                    { value: 'privat', label: 'Privat' },
                    { value: 'bedrift', label: 'Bedrift' },
                ]}
            />
        ),
    },
    {
        navn: 'ReadMore',
        href: '/docs/komponenter/read-more',
        kategori: 'Innhold',
        beskrivelse: 'Viser og skjuler én frittstående tekstblokk.',
        forhåndsvisning: <ReadMore label="Hva betyr dette?">Forklaring.</ReadMore>,
    },
    {
        navn: 'Select',
        href: '/docs/komponenter/skjema/select',
        kategori: 'Skjema',
        beskrivelse: 'Ett valg fra en nedtrekksliste.',
        forhåndsvisning: (
            <Select
                label="Land"
                defaultValue="no"
                options={[
                    { value: 'no', label: 'Norge' },
                    { value: 'se', label: 'Sverige' },
                ]}
            />
        ),
    },
    {
        navn: 'Spinner',
        href: '/docs/komponenter/spinner',
        kategori: 'Primitiver',
        beskrivelse: 'Viser at noe lastes inn.',
        forhåndsvisning: <Spinner />,
    },
    {
        navn: 'Stack',
        href: '/docs/komponenter/primitives/stack',
        kategori: 'Layout',
        beskrivelse: 'Layout-primitiv som stabler innhold vertikalt eller horisontalt.',
        forhåndsvisning: (
            <VStack>
                <div className={celle}>Element 1</div>
                <div className={celle}>Element 2</div>
                <div className={celle}>Element 3</div>
            </VStack>
        ),
    },
    {
        navn: 'Surface',
        href: '/docs/komponenter/surface',
        kategori: 'Layout',
        beskrivelse: 'En flate som samler beslektede elementer og skiller dem fra resten av siden.',
        forhåndsvisning: (
            <Surface status="info" radius="md" padding="md">
                <Text>Samlet på én flate</Text>
            </Surface>
        ),
    },
    {
        navn: 'Tabs',
        href: '/docs/komponenter/tabs',
        kategori: 'Navigasjon',
        beskrivelse: 'Veksler mellom likeverdige innholdsseksjoner på samme side.',
        forhåndsvisning: (
            <Tabs defaultValue="oversikt">
                <Tabs.List ariaLabel="Konto">
                    <Tabs.Tab value="oversikt">Oversikt</Tabs.Tab>
                    <Tabs.Tab value="transaksjoner">Transaksjoner</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="oversikt">Saldo og nøkkeltall.</Tabs.Panel>
                <Tabs.Panel value="transaksjoner">Transaksjoner.</Tabs.Panel>
            </Tabs>
        ),
    },
    {
        navn: 'Tag',
        href: '/docs/komponenter/tag',
        kategori: 'Innhold',
        beskrivelse: 'Ikke-interaktiv etikett som merker eller kategoriserer innhold.',
        forhåndsvisning: (
            <div className="ix-flex ix-gap-xs">
                <Tag variant="info">Ny</Tag>
                <Tag variant="success">Betalt</Tag>
            </div>
        ),
    },
    {
        navn: 'TextArea',
        href: '/docs/komponenter/skjema/textarea',
        kategori: 'Skjema',
        beskrivelse: 'Lengre fritekst over flere linjer.',
        forhåndsvisning: <TextArea label="Tilbakemelding" rows={2} />,
    },
    {
        navn: 'TextField',
        href: '/docs/komponenter/skjema/textfield',
        kategori: 'Skjema',
        beskrivelse: 'Kortere tekst eller tall, som kontonummer eller beløp.',
        forhåndsvisning: <TextField label="Kontonummer" />,
    },
    {
        navn: 'Tooltip',
        href: '/docs/komponenter/skjema/tooltip',
        kategori: 'Skjema',
        beskrivelse: 'Liten informasjonsboks knyttet til et skjemafelt.',
        forhåndsvisning: (
            <TextField label="Navn" tooltip="Fullt navn som i passet" tooltipLabel="Mer informasjon om Navn" />
        ),
    },
    {
        navn: 'Typografi',
        href: '/docs/komponenter/typografi',
        kategori: 'Primitiver',
        beskrivelse: 'Overskrifter, brødtekst og lenketekst.',
        forhåndsvisning: (
            <div>
                <Heading as="h3" size="lg">
                    Overskrift
                </Heading>
                <Text>Brødtekst</Text>
            </div>
        ),
    },
    {
        navn: 'ValidationMessage',
        href: '/docs/komponenter/skjema/validation-message',
        kategori: 'Skjema',
        beskrivelse: 'Feilmelding knyttet til et skjemafelt eller en feltgruppe.',
        forhåndsvisning: <ValidationMessage>Du må velge et alternativ</ValidationMessage>,
    },
];
