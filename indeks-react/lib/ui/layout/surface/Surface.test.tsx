import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Surface } from './Surface';

describe('Surface', () => {
    it('skal rendre som div med base-klassen ix-surface', () => {
        render(<Surface>Innhold</Surface>);
        const surface = screen.getByText('Innhold');
        expect(surface.tagName).toBe('DIV');
        expect(surface.classList).toContain('ix-surface');
    });

    it('skal mappe surfaceColor, border og radius til utility-klasser', () => {
        render(
            <Surface surfaceColor="info" border="default" radius="md">
                Flate
            </Surface>
        );
        const surface = screen.getByText('Flate');
        expect(surface.classList).toContain('ix-color-surface-info-default');
        expect(surface.classList).toContain('ix-border-default');
        expect(surface.classList).toContain('ix-radius-md');
    });

    it('skal mappe spacing-, gap- og flex-props til utility-klasser', () => {
        render(
            <Surface padding="md" gap="sm" justifyContent="center" alignItems="start" fullWidth>
                Layout
            </Surface>
        );
        const surface = screen.getByText('Layout');
        expect(surface.classList).toContain('ix-p-md');
        expect(surface.classList).toContain('ix-gap-sm');
        expect(surface.classList).toContain('ix-justify-center');
        expect(surface.classList).toContain('ix-items-start');
        expect(surface.classList).toContain('ix-full-width');
    });

    it('skal rendre valgt element via as-prop', () => {
        render(<Surface as="section">Seksjon</Surface>);
        expect(screen.getByText('Seksjon').tagName).toBe('SECTION');
    });

    it('skal videresende ekstra props og className til elementet', () => {
        render(
            <Surface data-test="verdi" id="flate-1" className="egen-klasse">
                Innhold
            </Surface>
        );
        const surface = screen.getByText('Innhold');
        expect(surface.getAttribute('data-test')).toBe('verdi');
        expect(surface.getAttribute('id')).toBe('flate-1');
        expect(surface.classList).toContain('egen-klasse');
    });
});
