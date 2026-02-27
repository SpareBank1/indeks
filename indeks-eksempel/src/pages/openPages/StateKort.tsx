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
    const [status, setStatus] = React.useState('ix-status-default');

    return (
        <VStack
            className={`${status} ix-border-radius-md ix-color-border ix-border-width-default ix-p-sm ix-color-surface`}
        >
            <div className="ikon-sirkel ix-color-fill ix-color-foreground-inverse ix-color-border">
                <Icon name="hjem" size="lg" className=" ix-color-foreground-inverse" />
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
                    <option value="ix-status-default">Default</option>
                    <option value="ix-status-info">Info</option>
                    <option value="ix-status-success">Suksess</option>
                    <option value="ix-status-warning">Advarsel</option>
                    <option value="ix-status-danger">Feil</option>
                </select>
            </label>
            <Button>
                <Icon materialDesignName="check" />
                Primary
            </Button>
        </VStack>
    );
};

export default StateKort;
