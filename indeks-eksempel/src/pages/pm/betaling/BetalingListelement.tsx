import { Heading, Icon, Text, type MaterialDesignIconName } from '@sb1/indeks-react';
import React from 'react';

type BetalingListelementProps = {
    iconName: MaterialDesignIconName;
    cardName: string;
    description: string;
};

const BetalingListelement: React.FC<BetalingListelementProps> = ({ iconName, cardName, description }) => {
    return (
        <div className="ix-grid ix-items-center ix-p-sm ix-grid-stretch-middle">
            <Icon materialDesignName={iconName} />
            <div className="">
                <Heading size="xs" as="h3">
                    {cardName}
                </Heading>
                <Text>{description}</Text>
            </div>
            <Icon materialDesignName="chevron_right" size="lg" />
        </div>
    );
};

export default BetalingListelement;
