import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export const STORAGE_KEY = 'indeks-docs-preferences';

export type Variant = 'react' | 'html';

export type Preferences = {
    variant: Variant;
    showCodeByDefault: boolean;
    mobilbank: boolean;
    onboarded: boolean;
};

export const defaultPreferences: Preferences = {
    variant: 'react',
    showCodeByDefault: false,
    mobilbank: false,
    onboarded: false,
};

// Ukjente/ugyldige felter faller tilbake til defaults — tåler skjema-utvidelser senere.
function normalize(raw: unknown): Preferences {
    if (!raw || typeof raw !== 'object') return defaultPreferences;
    const obj = raw as Record<string, unknown>;
    return {
        variant: obj.variant === 'html' ? 'html' : 'react',
        showCodeByDefault: typeof obj.showCodeByDefault === 'boolean' ? obj.showCodeByDefault : defaultPreferences.showCodeByDefault,
        mobilbank: typeof obj.mobilbank === 'boolean' ? obj.mobilbank : defaultPreferences.mobilbank,
        onboarded: typeof obj.onboarded === 'boolean' ? obj.onboarded : defaultPreferences.onboarded,
    };
}

export function readPreferences(): Preferences {
    if (!ExecutionEnvironment.canUseDOM) return defaultPreferences;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultPreferences;
        return normalize(JSON.parse(raw));
    } catch {
        return defaultPreferences;
    }
}

export function writePreferences(prefs: Preferences): void {
    if (!ExecutionEnvironment.canUseDOM) return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
        // localStorage kan være utilgjengelig (private mode, kvote). Stille fallback.
    }
}
