import { Heading, VStack } from '@sb1/indeks-react';
import React from 'react';
import ButtonStack from './ButtonStack';
import OversiktKort from './OversiktKort';
import StateKort from './StateKort';
import TagStack from './TagStack';

interface OversiktEksempelProps {
    title?: string;
}

const OversiktEksempel: React.FC<OversiktEksempelProps> = ({ title = 'Oversikt' }) => {
    return (
        <VStack style={{ padding: '20px' }}>
            <Heading as="h1">{title}</Heading>
            <ButtonStack />
            <TagStack />

            <div className="ix-grid ix-w-full ix-grid-auto-fit-md">
                <OversiktKort title="Default Kort" variant="main" />
                <OversiktKort title="Info" variant="info" />
                <OversiktKort title="Suksess" variant="success" />
                <OversiktKort title="Advarsel" variant="warning" />
                <OversiktKort title="Feil" variant="danger" />
                <StateKort />
            </div>
        </VStack>
    );
};

export default OversiktEksempel;
