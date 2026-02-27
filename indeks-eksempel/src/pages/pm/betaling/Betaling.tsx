import { Button, Card, Divider, Heading, HStack, Icon, Text, VStack } from '@sb1/indeks-react';
import BetalingListelement from './BetalingListelement.tsx';

export default function PMBetaling() {
    return (
        <div className="ix-color-background-neutral ix-pt-md">
            <div className="ix-max-w-sm ix-m-auto">
                <Heading as="h1" addRecommendedSpacing>
                    Betaling
                </Heading>
                <Card surfaceColor="info" padding="md">
                    <div
                        className={`ix-color-fill-info-subtle ix-color-foreground-info-default ix-mb-md`}
                        style={{
                            height: '30px',
                            width: '30px',
                            borderRadius: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon name="hjem" size="lg" className="" />
                    </div>
                    <Heading as="h2" size="xs" addRecommendedSpacing>
                        Husk at du ikke kan overføre på helligdager
                    </Heading>
                    <Text>Det er fordi vi ikke jobber da. Dette er viktig informasjon. </Text>
                </Card>
            </div>
            <VStack justifyContent="center" alignItems="center" padding="sm">
                <Card surfaceColor="main" className="ix-m-sm ix-mb-xl ix-w-full ix-max-w-sm ">
                    <BetalingListelement
                        iconName="account_balance_wallet"
                        cardName="Betal"
                        description="Betaling i nettbanken"
                    />
                    <Divider />
                    <BetalingListelement
                        iconName="work"
                        cardName="AvtaleGiro"
                        description="Automatisk betaling til valgte mottakere"
                    />
                    <Divider />
                    <BetalingListelement
                        iconName="description"
                        cardName="eFaktura"
                        description="Regninger direkte i nettbanken"
                    />
                    <Divider />
                    <BetalingListelement
                        iconName="acute"
                        cardName="Straksbetaling"
                        description="Pengene hos mottaker med en gang"
                    />
                    <Divider />
                    <BetalingListelement
                        iconName="currency_exchange"
                        cardName="Betal til utland"
                        description="Betal til utenlandske mottakere"
                    />
                </Card>
                <Card surfaceColor="main" className="ix-m-sm ix-mb-xl ix-w-full ix-max-w-sm ">
                    <BetalingListelement
                        iconName="compare_arrows"
                        cardName="Overfør"
                        description="Flytt penger mellom egne kontoer"
                    />
                    <Divider />
                    <BetalingListelement
                        iconName="repeat"
                        cardName="Faste avtaler"
                        description="Betalinger, overføringer og utenlandsbetalinger til faste tidspunkt"
                    />
                    <Divider />
                    <BetalingListelement
                        iconName="account_box"
                        cardName="Mottakere"
                        description="Oversikt over dine mottakere"
                    />
                </Card>
                <Card surfaceColor="main" className="ix-m-sm ix-mb-xl ix-w-full ix-max-w-sm ">
                    <BetalingListelement
                        iconName="event_upcoming"
                        cardName="Forfallsoversikt"
                        description="Oversikt over betalinger og overføringer som ligger til forfall"
                    />
                    <Divider />
                    <BetalingListelement
                        iconName="history"
                        cardName="Historikk"
                        description="Oversikt over tidligere betalinger og overføringer"
                    />
                </Card>
                <Card surfaceColor="main" className="ix-mt-xl ix-w-full ix-align-center ix-p-xl ix-gap-lg ix-max-w-sm ">
                    Hva synes du om denne siden?
                    <HStack gap="xs">
                        <Button variant="secondary">
                            <Icon materialDesignName="thumb_up" />
                        </Button>
                        <Button variant="secondary">
                            <Icon materialDesignName="thumb_down" />
                        </Button>
                    </HStack>
                </Card>
            </VStack>
        </div>
    );
}
