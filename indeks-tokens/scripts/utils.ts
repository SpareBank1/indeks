export type FlatRecord<T> = Record<string, T>;

/**
 * Flattens a nested object (only objects) to dot-separated keys.
 * Values are expected to be strings or numbers.
 * Example:
 * { background: { default: "color.gray.950" } } -> { "background.default": "color.gray.950" }
 */
export function flattenObject<T>(obj: Record<string, unknown>, separator = '.'): FlatRecord<T> {
    const out: FlatRecord<T> = {};

    const walk = (value: unknown, path: string) => {
        if (value && typeof value === 'object') {
            for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
                const nextPath = path ? `${path}${separator}${k}` : k;
                walk(v, nextPath);
            }
            return;
        }

        out[path] = value as T;
    };

    walk(obj, '');
    return out;
}
