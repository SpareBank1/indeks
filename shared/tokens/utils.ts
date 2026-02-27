import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

export type FlatToken = {
    path: string[];
    keyPath: string[];
    description: string;
    value: string;
    internal: boolean;
    prefixes: string[];
    _property?: string;
    _key?: string;
};

function normalizePrefix(p: unknown): string[] {
    if (Array.isArray(p)) return p.filter((x) => typeof x === 'string') as string[];
    if (typeof p === 'string' && p.trim() !== '') return [p];
    return [];
}

/**
 * Flattens a nested token object into an array of flat token entries with
 * full context: path, keyPath, property propagation, `_key` overrides, and prefixes.
 *
 * Supports both usages from indeks-utils and indeks-tokens via optional params.
 * @param obj - The token object to flatten
 * @param tokenType - The token type (e.g., 'border', 'colors') to be used in path and keyPath
 * @param path - Internal parameter for recursion tracking
 * @param keyPath - Internal parameter for recursion tracking
 * @param _property - Internal parameter for property propagation
 * @param prefixes - Internal parameter for prefix propagation
 */
export function flattenTokens(
    obj: any,
    tokenType: string = '',
    path: string[] = [],
    keyPath: string[] = [],
    _property: string = '',
    prefixes: string[] = []
): Array<FlatToken> {
    let result: Array<FlatToken> = [];
    if (!obj || typeof obj !== 'object') return result;

    const ownPrefixes = normalizePrefix((obj as any)._prefix);
    const currentPrefixes = [...prefixes, ...ownPrefixes];

    // Determine the _property to pass down
    const currentProperty = (obj as any)._property ? String((obj as any)._property) : _property;

    // Initialize path and keyPath with tokenType if at root level
    const basePath = path.length === 0 && tokenType ? [tokenType] : path;
    // If at root level and object has _key, use that instead of tokenType for keyPath
    const rootKey = path.length === 0 && (obj as any)._key ? String((obj as any)._key) : tokenType;
    const baseKeyPath = keyPath.length === 0 && rootKey ? [rootKey] : keyPath;

    // If the object itself is a token, add it
    if ('value' in obj) {
        result.push({
            path: basePath,
            keyPath: baseKeyPath,
            description: String((obj as any).description),
            value: String((obj as any).value),
            internal: Boolean((obj as any).internal || false),
            prefixes: currentPrefixes,
            _property: (obj as any)._property ? String((obj as any)._property) : currentProperty,
            _key: (obj as any)._key ? String((obj as any)._key) : undefined,
        });
        return result;
    }

    for (const [k, v] of Object.entries(obj)) {
        if (v && typeof v === 'object' && 'value' in v) {
            const leaf = v as any;
            const nextKeyName = leaf._key ? String(leaf._key) : k;
            const nextPath = [...basePath, k];
            const nextKeyPath = [...baseKeyPath, nextKeyName];

            const childPrefixes = [...currentPrefixes, ...normalizePrefix(leaf._prefix)];

            result.push({
                path: nextPath,
                keyPath: nextKeyPath,
                description: String(leaf.description),
                value: String(leaf.value),
                internal: Boolean(leaf.internal || false),
                prefixes: childPrefixes,
                _property: leaf._property ? String(leaf._property) : currentProperty,
                _key: leaf._key ? String(leaf._key) : undefined,
            });
        } else if (typeof v === 'object' && v !== null) {
            const child = v as any;
            const nextKeyName = child._key ? String(child._key) : k;
            const nextPath = [...basePath, k];
            const nextKeyPath = [...baseKeyPath, nextKeyName];

            const nextProperty =
                typeof child._property !== 'undefined' && child._property !== undefined
                    ? String(child._property)
                    : currentProperty;

            result = result.concat(flattenTokens(child, tokenType, nextPath, nextKeyPath, nextProperty, currentPrefixes));
        }
    }
    return result;
}

/**
 * Build a CSS custom property name from explicit parts.
 * Example: --ix-[prefix-]tokenType-segment-segment
 */
export function buildCSSVarNameFromToken(token: FlatToken): string {
    const scope = token.internal ? 'ii' : 'ix';
    const tokenType = token.path[0] || '';
    const segments = token.path.slice(1);
    const prefixPart = token.prefixes && token.prefixes.length ? token.prefixes.join('-') + '-' : '';
    const pathPart = segments.join('-');
    return `--${scope}-${prefixPart}${tokenType}-${pathPart}`;
}

/**
 * Writes a file synchronously, ensuring the parent directory exists.
 */
export function writeFileSyncEnsureDir(filePath: string, data: string): void {
    const dir = dirname(filePath);
    mkdirSync(dir, { recursive: true });
    writeFileSync(filePath, data);
}
