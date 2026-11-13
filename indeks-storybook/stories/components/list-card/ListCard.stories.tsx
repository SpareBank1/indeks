import type { Meta, StoryObj } from '@storybook/react-vite';

import { ListCard, Row } from '@sb1/indeks-react';

const kontoer = [
    <Row
        key="brukskonto"
        title="Brukskonto fordelsprogram"
        subtitle="2030 08 44813"
        href="#"
        navigation="internal"
        leading={<Row.Leading variant="icon-background" icon="account_balance" />}
        trailing={<Row.TrailingLabel label="21 397 kr" />}
    />,
    <Row
        key="felles"
        title="Margit Yousef Bach"
        subtitle="3705 44 46842"
        href="#"
        navigation="internal"
        leading={<Row.Leading variant="icon-background" icon="account_balance" badgeIcon="group" />}
        trailing={<Row.TrailingLabel label="3 756 kr" />}
    />,
    <Row
        key="spare"
        title="Sparekonto"
        subtitle="2899 19 22853"
        href="#"
        navigation="internal"
        leading={<Row.Leading variant="icon-background" icon="account_balance" />}
        trailing={<Row.TrailingLabel label="15 019 kr" />}
    />,
];

const meta = {
    title: 'Components/ListCard',
    component: ListCard,
    tags: ['autodocs'],
    args: {
        trailing: 'Totalt: 40 172 kr',
        children: kontoer,
    },
} satisfies Meta<typeof ListCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const MedTittel: Story = {
    name: 'Med tittel',
    args: {
        title: 'Kontoer',
    },
};

export const Navigasjon: Story = {
    args: {
        trailing: undefined,
        children: [
            <Row
                key="innstillinger"
                title="Betalingsinnstillinger"
                href="#"
                navigation="internal"
                leading={<Row.Leading variant="icon" icon="settings" />}
            />,
            <Row
                key="faste"
                title="Faste betalinger"
                href="#"
                navigation="internal"
                leading={<Row.Leading variant="icon" icon="repeat" />}
            />,
            <Row
                key="mottakere"
                title="Mottakere"
                href="#"
                navigation="internal"
                leading={<Row.Leading variant="icon" icon="group" />}
            />,
        ],
    },
};

export const HTML: Story = {
    render: () => (
        <div className="ix-list-card">
            <div className="ix-list-card__header">
                <h3 className="ix-list-card__title" id="html-kontoer">
                    Kontoer
                </h3>
                <span className="ix-list-card__trailing">Totalt: 25 153 kr</span>
            </div>
            <ul role="list" aria-labelledby="html-kontoer">
                <li>
                    <div className="ix-row">
                        <span className="ix-row__leading" data-variant="icon-background">
                            <ix-icon name="account_balance" aria-hidden="true"></ix-icon>
                        </span>
                        <div className="ix-row__body">
                            <div className="ix-row__content">
                                <p className="ix-row__title">
                                    <a className="ix-row__action" href="#">
                                        Brukskonto fordelsprogram
                                    </a>
                                </p>
                                <p className="ix-row__subtitle">2030 08 44813</p>
                            </div>
                            <div className="ix-row__trailing">
                                <span className="ix-row__trailing-label">21 397 kr</span>
                            </div>
                        </div>
                        <ix-icon class="ix-row__nav-icon" name="keyboard_arrow_right" aria-hidden="true"></ix-icon>
                    </div>
                </li>
                <li>
                    <div className="ix-row">
                        <span className="ix-row__leading" data-variant="icon-background">
                            <ix-icon name="account_balance" aria-hidden="true"></ix-icon>
                        </span>
                        <div className="ix-row__body">
                            <div className="ix-row__content">
                                <p className="ix-row__title">
                                    <a className="ix-row__action" href="#">
                                        Margit Yousef Bach
                                    </a>
                                </p>
                                <p className="ix-row__subtitle">3705 44 46842</p>
                            </div>
                            <div className="ix-row__trailing">
                                <span className="ix-row__trailing-label">3 756 kr</span>
                            </div>
                        </div>
                        <ix-icon class="ix-row__nav-icon" name="keyboard_arrow_right" aria-hidden="true"></ix-icon>
                    </div>
                </li>
            </ul>
        </div>
    ),
};
