import { Heading, Text, VStack } from '@sb1/indeks-react';

export default function FargeskalaerEksempler() {
    const colorScales = [
        { name: 'brand', label: 'Brand' },
        { name: 'success', label: 'Success' },
        { name: 'info', label: 'Info' },
        { name: 'warning', label: 'Warning' },
        { name: 'danger', label: 'Danger' },
        { name: 'gray', label: 'Gray' },
        { name: 'neutral', label: 'Neutral' },
    ];

    const steps = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950];

    return (
        <div className="ix-px-lg ix-py-xs">
            <VStack gap="xl">
                <div>
                    <Heading as="h1">Fargeskalaer</Heading>
                    <Text className="ix-mt-sm">Her er fargene brukt i indeks.</Text>
                </div>

                <VStack className="ix-gap-0">
                    {colorScales.map((scale) => (
                        <div
                            key={scale.name}
                            className="ix-grid"
                            style={{ gridTemplateColumns: '120px 1fr', gap: '16px' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Heading as="h2" size="md">
                                    {scale.label}
                                </Heading>
                            </div>
                            <div className="ix-grid" style={{ gridTemplateColumns: 'repeat(20, 1fr)', gap: 0 }}>
                                {steps.map((step) => {
                                    const cssVar = `var(--ii-primitive-${scale.name}-${step})`;
                                    const isOrigin = step === 600;

                                    return (
                                        <div
                                            key={step}
                                            style={{
                                                backgroundColor: cssVar,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '16px',
                                                position: 'relative',
                                                border: isOrigin ? '3px solid black' : 'none',
                                                boxSizing: 'border-box',
                                            }}
                                            title={`${scale.name}-${step}`}
                                        >
                                            <div
                                                style={{
                                                    fontSize: '12px',
                                                    fontWeight: isOrigin ? 'bold' : 'normal',
                                                    color: step < 500 ? '#000' : '#fff',
                                                    textAlign: 'center',
                                                    wordBreak: 'break-word',
                                                }}
                                            >
                                                {step}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </VStack>
            </VStack>
        </div>
    );
}
