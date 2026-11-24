import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
    applyColorScaleVariables,
    buildColorScaleVariables,
    DEFAULT_STEPS,
    type ColorScaleVariables,
} from '@sb1/indeks-tokens/generate';
import type { OriginColor, OriginScaleNames } from '@sb1/indeks-tokens/generate';
import { colorScales, defaultColors } from '../components/colorScaleConfig';

/**
 * Lar hele eksempelappen rethem-e farger «on-the-fly» i runtime via
 * `@sb1/indeks-tokens/generate`. Vi setter de genererte `--ii-primitive-*` på
 * `document.documentElement`, og alle semantiske `--ix-color-*` re-resolver seg selv
 * via `var()`-kaskaden — så nav, komponenter og swatches oppdateres samtidig.
 *
 * State bor her (over rutene) slik at en override overlever navigasjon mellom sider
 * og kan nullstilles fra innstillinger.
 */

export type Step = (typeof DEFAULT_STEPS)[number];
type ColorOverrides = Partial<Record<OriginScaleNames, OriginColor>>;
type StepValues = Partial<Record<Step, number>>;

interface ColorOverrideContextType {
    /** Aktive overstyringer, skala → basisfarge. */
    colorOverrides: ColorOverrides;
    /** Sett (eller fjern, med tom verdi) en skalas basisfarge. */
    setColorOverride: (name: OriginScaleNames, color: string) => void;
    /** Lysstyrke per trinn, felles for alle skalaer. */
    lightness: StepValues;
    setLightness: (step: Step, value: number) => void;
    /** Topp-chroma per skala. */
    chroma: Partial<Record<OriginScaleNames, number>>;
    setChroma: (name: OriginScaleNames, value: number) => void;
    /** Chroma-faktor per trinn, per skala. */
    chromaFactor: Partial<Record<OriginScaleNames, StepValues>>;
    setChromaFactor: (name: OriginScaleNames, step: Step, value: number) => void;
    /** Nullstill alle overstyringer og la aktivt theme ta over igjen. */
    resetColors: () => void;
}

const ColorOverrideContext = createContext<ColorOverrideContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useColorOverrides = (): ColorOverrideContextType => {
    const context = useContext(ColorOverrideContext);
    if (!context) {
        throw new Error('useColorOverrides must be used within a ColorOverrideProvider');
    }
    return context;
};

/** Gyldig 6-sifret hex — ellers hopper vi over (brukeren skriver kanskje fortsatt). */
const isValidHex = (value: string | undefined): value is OriginColor =>
    !!value && /^#[0-9a-fA-F]{6}$/.test(value);

interface ColorOverrideProviderProps {
    children: React.ReactNode;
}

export const ColorOverrideProvider: React.FC<ColorOverrideProviderProps> = ({ children }) => {
    const [colorOverrides, setColorOverrides] = useState<ColorOverrides>({});
    const [lightness, setLightnessState] = useState<StepValues>({});
    const [chroma, setChromaState] = useState<ColorOverrideContextType['chroma']>({});
    const [chromaFactor, setChromaFactorState] = useState<ColorOverrideContextType['chromaFactor']>({});
    // Husk hva vi har satt, så variabler som ikke lenger er overstyrt kan fjernes.
    const appliedVariables = useRef<ColorScaleVariables>({});

    useEffect(() => {
        // Lysstyrken er felles, så en overstyring der må bygge alle skalaene på nytt.
        const allScales = Object.keys(lightness).length > 0;
        const next: ColorScaleVariables = {};

        for (const { name } of colorScales) {
            const override = colorOverrides[name];
            const touched =
                allScales || isValidHex(override) || chroma[name] !== undefined || chromaFactor[name] !== undefined;
            if (!touched) continue;

            const color = isValidHex(override) ? override : (defaultColors[name] as OriginColor);
            Object.assign(
                next,
                buildColorScaleVariables(name, color, {
                    lightness,
                    chroma: chroma[name],
                    chromaFactor: chromaFactor[name],
                })
            );
        }

        const { style } = document.documentElement;
        for (const property of Object.keys(appliedVariables.current)) {
            if (!(property in next)) style.removeProperty(property);
        }
        applyColorScaleVariables(document.documentElement, next);
        appliedVariables.current = next;
    }, [colorOverrides, lightness, chroma, chromaFactor]);

    const setColorOverride = useCallback((name: OriginScaleNames, color: string) => {
        setColorOverrides((prev) => {
            if (!color) {
                const next = { ...prev };
                delete next[name];
                return next;
            }
            return { ...prev, [name]: color as OriginColor };
        });
    }, []);

    const setLightness = useCallback((step: Step, value: number) => {
        setLightnessState((prev) => ({ ...prev, [step]: value }));
    }, []);

    const setChroma = useCallback((name: OriginScaleNames, value: number) => {
        setChromaState((prev) => ({ ...prev, [name]: value }));
    }, []);

    const setChromaFactor = useCallback((name: OriginScaleNames, step: Step, value: number) => {
        setChromaFactorState((prev) => ({ ...prev, [name]: { ...prev[name], [step]: value } }));
    }, []);

    const resetColors = useCallback(() => {
        setColorOverrides({});
        setLightnessState({});
        setChromaState({});
        setChromaFactorState({});
    }, []);

    const value: ColorOverrideContextType = {
        colorOverrides,
        setColorOverride,
        lightness,
        setLightness,
        chroma,
        setChroma,
        chromaFactor,
        setChromaFactor,
        resetColors,
    };

    return <ColorOverrideContext.Provider value={value}>{children}</ColorOverrideContext.Provider>;
};

export default ColorOverrideContext;
