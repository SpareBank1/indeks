import { Heading, HStack, Icon, Text, VStack } from '@sb1/indeks-react';
import React, { useState } from 'react';
import './status-example.css';

const StatusExample: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = useState('default');

    const statusOptions = [
        'default',
        'info',
        'success',
        'warning',
        'danger',
    ];

    return (
        <div className="ix-w-md ix-my-md">
            <div className="ix-flex ix-flex-col">
                <label htmlFor="status-select">Velg status:</label>
                <select
                    id="status-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{ marginBottom: '1rem' }}
                    className="ix-border-default ix-border-radius-sm"
                >
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>
            <div className="ix-grid ix-grid-cols-2" data-status={selectedStatus}>
                <div className="ix-border-radius-md ix-border-width-default ix-p-sm ix-color-status-surface">
                    <HStack gap="2xs">
                        <div className="ikon-sirkel ix-color-status-fill">
                            <Icon name="hake" size="lg" className="ix-color-foreground-inverse-default" />
                        </div>
                        <div className="ikon-sirkel ix-color-status-fill-subtle ix-color-foreground-main-default">
                            <Icon name="hake" size="lg" />
                        </div>
                    </HStack>
                    <Heading as="h1" size="sm" className="ix-color-foreground-main-default" addRecommendedSpacing>
                        Overskrift
                    </Heading>
                    <Text className="ix-color-foreground-main-default">Dette er en tekst med default farge</Text>
                </div>
                <VStack gap="sm">
                    <Text className="ix-mb-0">
                        ix-color-status-surface
                        <span
                            style={{ height: '20px', width: '20px' }}
                            className="ix-inline-block ix-color-status-surface ix-border-radius-circle ix-ml-xs"
                        ></span>
                    </Text>
                    <Text className="ix-mb-0">
                        ix-color-status-fill
                        <span
                            style={{ height: '20px', width: '20px' }}
                            className="ix-inline-block ix-color-status-fill ix-border-radius-circle ix-ml-xs"
                        ></span>
                    </Text>
                    <Text className="ix-mb-0">
                        ix-color-status-fill-subtle
                        <span
                            style={{ height: '20px', width: '20px' }}
                            className="ix-inline-block ix-color-status-fill-subtle ix-border-radius-circle ix-ml-xs"
                        ></span>
                    </Text>
                    <Text className="ix-mb-0">
                        ix-color-status-border
                        <span
                            style={{ height: '20px', width: '20px' }}
                            className="ix-inline-block ix-border-width-default ix-color-status-border ix-border-radius-circle ix-ml-xs"
                        ></span>
                    </Text>
                </VStack>
            </div>
        </div>
    );
};

export default StatusExample;
