export function buildSemanticColors(lightTokens: any, darkTokens: any) {
    const semanticColors = {
        light: transform(lightTokens.color),
        dark: transform(darkTokens.color),
    };
    return semanticColors;
}

function strip(val: string) {
    const trimmed = val.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        return trimmed.substring(7, trimmed.length - 1);
    }
    return trimmed;
}

function transform(obj: any): any {
    if (obj == null) return obj;
    if (typeof obj === 'object' && '$value' in obj && typeof obj.$value === 'string') {
        return strip(obj.$value);
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => transform(item));
    }
    if (typeof obj === 'object') {
        const out: any = {};
        for (const key of Object.keys(obj)) {
            out[key] = transform(obj[key]);
        }
        return out;
    }
    return obj;
}
