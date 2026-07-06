import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
    it('skal rendre som div uten href/onClick', () => {
        render(<Card>Statisk innhold</Card>);
        const card = screen.getByText('Statisk innhold');
        expect(card.tagName).toBe('DIV');
        expect(card.classList).toContain('ix-card');
        expect(card.classList).not.toContain('ix-card--clickable');
    });

    it('skal rendre som lenke når href er satt', () => {
        render(<Card href="https://example.com">Lenke-kort</Card>);
        const link = screen.getByRole('link', { name: 'Lenke-kort' });
        expect(link.tagName).toBe('A');
        expect(link.getAttribute('href')).toBe('https://example.com');
        expect(link.classList).toContain('ix-card--clickable');
    });

    it('skal rendre som button når kun onClick er satt', () => {
        render(<Card onClick={() => {}}>Knapp-kort</Card>);
        const button = screen.getByRole('button', { name: 'Knapp-kort' });
        expect(button.tagName).toBe('BUTTON');
        expect(button.getAttribute('type')).toBe('button');
        expect(button.classList).toContain('ix-card--clickable');
    });

    it('skal kalle onClick når button-kort aktiveres', () => {
        const onClick = vi.fn();
        render(<Card onClick={onClick}>Klikk meg</Card>);
        fireEvent.click(screen.getByRole('button', { name: 'Klikk meg' }));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it('skal videresende ekstra props til elementet', () => {
        render(
            <Card data-test="verdi" id="kort-1">
                Innhold
            </Card>
        );
        const card = screen.getByText('Innhold');
        expect(card.getAttribute('data-test')).toBe('verdi');
        expect(card.getAttribute('id')).toBe('kort-1');
    });

    it('skal ikke rendre chevron-ikon på statisk kort', () => {
        const { container } = render(<Card>Statisk</Card>);
        expect(container.querySelector('.ix-card__chevron')).toBeNull();
    });

    it('skal rendre chevron-ikon med pil-hoyre som standard når klikkbart', () => {
        const { container } = render(<Card href="https://example.com">Lenke</Card>);
        const chevron = container.querySelector('ix-icon.ix-card__chevron');
        expect(chevron).not.toBeNull();
        expect(chevron?.getAttribute('name')).toBe('chevron_right');
    });

    it('skal kunne overstyre chevron-ikonet via chevronIcon', () => {
        const { container } = render(
            <Card onClick={() => {}} chevronIcon="chevron_left">
                Handling
            </Card>
        );
        expect(container.querySelector('ix-icon.ix-card__chevron')?.getAttribute('name')).toBe('chevron_left');
    });

    it('skal åpne i ny fane når openInNewTab er satt sammen med href', () => {
        render(
            <Card href="https://example.com" openInNewTab>
                Ny fane
            </Card>
        );
        const link = screen.getByRole('link', { name: 'Ny fane' });
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('skal ignorere openInNewTab uten href', () => {
        render(
            <Card openInNewTab onClick={() => {}}>
                Handling
            </Card>
        );
        const button = screen.getByRole('button', { name: 'Handling' });
        expect(button.getAttribute('target')).toBeNull();
    });
});
