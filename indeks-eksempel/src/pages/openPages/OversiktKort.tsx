import { Button, Heading, HStack, Icon, Text, TextField, VStack } from '@sb1/indeks-react';
import React from 'react';
import './oversikt-kort.css';

interface OversiktKortProps {
    title: string;
    variant?: 'main' | 'info' | 'warning' | 'danger' | 'success' | 'brand';
}

const randomFacts = [
    'Honningbier kan gjenkjenne ansikter.',
    'Bier kommuniserer gjennom dans.',
    'En bie kan besøke opptil 5,000 blomster på en dag.',
    'Bier har fem øyne.',
    'Bie-dronninga kan legge opptil 2,000 egg om dagen.',
    'Bier har vært på jorden i over 30 millioner år.',
    'Bier kan fly i hastigheter opptil 24 km/t.',
    'Bier er ansvarlige for pollinering av omtrent en tredjedel av maten vi spiser.',
    'Bier har hår på øynene sine for å samle pollen.',
];

const OversiktKort: React.FC<OversiktKortProps> = ({ title, variant = 'default' }) => {
    return (
        <VStack className={`eksempel-kort--${variant} ix-border-radius-md ix-p-sm`}>
            <HStack gap="2xs">
                <div className={`ikon-sirkel ix-color-fill-${variant}-default`}>
                    <Icon name="hjem" size="lg" className={` ix-color-foreground-main-default`} />
                </div>
                <div className={`ikon-sirkel ix-color-fill-${variant}-subtle ix-color-foreground-main-default`}>
                    <Icon name="hjem" size="lg" className={``} />
                </div>
            </HStack>
            <div>
                <Heading as="h2" size="sm" className={`ix-color-foreground-main-default`} addRecommendedSpacing>
                    {title}
                </Heading>
                <Text className={`ix-m-block-xs ix-color-foreground-main-default`}>
                    {randomFacts[Math.floor(Math.random() * randomFacts.length)]}
                </Text>
            </div>
            <TextField label="Fødselsdato" placeholder="Her er en placeholder" />
            <Button>
                <Icon materialDesignName="check" />
                Primary
            </Button>
        </VStack>
    );
};

export default OversiktKort;
