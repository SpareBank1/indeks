import { Button, HStack, Icon } from '@sb1/indeks-react';
import React from 'react';

const ButtonStack: React.FC = () => {
    return (
        <HStack>
            <Button>
                <Icon name="menu" />
                Primary
            </Button>
            <Button variant="secondary">
                <Icon name="menu" />
                Secondary
            </Button>
            <Button variant="tertiary">
                <Icon name="menu" />
                Tertiary
            </Button>
            <Button danger>
                <Icon name="menu" />
                Primary
            </Button>
            <Button variant="secondary" danger>
                <Icon name="menu" />
                Secondary
            </Button>
            <Button variant="tertiary" danger>
                <Icon name="menu" />
                Tertiary
            </Button>
        </HStack>
    );
};

export default ButtonStack;
