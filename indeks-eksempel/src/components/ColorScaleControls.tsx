import { Text } from '@sb1/indeks-react';
import { colorScales, defaultColors } from './colorScaleConfig';
import { useColorOverrides } from '../contexts/ColorOverrideContext';

/**
 * De 7 fargevelgerne (color-picker + hex-felt per skala) som overstyrer
 * appens basisfarger i runtime via {@link useColorOverrides}. Delt mellom
 * settings-popoveren og den fulle «Generer farger»-siden.
 *
 * Radene er et grid (`etikett | swatch | hex`) slik at de holder seg på én
 * linje uten å brekke selv i den smale settings-popoveren.
 */
export function ColorScaleControls() {
    const { colorOverrides, setColorOverride } = useColorOverrides();

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'auto 32px minmax(0, 1fr)',
                gap: 'var(--ix-spacing-2xs) var(--ix-spacing-sm)',
                alignItems: 'center',
            }}
        >
            {colorScales.map((scale) => {
                const value = colorOverrides[scale.name] ?? defaultColors[scale.name];

                return (
                    <div key={scale.name} style={{ display: 'contents' }}>
                        <Text>{scale.label}</Text>
                        <input
                            type="color"
                            aria-label={`Velg basisfarge for ${scale.label}`}
                            value={value}
                            onChange={(event) => setColorOverride(scale.name, event.target.value)}
                            style={{ width: '32px', height: '32px', padding: 0, border: 'none' }}
                        />
                        <input
                            type="text"
                            aria-label={`Hex-verdi for ${scale.label}`}
                            value={value}
                            onChange={(event) => setColorOverride(scale.name, event.target.value)}
                            className="ix-border-default ix-p-2xs"
                            style={{ width: '100%', minWidth: 0, fontFamily: 'monospace' }}
                        />
                    </div>
                );
            })}
        </div>
    );
}
