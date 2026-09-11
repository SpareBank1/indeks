import { describe, it, expect } from 'vitest';
import { buildTailwindUtils } from '../tailwind';

// Emitteren leser navnene rett ut av css/spacing.css og css/typography.css, så testen
// kjøres mot de faktiske skalaene i pakken.
const css = buildTailwindUtils('0.0.0-test');

describe('buildTailwindUtils', () => {
    it('aliaser spacing på Tailwinds spacing-navnerom', () => {
        expect(css).toContain('--spacing-md: var(--ix-spacing-md);');
        expect(css).toContain('--spacing-2xs: var(--ix-spacing-2xs);');
    });

    it('aliaser fontstørrelser på text-navnerommet', () => {
        expect(css).toContain('--text-lg: var(--ix-font-size-lg);');
    });

    it('nullstiller Tailwinds parrede linjehøyde, som ellers overlever vår fontstørrelse', () => {
        expect(css).toContain('--text-lg--line-height: initial;');
        expect(css).toContain('--text-3xl--line-height: initial;');
    });

    it('nullstiller ikke linjehøyde for spacing, som ikke har en parret verdi', () => {
        expect(css).not.toContain('--spacing-md--line-height');
    });

    it('beholder skalarekkefølgen fra kildefilen, ikke alfabetisk', () => {
        expect(css.indexOf('--spacing-2xs:')).toBeLessThan(css.indexOf('--spacing-md:'));
        expect(css.indexOf('--spacing-md:')).toBeLessThan(css.indexOf('--spacing-2xl:'));
    });

    it('bruker @theme inline, så density og breakpoint fortsatt styrer verdien', () => {
        expect(css).toContain('@theme inline {');
    });

    it('inneholder ingen piksel-verdier — spacing må gå gjennom var() for å følge density', () => {
        expect(css).not.toMatch(/:\s*\d+px;/);
    });
});
