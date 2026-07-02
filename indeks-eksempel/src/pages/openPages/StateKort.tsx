import { Button, Heading, Icon, Text, VStack } from '@sb1/indeks-react';
import React from 'react';

const randomFacts = [
    'Quokkaer kalles verdens lykkeligste dyr på grunn av deres smilende ansiktsuttrykk',
    'Quokkaer finnes bare i Vest-Australia, hovedsakelig på Rottnest Island',
    'Quokkaer er nattaktive pungdyr som sover om dagen',
    'En quokka kan hoppe over en meter høyt',
    'Quokkaer kan leve uten vann i lange perioder ved å hente fuktighet fra planter',
    'Babyen til en quokka kalles en joey og er bare på størrelse med en risbønne ved fødsel',
    'Quokkaer er sosiale dyr som lever i små grupper',
    "Navnet 'Rottnest Island' kommer fra at nederlandske oppdagere trodde quokkaer var store rotter",
];

const StateKort: React.FC = () => {
    const [status, setStatus] = React.useState('default');

    return (
        <VStack
            className="ix-border-radius-md ix-color-status-border ix-border-width-default ix-p-sm ix-color-status-surface"
            data-status={status}
        >
            <div className="ikon-sirkel ix-color-status-fill ix-color-foreground-inverse ix-color-status-border">
                <Icon name="home" size="lg" className=" ix-color-foreground-inverse" />
            </div>
            <div>
                <Heading as="h2" size="sm" className="ix-color-foreground" addRecommendedSpacing>
                    Kort med State
                </Heading>
                <Text className="ix-m-block-xs ix-color-foreground">
                    {randomFacts[Math.floor(Math.random() * randomFacts.length)]}
                </Text>
            </div>
            <label htmlFor="status-select" style={{ margin: '16px 0', display: 'block', maxWidth: 200 }}>
                Velg status
                <select
                    id="status-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ width: '100%', marginTop: 4 }}
                    className="ix-color-surface-main-default ix-border-default ix-border-radius-md ix-py-2xs"
                >
                    <option value="default">Default</option>
                    <option value="info">Info</option>
                    <option value="success">Suksess</option>
                    <option value="warning">Advarsel</option>
                    <option value="danger">Feil</option>
                </select>
            </label>
            <Button>
                <Icon name="check" />
                Primary
            </Button>
        </VStack>
    );
};

export default StateKort;
