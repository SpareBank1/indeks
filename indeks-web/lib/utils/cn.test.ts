import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
    it('slår sammen strenger med mellomrom', () => {
        expect(cn('ix-a', 'ix-b')).toBe('ix-a ix-b');
    });

    it('filtrerer bort falsy verdier (false/undefined/null)', () => {
        expect(cn('ix-a', false, undefined, null, 'ix-b')).toBe('ix-a ix-b');
    });

    it('støtter betinget && som gir false', () => {
        const full = false;
        const wide = true;
        expect(cn('ix-button', full && 'ix-w-full', wide && 'ix-wide')).toBe('ix-button ix-wide');
    });

    it('tar med objekt-nøkler med truthy verdi', () => {
        expect(cn({ 'ix-a': true, 'ix-b': false, 'ix-c': undefined })).toBe('ix-a');
    });

    it('behandler 0 som falsy i objekt-verdi', () => {
        expect(cn({ 'ix-a': 0, 'ix-b': 1 })).toBe('ix-b');
    });

    it('støtter computed/template-literal-nøkler', () => {
        const margin = 'md';
        const paddingX = undefined;
        expect(cn({ [`ix-m-${margin}`]: margin, [`ix-px-${paddingX}`]: paddingX })).toBe('ix-m-md');
    });

    it('flater ut arrays blandet med strenger', () => {
        const size = 'md';
        expect(cn('ix-table', [`ix-table--${size}`], 'ix-x')).toBe('ix-table ix-table--md ix-x');
    });

    it('håndterer nøstede arrays', () => {
        expect(cn('ix-a', ['ix-b', ['ix-c', false]])).toBe('ix-a ix-b ix-c');
    });

    it('blander strenger, objekter og undefined className i ett kall', () => {
        const className = undefined;
        expect(cn('ix-text', { 'ix-mb-md': true, 'ix-text--long': false }, className)).toBe('ix-text ix-mb-md');
    });

    it('returnerer tom streng når ingenting matcher', () => {
        expect(cn()).toBe('');
        expect(cn(undefined)).toBe('');
        expect(cn(false, null, { 'ix-a': false })).toBe('');
    });

    it('tom streng gjør `cn(className) || undefined` til undefined', () => {
        const className = undefined;
        expect(cn(className) || undefined).toBeUndefined();
    });
});
