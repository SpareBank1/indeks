import { Card, Icon, type MaterialDesignIconName } from '@sb1/indeks-react';
import React from 'react';

interface ClickableRowProps {
    accountName: string;
    iconName: MaterialDesignIconName;
}

export const ClickableRow: React.FC<ClickableRowProps> = ({ accountName, iconName }) => {
    return (
        <Card
            className="ix-mb-sm"
            href="#"
            leading={<Icon name={iconName} />}
            leadingType="icon-background"
            title={accountName}
        />
    );
};
