import { Heading, HStack, VStack } from '@sb1/indeks-react';
import React from 'react';
import { spacingVars, useSpacing } from '../../contexts/SpacingContext';

const SpacingEksempler: React.FC = () => {
    const { resolvedSpacing, isLoading, updateSpacing } = useSpacing();

    // Manual refresh button for testing
    const handleRefresh = () => {
        updateSpacing();
    };

    const spacingClasses = 'ix-color-surface-main-default ix-flex ix-justify-center ix-items-center';

    const spacingBoxStyle = {
        height: 'fit-content',
        width: 'fit-content',
        backgroundColor: 'var(--ix-color-border-focus-default)',
    };

    const marginBoxStyle = {
        minWidth: '60px',
        backgroundColor: 'var(--ix-color-surface-main-default)',
    };

    const contentBoxStyle = {
        minWidth: '60px',
        padding: 'var(--ix-spacing-md)',
        backgroundColor: 'var(--ix-color-fill-main-subtle)',
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div
                className="ix-flex ix-justify-space-between ix-align"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <Heading as="h1">Padding størrelser</Heading>
                <button
                    onClick={handleRefresh}
                    style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        position: 'fixed',
                        bottom: 0,
                        right: 0,
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : 'Last inn verdier på nytt'}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {spacingVars
                    .filter((utilClass) => utilClass.includes('pl'))
                    .map((utilClass) => (
                        <div key={utilClass} style={{ display: 'flex', alignItems: 'center' }}>
                            <HStack gap="md">
                                <code
                                    style={{
                                        minWidth: '120px',
                                        fontWeight: 600,
                                        backgroundColor: '#f5f5f5',
                                        padding: '2px 4px',
                                        borderRadius: '3px',
                                    }}
                                >
                                    {utilClass}
                                </code>
                                <div
                                    className={`${utilClass} ix-color-surface-info-default`}
                                    style={{
                                        height: '20px',
                                    }}
                                ></div>
                                <span
                                    style={{
                                        minWidth: '60px',
                                        fontWeight: 'bold',
                                        color: resolvedSpacing[utilClass] ? '#333' : '#999',
                                    }}
                                >
                                    {resolvedSpacing[utilClass] || '0px'}
                                </span>
                            </HStack>
                        </div>
                    ))}
            </div>

            <Heading as="h1" className="ix-mt-xl">
                Padding
            </Heading>
            <div className="ix-grid ix-grid-cols-3">
                <VStack>
                    Square
                    {['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'].map((size) => (
                        <div key={size} className={`ix-p-${size} ${spacingClasses}`} style={spacingBoxStyle}>
                            <div style={contentBoxStyle}>{resolvedSpacing[`ix-pl-${size}`] || size}</div>
                        </div>
                    ))}
                </VStack>
            </div>
            <div className="ix-grid">
                <Heading as="h1">Margin</Heading>
                <VStack gap="0">
                    {['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'].map((size) => (
                        <div key={size} className={`ix-mb-${size} ${spacingClasses}`} style={marginBoxStyle}>
                            <div style={contentBoxStyle}>
                                {size} - {resolvedSpacing[`ix-mb-${size}`] || size}
                            </div>
                        </div>
                    ))}
                </VStack>
            </div>

            <div className="ix-grid">
                <Heading as="h1">Gap</Heading>
                <VStack gap="0">
                    {['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'].map((size) => (
                        <div
                            key={size}
                            className={`ix-gap-${size} ix-flex ix-flex-col`}
                            style={{
                                background: 'var(--ix-color-surface-info-default)',

                                marginBottom: '1rem',
                                border: 'var(--ix-border-default)',
                            }}
                        >
                            <div style={{ background: 'var(--ix-color-fill-info-subtle)', padding: '0.5rem' }}>A</div>
                            <div style={{ background: 'var(--ix-color-fill-info-subtle)', padding: '0.5rem' }}>B</div>
                            <div style={{ background: 'var(--ix-color-fill-info-subtle)', padding: '0.5rem' }}>C</div>
                            <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
                                Gap: {resolvedSpacing[`ix-gap-${size}`] || size}
                            </div>
                        </div>
                    ))}
                </VStack>
            </div>
        </div>
    );
};

export default SpacingEksempler;
