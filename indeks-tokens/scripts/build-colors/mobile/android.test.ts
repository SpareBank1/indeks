import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock modules before importing
vi.mock('../../utils', () => ({
    writeFileSyncEnsureDir: vi.fn(),
}));

vi.mock('fs', () => ({
    readFileSync: vi.fn(() => JSON.stringify({ version: '1.0.0' })),
}));

import {
    transformToAndroidHex,
    transformToAndroidColorName,
    generateAndroidColorFileContent,
    buildAndroidColors,
} from './android';
import { writeFileSyncEnsureDir } from '../../utils';

describe('android.ts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('transformToAndroidHex', () => {
        it('should convert 6-char hex to 0xFF format (uppercase)', () => {
            expect(transformToAndroidHex('#123abc')).toBe('0xFF123ABC');
            expect(transformToAndroidHex('#ABCDEF')).toBe('0xFFABCDEF');
            expect(transformToAndroidHex('123abc')).toBe('0xFF123ABC');
        });

        it('should convert 8-char hex with alpha to 0x format', () => {
            expect(transformToAndroidHex('#AABBCCDD')).toBe('0xDDAABBCC');
            expect(transformToAndroidHex('AABBCC80')).toBe('0x80AABBCC');
        });

        it('should throw on invalid format', () => {
            expect(() => transformToAndroidHex('red')).toThrow('Invalid color value');
            expect(() => transformToAndroidHex('12345')).toThrow('Invalid color value');
            expect(() => transformToAndroidHex('')).toThrow('Invalid color value');
        });
    });

    describe('transformToAndroidColorName', () => {
        it('should convert dot notation to camelCase', () => {
            expect(transformToAndroidColorName('primary.color')).toBe('primaryColor');
            expect(transformToAndroidColorName('a.b.c')).toBe('aBC');
            expect(transformToAndroidColorName('single')).toBe('single');
        });

        it('should handle empty string', () => {
            expect(transformToAndroidColorName('')).toBe('');
        });
    });

    describe('generateAndroidColorFileContent', () => {
        it('should generate Kotlin color file content', () => {
            const colors = {
                light: {
                    'primary.color': '#123456',
                    'secondary.color': '#abcdef',
                },
                dark: {
                    'primary.color': '#654321',
                    'secondary.color': '#fedcba',
                },
                lightAccent: {
                    'primary.color': '#111111',
                    'secondary.color': '#222222',
                },
                darkAccent: {
                    'primary.color': '#333333',
                    'secondary.color': '#444444',
                },
            };
            const content = generateAndroidColorFileContent(colors);
            expect(content).toContain('val primaryColor = Color(0xFF123456)');
            expect(content).toContain('val secondaryColor = Color(0xFFABCDEF)');
            expect(content).toContain('object LightDefault');
            expect(content).toContain('object DarkDefault');
            expect(content).toContain('object LightAccent');
            expect(content).toContain('object DarkAccent');
        });

        it('should throw if color value is invalid', () => {
            const colors = {
                light: { 'bad.color': 'notacolor' },
                dark: { 'bad.color': 'notacolor' },
                lightAccent: { 'bad.color': 'notacolor' },
                darkAccent: { 'bad.color': 'notacolor' },
            };
            expect(() => generateAndroidColorFileContent(colors)).toThrow('Invalid color value');
        });
    });

    describe('buildAndroidColors', () => {
        it('should call writeFileSyncEnsureDir for each path', () => {
            const path = '/tmp/test';
            const colors = {
                light: { 'a.b': '#111111' },
                dark: { 'a.b': '#222222' },
                lightAccent: { 'a.b': '#333333' },
                darkAccent: { 'a.b': '#444444' },
            };

            buildAndroidColors(path, colors);

            expect(writeFileSyncEnsureDir).toHaveBeenCalledTimes(1);
            expect(writeFileSyncEnsureDir).toHaveBeenCalledWith(
                '/tmp/test/Colors.kt',
                expect.stringContaining('object Colors')
            );
        });
    });
});
