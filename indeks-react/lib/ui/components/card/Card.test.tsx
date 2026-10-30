import { render, screen } from '@testing-library/react';
import type { AnchorHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
    it('rendrer én lenke med tittelen som navn', () => {
        render(<Card href="/konto" title="Brukskonto" subtitle="1234 56 78901" />);
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(1);
        expect(links[0].getAttribute('href')).toBe('/konto');
        expect(links[0].textContent).toBe('Brukskonto');
        expect(links[0].classList).toContain('ix-card__link');
    });

    it('rendrer rot som div med small som standardvariant', () => {
        const { container } = render(<Card href="/" title="Tittel" />);
        const root = container.firstElementChild;
        expect(root?.tagName).toBe('DIV');
        expect(root?.classList).toContain('ix-card');
        expect(root?.getAttribute('data-variant')).toBe('small');
        expect(root?.hasAttribute('data-appearance')).toBe(false);
    });

    it('legger tittelen i h3 som standard, og bytter nivå med titleAs', () => {
        const { rerender } = render(<Card href="/" title="Tittel" />);
        expect(screen.getByRole('heading', { level: 3, name: 'Tittel' })).toBeTruthy();
        rerender(<Card href="/" title="Tittel" titleAs="h2" />);
        expect(screen.getByRole('heading', { level: 2, name: 'Tittel' })).toBeTruthy();
    });

    it('setter data-appearance="dashed" på small', () => {
        const { container } = render(<Card href="/" title="Legg til" appearance="dashed" />);
        expect(container.firstElementChild?.getAttribute('data-appearance')).toBe('dashed');
    });

    it('rendrer leading med data-type', () => {
        const { container } = render(
            <Card href="/" title="Tittel" leading={<span aria-hidden>ikon</span>} leadingType="icon-background" />
        );
        const leading = container.querySelector('.ix-card__leading');
        expect(leading?.getAttribute('data-type')).toBe('icon-background');
    });

    it('rendrer media, beskrivelse og tag på large-varianter', () => {
        const { container } = render(
            <Card
                href="/"
                variant="large-vertical"
                title="Tittel"
                media={<img src="bilde.jpg" alt="" />}
                mediaType="illustration"
                description="Beskrivelse"
                tag={<span className="ix-tag">Ny</span>}
            />
        );
        expect(container.firstElementChild?.getAttribute('data-variant')).toBe('large-vertical');
        expect(container.querySelector('.ix-card__media')?.getAttribute('data-type')).toBe('illustration');
        expect(container.querySelector('.ix-card__description')?.textContent).toBe('Beskrivelse');
        expect(container.querySelector('.ix-card__tags')?.textContent).toBe('Ny');
    });

    it('utelater valgfrie deler når de ikke er satt', () => {
        const { container } = render(<Card href="/" title="Tittel" />);
        expect(container.querySelector('.ix-card__leading')).toBeNull();
        expect(container.querySelector('.ix-card__subtitle')).toBeNull();
    });

    it('bruker arrow_forward som navigasjonsikon for intern lenke', () => {
        const { container } = render(<Card href="/" title="Tittel" />);
        const icon = container.querySelector('ix-icon.ix-card__nav-icon');
        expect(icon?.getAttribute('name')).toBe('arrow_forward');
        expect(icon?.getAttribute('aria-hidden')).toBe('true');
        expect(screen.getByRole('link').getAttribute('target')).toBeNull();
    });

    it('åpner ekstern lenke i ny fane og legger externalLabel til lenkenavnet', () => {
        const { container } = render(
            <Card href="https://example.com" title="Les mer" external externalLabel="(åpnes i ny fane)" />
        );
        const link = screen.getByRole('link', { name: 'Les mer (åpnes i ny fane)' });
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
        expect(container.querySelector('.ix-card__nav-icon')?.getAttribute('name')).toBe('open_in_new');
    });

    it('videresender linkProps til lenken og øvrige props til roten', () => {
        const onClick = vi.fn();
        const { container } = render(
            <Card
                href="/"
                title="Tittel"
                id="kort-1"
                className="egen"
                linkProps={{ onClick, 'aria-current': 'page' }}
            />
        );
        const root = container.firstElementChild;
        expect(root?.id).toBe('kort-1');
        expect(root?.classList).toContain('egen');
        const link = screen.getByRole('link');
        link.click();
        expect(onClick).toHaveBeenCalledOnce();
        expect(link.getAttribute('aria-current')).toBe('page');
    });

    describe('linkAs', () => {
        // Etterligner React Router: `to` i stedet for `href`.
        function RouterLink({ to, ...rest }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
            return <a {...rest} href={to} data-router="" />;
        }

        // Etterligner Next: tar `href`.
        function NextLink(props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; prefetch?: boolean }) {
            const { prefetch, ...rest } = props;
            return <a {...rest} data-prefetch={prefetch ? '' : undefined} />;
        }

        it('rendrer router-lenken med to fra linkProps', () => {
            render(<Card linkAs={RouterLink} linkProps={{ to: '/konto' }} title="Brukskonto" />);
            const link = screen.getByRole('link', { name: 'Brukskonto' });
            expect(link.getAttribute('href')).toBe('/konto');
            expect(link.hasAttribute('data-router')).toBe(true);
            expect(link.classList).toContain('ix-card__link');
        });

        it('videresender href og egne props til en Next-lignende lenke', () => {
            render(<Card linkAs={NextLink} href="/konto" linkProps={{ prefetch: true }} title="Brukskonto" />);
            const link = screen.getByRole('link', { name: 'Brukskonto' });
            expect(link.getAttribute('href')).toBe('/konto');
            expect(link.hasAttribute('data-prefetch')).toBe(true);
        });

        it('typesjekker linkAs mot external og linkProps', () => {
            // @ts-expect-error — linkAs kan ikke kombineres med external.
            void (<Card linkAs={RouterLink} linkProps={{ to: '/' }} title="T" external externalLabel="(ny fane)" />);
            // @ts-expect-error — `to` finnes ikke på en vanlig <a>.
            void (<Card href="/" title="T" linkProps={{ to: '/' }} />);
            // @ts-expect-error — href er påkrevd uten linkAs.
            void (<Card title="T" />);
        });
    });
});
