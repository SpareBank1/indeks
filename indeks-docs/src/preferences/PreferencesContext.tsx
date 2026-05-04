import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
    defaultPreferences,
    readPreferences,
    writePreferences,
    STORAGE_KEY,
    type Preferences,
} from './storage';

type PreferencesContextValue = {
    preferences: Preferences;
    // False under SSR og første render; true etter at localStorage er lest.
    // Komponenter som flasher av å rendre default-verdier først (f.eks.
    // banneret på komponentsider) bør vente til `hydrated` er true.
    hydrated: boolean;
    setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
    setPreferences: (partial: Partial<Preferences>) => void;
    resetPreferences: () => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
    // Start med defaults slik at SSR og første render matcher. Hydreres i effect.
    const [preferences, setPreferencesState] = useState<Preferences>(defaultPreferences);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setPreferencesState(readPreferences());
        setHydrated(true);

        const onStorage = (event: StorageEvent) => {
            if (event.key !== STORAGE_KEY) return;
            setPreferencesState(readPreferences());
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const setPreferences = useCallback((partial: Partial<Preferences>) => {
        setPreferencesState((prev) => {
            const next = { ...prev, ...partial };
            writePreferences(next);
            return next;
        });
    }, []);

    const setPreference = useCallback(<K extends keyof Preferences>(key: K, value: Preferences[K]) => {
        setPreferences({ [key]: value } as Partial<Preferences>);
    }, [setPreferences]);

    const resetPreferences = useCallback(() => {
        writePreferences(defaultPreferences);
        setPreferencesState(defaultPreferences);
    }, []);

    const value = useMemo<PreferencesContextValue>(
        () => ({ preferences, hydrated, setPreference, setPreferences, resetPreferences }),
        [preferences, hydrated, setPreference, setPreferences, resetPreferences]
    );

    return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
    const ctx = useContext(PreferencesContext);
    if (!ctx) {
        // Fallback slik at komponenter utenfor provider (rare kanter) ikke krasjer.
        return {
            preferences: defaultPreferences,
            hydrated: false,
            setPreference: () => {},
            setPreferences: () => {},
            resetPreferences: () => {},
        };
    }
    return ctx;
}
