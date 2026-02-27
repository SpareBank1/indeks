import { HStack, Icon, Tag } from '@sb1/indeks-react';
import React from 'react';

const TagStack: React.FC = () => {
    return (
        <HStack>
            <Tag variant="neutral">
                <Icon name="hjem" />
                En liten tag
            </Tag>
            <Tag variant="neutral" type="subtle">
                <Icon name="hjem" />
                En liten tag
            </Tag>
            <Tag variant="info">
                <Icon name="hjem" />
                En liten tag
            </Tag>
            <Tag variant="info" type="subtle">
                <Icon name="hjem" />
                En liten tag
            </Tag>
            <Tag variant="success">
                <Icon name="hjem" />
                En liten tag
            </Tag>
            <Tag variant="success" type="subtle">
                <Icon name="hjem" />
                En liten tag
            </Tag>
            <Tag variant="warning">
                <Icon name="hjem" />
                En liten tag
            </Tag>
            <Tag variant="warning" type="subtle">
                <Icon name="hjem" />
                En liten tag
            </Tag>
            <Tag variant="danger">
                <Icon name="hjem" />
                En liten tag
            </Tag>
            <Tag variant="danger" type="subtle">
                <Icon name="hjem" />
                En liten tag
            </Tag>
        </HStack>
    );
};

export default TagStack;
