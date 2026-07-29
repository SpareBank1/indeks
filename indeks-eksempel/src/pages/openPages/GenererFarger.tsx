import { Heading, HStack, LinkText, Text, VStack } from '@sb1/indeks-react';
import type { OriginScaleNames } from '@sb1/indeks-tokens/generate';
import { useColorOverrides } from '../../contexts/ColorOverrideContext';

const colorScales: { name: OriginScaleNames; label: string }[] = [
    { name: 'brand', label: 'Brand' },
    { name: 'success', label: 'Success' },
    { name: 'info', label: 'Info' },
    { name: 'warning', label: 'Warning' },
    { name: 'danger', label: 'Danger' },
    { name: 'gray', label: 'Gray' },
    { name: 'neutral', label: 'Neutral' },
];

const steps = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950];

/** Standard basisfarge per skala, brukt som utgangspunkt i fargevelgeren. */
const defaultColors: Record<OriginScaleNames, string> = {
    brand: '#0078d8',
    success: '#00885b',
    info: '#467ca4',
    warning: '#af6500',
    danger: '#c94e4f',
    gray: '#6d7888',
    neutral: '#af6516',
};

export default function GenererFarger() {
    const { colorOverrides, setColorOverride } = useColorOverrides();

    return (
        <div className="ix-px-lg ix-py-xs">
            <VStack gap="xl">
                <div>
                    <Heading as="h1">Generer farger</Heading>
                    <Text className="ix-mt-sm">
                        Skriv inn en basisfarge per skala og se hele appen rethem-e seg live. Fargene
                        genereres i runtime med <code>@sb1/indeks-tokens/generate</code>, som setter de
                        interne <code>--ii-primitive-*</code>-variablene på dokumentet — de semantiske{' '}
                        <code>--ix-color-*</code>-tokenene re-resolver seg selv via <code>var()</code>.
                        Nullstill igjen fra innstillinger (tannhjulet oppe til høyre).
                    </Text>
                    <Text className="ix-mt-sm">
                        Merk: basisfargen styrer bare <strong>fargetone og metning</strong> — lysheten
                        settes per trinn. En mørkere basisfarge gir derfor ikke en mørkere skala.{' '}
                        <LinkText href="https://design.sparebank1.no/docs/grunnleggende/tokens/fargeskalaer">
                            Les mer om hvordan fargeskalaene fungerer
                        </LinkText>
                        .
                    </Text>
                </div>

                <VStack className="ix-gap-lg">
                    {colorScales.map((scale) => {
                        const value = colorOverrides[scale.name] ?? defaultColors[scale.name];

                        return (
                            <div
                                key={scale.name}
                                className="ix-grid"
                                style={{ gridTemplateColumns: '120px 1fr 220px', gap: '16px', alignItems: 'center' }}
                            >
                                <Heading as="h2" size="md">
                                    {scale.label}
                                </Heading>

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
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '16px',
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
                                                    }}
                                                >
                                                    {step}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <HStack gap="xs" style={{ alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        aria-label={`Velg basisfarge for ${scale.label}`}
                                        value={value}
                                        onChange={(event) => setColorOverride(scale.name, event.target.value)}
                                        style={{ width: '40px', height: '40px', padding: 0, border: 'none' }}
                                    />
                                    <input
                                        type="text"
                                        aria-label={`Hex-verdi for ${scale.label}`}
                                        value={value}
                                        onChange={(event) => setColorOverride(scale.name, event.target.value)}
                                        className="ix-border-default ix-p-2xs"
                                        style={{ width: '110px', fontFamily: 'monospace' }}
                                    />
                                </HStack>
                            </div>
                        );
                    })}
                </VStack>
            </VStack>
        </div>
    );
}
