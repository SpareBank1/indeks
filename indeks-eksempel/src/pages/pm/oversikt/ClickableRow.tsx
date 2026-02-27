import { Card, Heading, Icon, type MaterialDesignIconName } from '@sb1/indeks-react';
import React from 'react';

interface ClickableRowProps {
    accountName: string;
    iconName: MaterialDesignIconName;
}

export const ClickableRow: React.FC<ClickableRowProps> = ({ accountName, iconName }) => {
    return (
        <Card className="ix-mb-sm ix-grid ix-grid-stretch-middle ix-p-md ix-align-center" surfaceColor="main">
            <div className="ix-p-xs ix-border-radius-circle ix-w-fit ix-h-fit eksempel-icon-bubble">
                <Icon materialDesignName={iconName} />
            </div>
            <div>
                <Heading as="h3" size="sm">
                    {accountName}
                </Heading>
            </div>
            <Icon materialDesignName="chevron_right" size="lg" />
        </Card>
    );
};
