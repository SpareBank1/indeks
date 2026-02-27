import { Heading, Icon, Text } from '@sb1/indeks-react';
import React from 'react';

interface AccountRowProps {
    amount: number;
    accountName: string;
    accountNumber: string;
}

export const AccountRow: React.FC<AccountRowProps> = ({ amount, accountName, accountNumber }) => {
    const formattedAmount = new Intl.NumberFormat('nb-NO', {
        style: 'decimal',
        minimumFractionDigits: 0,
    }).format(amount);

    return (
        <div className="ix-grid ix-align-center ix-py-xs ix-px-sm ix-grid-stretch-middle">
            <div className="ix-p-xs ix-border-radius-circle ix-w-fit ix-h-fit eksempel-icon-bubble">
                <Icon materialDesignName="account_balance" />
            </div>
            <div className="ix-my-2xs">
                <Heading as="h3" size="xs" addRecommendedSpacing>
                    {accountName}
                </Heading>
                <Text size="sm">
                    {accountNumber}
                </Text>
            </div>
            <Text className="ix-m-0">{formattedAmount} kr</Text>
        </div>
    );
};
