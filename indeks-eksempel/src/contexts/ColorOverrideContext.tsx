import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
    applyColorScaleVariables,
    buildColorScaleVariables,
    type ColorScaleVariables,
} from '@sb1/indeks-tokens/generate';
import type { OriginColor, OriginScaleNames } from '@sb1/indeks-tokens/generate';

/**
 * Lar hele eksempelappen rethem-e farger «on-the-fly» i runtime via
 * `@sb1/indeks-tokens/generate`. Vi setter de genererte `--ii-primitive-*` på
 * `document.documentElement`, og alle semantiske `--ix-color-*` re-resolver seg selv
 * via `var()`-kaskaden — så nav, komponenter og swatches oppdateres samtidig.
 *
 * State bor her (over rutene) slik at en override overlever navigasjon mellom sider
 * og kan nullstilles fra innstillinger.
 */

type ColorOverrides = Partial<Record<OriginScaleNames, OriginColor>>;

interface ColorOverrideContextType {
    /** Aktive overstyringer, skala → basisfarge. */
    colorOverrides: ColorOverrides;
    /** Sett (eller fjern, med tom verdi) en skalas basisfarge. */
    setColorOverride: (name: OriginScaleNames, color: string) => void;
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
const isValidHex = (value: string): value is OriginColor => /^#[0-9a-fA-F]{6}$/.test(value);

interface ColorOverrideProviderProps {
    children: React.ReactNode;
}

export const ColorOverrideProvider: React.FC<ColorOverrideProviderProps> = ({ children }) => {
    const [colorOverrides, setColorOverrides] = useState<ColorOverrides>({});
    // Husk hvilke variabler vi har satt, så vi kan fjerne akkurat dem ved reset.
    const [appliedVariables, setAppliedVariables] = useState<ColorScaleVariables>({});

    useEffect(() => {
        const next: ColorScaleVariables = {};
        for (const [name, color] of Object.entries(colorOverrides)) {
            if (!color || !isValidHex(color)) continue;
            Object.assign(next, buildColorScaleVariables(name as OriginScaleNames, color));
        }
        applyColorScaleVariables(document.documentElement, next);
        setAppliedVariables(next);
    }, [colorOverrides]);

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

    const resetColors = useCallback(() => {
        const { style } = document.documentElement;
        for (const property of Object.keys(appliedVariables)) {
            style.removeProperty(property);
        }
        setColorOverrides({});
    }, [appliedVariables]);

    const value: ColorOverrideContextType = { colorOverrides, setColorOverride, resetColors };

    return <ColorOverrideContext.Provider value={value}>{children}</ColorOverrideContext.Provider>;
};

export default ColorOverrideContext;
