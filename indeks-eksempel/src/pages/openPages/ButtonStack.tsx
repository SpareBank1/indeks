import { Button, HStack, Icon } from '@sb1/indeks-react';
import React from 'react';

const ButtonStack: React.FC = () => {
    return (
        <HStack>
            <Button>
                <Icon name="meny" />
                Primary
            </Button>
            <Button variant="secondary">
                <Icon name="meny" />
                Secondary
            </Button>
            <Button variant="tertiary">
                <Icon name="meny" />
                Tertiary
            </Button>
            <Button danger>
                <Icon name="meny" />
                Primary
            </Button>
            <Button variant="secondary" danger>
                <Icon name="meny" />
                Secondary
            </Button>
            <Button variant="tertiary" danger>
                <Icon name="meny" />
                Tertiary
            </Button>
        </HStack>
    );
};

export default ButtonStack;
