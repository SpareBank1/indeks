import { HStack, LinkText, Text } from '@sb1/indeks-react';
import React from 'react';

const PMFooter: React.FC = () => (
    <footer className="ix-color-background-tinted">
        <HStack justifyContent="space-between" alignItems="center" padding="md" gap="md" paddingX='xl'>
            <HStack gap="sm" alignItems="center">
                <Text>SpareBank1 Østlandet</Text>
                <HStack gap="sm">
                    <Text size="sm">915 07040</Text>
                    <Text size="sm">7-22 (10-18)</Text>
                </HStack>
            </HStack>
            <HStack as="nav" gap="xs" className="ix-font-size-sm">
                <LinkText href="#" className="ix-link ix-font-size-sm">
                    Personvern
                </LinkText>
                <LinkText href="#" className="ix-link ix-font-size-sm">
                    Informasjonskapsler
                </LinkText>
                <LinkText href="#" className="ix-link ix-font-size-sm">
                    Prisliste
                </LinkText>
            </HStack>
        </HStack>
    </footer>
);

export default PMFooter;
