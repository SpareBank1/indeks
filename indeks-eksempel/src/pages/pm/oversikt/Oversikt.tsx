import { Button, Card, Divider, Heading, HStack, Icon, Tag, Text, VStack } from '@sb1/indeks-react';
import { AccountRow } from './AccountRow';
import { ClickableRow } from './ClickableRow';
import './oversikt.css';

export default function PMOversikt() {
    return (
        <div className="ix-color-background-default">
            <div className="ix-max-w-full">
                <HStack
                    gap="sm"
                    padding="xl"
                    alignItems="center"
                    justifyContent="space-between"
                    fullWidth={true}
                    className="ix-max-w-lg ix-m-auto"
                >
                    <Heading as="h1">Min oversikt</Heading>
                    <HStack gap="sm">
                        <Button variant="secondary">
                            <Icon materialDesignName="account_balance_wallet" />
                            Betal
                        </Button>
                        <Button variant="secondary">
                            <Icon materialDesignName="swap_horiz" />
                            Overfør
                        </Button>
                        <Button variant="secondary">
                            <Icon materialDesignName="event" />
                            Forfall
                        </Button>
                    </HStack>
                </HStack>

                <VStack gap="sm" paddingX="xl" fullWidth={false} alignItems="start" className="ix-max-w-lg ix-m-auto">
                    <Heading as="h2" size="sm">
                        Til godkjenning
                    </Heading>
                    <Card className="ix-p-md" surfaceColor="main">
                        <HStack justifyContent="space-between">
                            <div>Telenor</div>
                            <div>399 kr</div>
                        </HStack>
                        <HStack justifyContent="center" className="ix-my-sm">
                            <Tag variant="info" size="sm" type="subtle">
                                <Icon size="sm" materialDesignName="account_balance" />
                                Regningskonto
                            </Tag>
                            <Tag variant="danger" size="sm" type="subtle">
                                <Icon size="sm" materialDesignName="calendar_month" />I dag
                            </Tag>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Button variant="secondary">Se mer</Button>
                            <Button variant="primary" className="ix-flex-grow">
                                Godkjenn
                            </Button>
                        </HStack>
                    </Card>
                </VStack>

                <div className="ix-grid ix-col-gap-lg ix-px-xl ix-py-2xl ix-justify-center ix-grid-auto-fit-lg ix-max-w-lg ix-m-auto">
                    <div>
                        <HStack
                            justifyContent="space-between"
                            gap="md"
                            alignItems="center"
                            className="ix-mb-md ix-pt-2xs ix-relative"
                        >
                            <Heading as="h2" size="md">
                                Daglig Bruk
                            </Heading>
                            <div className="ix-absolute ix-top-0 ix-right-0">
                                <Button variant="tertiary" size="sm">
                                    <Icon materialDesignName="add_circle" />
                                    Legg til
                                </Button>
                            </div>
                        </HStack>
                        <Card className="ix-mb-sm" surfaceColor="main">
                            <HStack
                                className="ix-p-sm"
                                justifyContent="end"
                                alignItems="center"
                                fullWidth={true}
                                gap="2xs"
                            >
                                <Text size="sm" className="ix-m-0">
                                    Total amount
                                </Text>
                            </HStack>
                            <Divider />
                            <AccountRow amount={12300} accountName="Felles konto" accountNumber="12 345 67 890" />
                            <Divider />
                            <AccountRow amount={300} accountName="Brukskonto" accountNumber="98 765 43 210" />
                            <Divider />
                            <AccountRow amount={5000} accountName="Sparekonto" accountNumber="11 223 34 455" />
                            <Divider />
                            <AccountRow amount={25000} accountName="Konto for barn" accountNumber="22 334 45 566" />
                        </Card>
                    </div>
                    <div>
                        <HStack
                            justifyContent="space-between"
                            gap="md"
                            alignItems="center"
                            className="ix-mb-md ix-pt-2xs"
                        >
                            <Heading as="h2" size="md">
                                Økonomi
                            </Heading>
                        </HStack>
                        <ClickableRow accountName="Min Økonomi" iconName="computer" />
                    </div>
                </div>

                <div className=" ix-color-background-tinted ">
                    <div className="ix-max-w-lg ix-m-auto ix-grid ix-col-gap-lg ix-px-xl ix-py-2xl ix-justify-center ix-grid-auto-fit-lg">
                        <div>
                            <HStack
                                justifyContent="space-between"
                                gap="md"
                                alignItems="center"
                                className="ix-mb-md ix-pt-2xs ix-relative"
                            >
                                <Heading as="h2" size="md">
                                    Sparing
                                </Heading>
                                <div className="ix-absolute ix-top-0 ix-right-0">
                                    <Button variant="tertiary" size="sm">
                                        <Icon materialDesignName="tune" />
                                        Tilpass
                                    </Button>
                                </div>
                            </HStack>
                            <ClickableRow accountName="Min sparing" iconName="savings" />
                            <Card className="ix-mb-sm" surfaceColor="main">
                                <HStack
                                    className="ix-p-sm"
                                    justifyContent="end"
                                    alignItems="center"
                                    fullWidth={true}
                                    gap="2xs"
                                >
                                    <Text size="sm" className="ix-m-0 ix-text-secondary">
                                        Total amount
                                    </Text>
                                </HStack>
                                <Divider />
                                <AccountRow amount={12300} accountName="Felles konto" accountNumber="12 345 67 890" />
                                <Divider />
                                <AccountRow amount={300} accountName="Brukskonto" accountNumber="98 765 43 210" />
                                <Divider />
                                <AccountRow amount={5000} accountName="Sparekonto" accountNumber="11 223 34 455" />
                                <Divider />
                                <AccountRow amount={25000} accountName="Konto for barn" accountNumber="22 334 45 566" />
                            </Card>
                            <Card
                                className="ix-m-block-xs ix-grid ix-grid-stretch-middle ix-align-center ix-p-sm"
                                border="dashed"
                            >
                                <Icon materialDesignName="add_circle" size="xl" />
                                <div>
                                    <Heading as="h3" size="sm" addRecommendedSpacing>
                                        HeadingText
                                    </Heading>
                                    <Text size="sm" className="ix-m-0">
                                        Spar på konto, i fond, kjøp aksjer eller spar til pensjon
                                    </Text>
                                </div>
                            </Card>
                        </div>
                        <div>
                            <HStack
                                justifyContent="space-between"
                                gap="md"
                                alignItems="center"
                                className="ix-mb-md ix-pt-2xs"
                            >
                                <Heading as="h2" size="md">
                                    Mine barn
                                </Heading>
                            </HStack>
                            <Card className="ix-mb-lg ix-h-fit" surfaceColor="main">
                                <AccountRow amount={12300} accountName="Lise" accountNumber="12 345 67 890" />
                                <Divider />
                                <AccountRow amount={300} accountName="Ola" accountNumber="98 765 43 210" />
                            </Card>
                        </div>
                        <div>
                            <HStack
                                justifyContent="space-between"
                                gap="md"
                                alignItems="center"
                                className="ix-mb-md ix-pt-2xs"
                            >
                                <Heading as="h2" size="md">
                                    Bolig
                                </Heading>
                            </HStack>
                            <ClickableRow accountName="Boliglån" iconName="home" />
                            <Card className="ix-mb-sm ix-h-fit" surfaceColor="main">
                                <AccountRow amount={12300} accountName="Boliglån" accountNumber="12 345 67 890" />
                                <Divider />
                                <AccountRow amount={300} accountName="Felles" accountNumber="98 765 43 210" />
                            </Card>
                        </div>
                    </div>
                </div>

                <div className="ix-grid ix-col-gap-lg ix-px-xl ix-pt-3xl ix-justify-center ix-grid-auto-fit-lg ix-max-w-lg ix-m-auto">
                    <div>
                        <HStack
                            justifyContent="space-between"
                            gap="md"
                            alignItems="center"
                            className="ix-mb-md ix-pt-2xs ix-relative"
                        >
                            <Heading as="h2" size="md">
                                Sparing
                            </Heading>
                            <div className="ix-absolute ix-top-0 ix-right-0">
                                <Button variant="tertiary" size="sm">
                                    <Icon materialDesignName="tune" />
                                    Tilpass
                                </Button>
                            </div>
                        </HStack>
                        <ClickableRow accountName="Min sparing" iconName="savings" />
                        <Card className="ix-mb-sm" surfaceColor="main">
                            <AccountRow amount={12300} accountName="Account name" accountNumber="Account number" />
                            <Divider />
                            <AccountRow amount={300} accountName="Account name" accountNumber="Account number" />
                        </Card>
                    </div>
                    <div>
                        <HStack
                            justifyContent="space-between"
                            gap="md"
                            alignItems="center"
                            className="ix-mb-md ix-pt-2xs"
                        >
                            <Heading as="h2" size="md">
                                Lån
                            </Heading>
                        </HStack>
                        <Card className="ix-mb-sm ix-h-fit" surfaceColor="main">
                            <AccountRow amount={12300} accountName="Loan account" accountNumber="Account number" />
                            <Divider />
                            <AccountRow amount={300} accountName="Loan account" accountNumber="Account number" />
                        </Card>
                        <Card
                            className="ix-m-block-xs ix-grid ix-grid-stretch-middle ix-align-center ix-p-sm"
                            border="dashed"
                        >
                            <Icon materialDesignName="add_circle" size="xl" />
                            <div>
                                <Heading as="h3" size="sm" addRecommendedSpacing>
                                    HeadingText
                                </Heading>
                                <Text size="sm" className="ix-m-0">
                                    Spar på konto, i fond, kjøp aksjer eller spar til pensjon
                                </Text>
                            </div>
                        </Card>
                    </div>
                    <div>
                        <HStack
                            justifyContent="space-between"
                            gap="md"
                            alignItems="center"
                            className="ix-mb-md ix-pt-2xs"
                        >
                            <Heading as="h2" size="md">
                                Forsikring
                            </Heading>
                        </HStack>
                        <ClickableRow accountName="Min forsikring" iconName="shield" />
                        <ClickableRow accountName="Bilforsikring" iconName="directions_car" />
                    </div>
                </div>
            </div>
        </div>
    );
}
