import { useState, type CSSProperties } from 'react';
import { Button, Heading, HStack, Text, VStack } from '@sb1/indeks-react';
import {
    DEFAULT_CHROMA,
    DEFAULT_LIGHTNESS,
    DEFAULT_STEPS,
    getOriginChroma,
    type OriginColor,
} from '@sb1/indeks-tokens/generate';
import { colorScales, defaultColors } from '../../components/colorScaleConfig';
import { useColorOverrides } from '../../contexts/ColorOverrideContext';

const ROW: CSSProperties = { gridTemplateColumns: '120px 1fr 220px', gap: '16px', alignItems: 'center', width: '100%' };
const STEPS_GRID: CSSProperties = { gridTemplateColumns: `repeat(${DEFAULT_STEPS.length}, 1fr)`, gap: 0 };

// Loddrett slider, så den får plass under hvert trinn.
const VERTICAL_SLIDER: CSSProperties = {
    writingMode: 'vertical-lr',
    direction: 'rtl',
    height: '96px',
    width: '100%',
    margin: 0,
};

const SMALL: CSSProperties = { fontSize: '12px', fontFamily: 'monospace', textAlign: 'center' };

export default function FargeskalaerEksempler() {
    const {
        colorOverrides,
        lightness,
        setLightness,
        chroma,
        setChroma,
        chromaFactor,
        setChromaFactor,
        resetColors,
    } = useColorOverrides();
    const [copied, setCopied] = useState(false);

    const lightnessAt = (step: (typeof DEFAULT_STEPS)[number]) => lightness[step] ?? DEFAULT_LIGHTNESS[step];

    const copyValues = async () => {
        const values = {
            lightness: Object.fromEntries(DEFAULT_STEPS.map((step) => [step, lightnessAt(step)])),
            chroma,
            chromaFactor,
        };
        await navigator.clipboard.writeText(JSON.stringify(values, null, 2));
        setCopied(true);
    };

    return (
        <div className="ix-px-lg ix-py-xs">
            <VStack gap="xl">
                <div>
                    <Heading as="h1">Fargeskalaer</Heading>
                    <Text className="ix-mt-sm">
                        Her er fargene brukt i indeks. Juster lysstyrken per trinn (felles for alle skalaer) og
                        chroma per skala for å prøve ut nye skalaer. Endringene gjelder hele appen til du
                        nullstiller.
                    </Text>
                    <HStack gap="sm" className="ix-mt-sm" style={{ alignItems: 'center' }}>
                        <Button variant="secondary" onClick={copyValues}>
                            Kopier verdier
                        </Button>
                        <Button
                            variant="tertiary"
                            onClick={() => {
                                resetColors();
                                setCopied(false);
                            }}
                        >
                            Nullstill
                        </Button>
                        <Text role="status">{copied ? 'Verdiene er kopiert som JSON.' : ''}</Text>
                    </HStack>
                </div>

                <VStack className="ix-gap-0">
                    <div className="ix-grid ix-mb-sm" style={ROW}>
                        <Heading as="h2" size="md">
                            Lysstyrke
                        </Heading>
                        <div className="ix-grid" style={STEPS_GRID}>
                            {DEFAULT_STEPS.map((step) => (
                                <div key={step} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <input
                                        type="range"
                                        min={0}
                                        max={1}
                                        step={0.005}
                                        value={lightnessAt(step)}
                                        aria-label={`Lysstyrke trinn ${step}`}
                                        onChange={(event) => setLightness(step, Number(event.target.value))}
                                        style={VERTICAL_SLIDER}
                                    />
                                    <span style={SMALL}>{lightnessAt(step).toFixed(3)}</span>
                                </div>
                            ))}
                        </div>
                        <div />
                    </div>

                    {colorScales.map((scale) => {
                        const baseColor = (colorOverrides[scale.name] ?? defaultColors[scale.name]) as OriginColor;
                        const peak = chroma[scale.name] ?? getOriginChroma(baseColor);
                        const factors = chromaFactor[scale.name] ?? {};

                        return (
                            <div key={scale.name}>
                                <div className="ix-grid" style={ROW}>
                                    <Heading as="h2" size="md">
                                        {scale.label}
                                    </Heading>
                                    <div className="ix-grid" style={STEPS_GRID}>
                                        {DEFAULT_STEPS.map((step) => {
                                            const isOrigin = step === 600;
                                            const l = lightnessAt(step);
                                            const c =
                                                Math.sin(DEFAULT_CHROMA[step] * Math.PI) * peak * (factors[step] ?? 1);
                                            const title = `${scale.name}-${step}: L ${l.toFixed(3)}, C ${c.toFixed(3)}`;

                                            return (
                                                <div
                                                    key={step}
                                                    style={{
                                                        backgroundColor: `var(--ii-primitive-${scale.name}-${step})`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        padding: '16px',
                                                        border: isOrigin ? '3px solid black' : 'none',
                                                        boxSizing: 'border-box',
                                                    }}
                                                    title={title}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize: '12px',
                                                            fontWeight: isOrigin ? 'bold' : 'normal',
                                                            color: l > 0.6 ? '#000' : '#fff',
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
                                            type="range"
                                            min={0}
                                            max={0.37}
                                            step={0.001}
                                            value={peak}
                                            aria-label={`Chroma for ${scale.label}`}
                                            onChange={(event) => setChroma(scale.name, Number(event.target.value))}
                                            style={{ flex: 1, minWidth: 0 }}
                                        />
                                        <span style={SMALL}>{peak.toFixed(3)}</span>
                                    </HStack>
                                </div>

                                <div className="ix-grid ix-mb-xs" style={ROW}>
                                    <div />
                                    <details>
                                        <summary style={{ fontSize: '14px', cursor: 'pointer' }}>
                                            Juster chroma per trinn for {scale.label}
                                        </summary>
                                        <div className="ix-grid ix-mt-2xs" style={STEPS_GRID}>
                                            {DEFAULT_STEPS.map((step) => (
                                                <div
                                                    key={step}
                                                    style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                                                >
                                                    <input
                                                        type="range"
                                                        min={0}
                                                        max={2}
                                                        step={0.05}
                                                        value={factors[step] ?? 1}
                                                        aria-label={`Chroma-faktor for ${scale.label} trinn ${step}`}
                                                        onChange={(event) => {
                                                            const value = Number(event.target.value);
                                                            setChromaFactor(scale.name, step, value);
                                                        }}
                                                        style={VERTICAL_SLIDER}
                                                    />
                                                    <span style={SMALL}>×{(factors[step] ?? 1).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                    <div />
                                </div>
                            </div>
                        );
                    })}
                </VStack>
            </VStack>
        </div>
    );
}
