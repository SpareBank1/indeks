import { fireEvent, render, screen } from '@testing-library/react';
import { createRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Row } from './Row';

function RouterLink(props: { to: string; className?: string; children?: ReactNode }) {
    return (
        <a href={props.to} className={props.className} data-router="">
            {props.children}
        </a>
    );
}

describe('Row', () => {
    it('rendrer en passiv rad uten lenke eller knapp', () => {
        const { container } = render(<Row title="Brukskonto" subtitle="1234.56.78901" />);
        const row = container.firstElementChild!;
        expect(row.className).toBe('ix-row');
        expect(row.querySelector('.ix-row__title')!.tagName).toBe('P');
        expect(screen.getByText('1234.56.78901').className).toBe('ix-row__subtitle');
        expect(screen.queryByRole('link')).toBeNull();
        expect(screen.queryByRole('button')).toBeNull();
        expect(row.querySelector('.ix-row__nav-icon')).toBeNull();
    });

    it('legger innhold og Trailing i __body, og kontroll og navigasjonsikon utenfor', () => {
        const { container } = render(
            <Row
                title="Brukskonto"
                trailing={<Row.TrailingLabel label="12 345,00 kr" />}
                trailingControl={undefined}
                href="/konto"
                navigation="internal"
            />
        );
        const body = container.querySelector('.ix-row > .ix-row__body')!;
        expect([...body.children].map((c) => c.className)).toEqual(['ix-row__content', 'ix-row__trailing']);
        expect(container.querySelector('.ix-row > .ix-row__nav-icon')).not.toBeNull();
        const passiv = render(<Row title="Fast trekk" trailingControl={<button type="button">Legg til</button>} />);
        expect(passiv.container.querySelector('.ix-row > .ix-row__control')).not.toBeNull();
    });

    it('utelater områder som ikke er i bruk', () => {
        const { container } = render(<Row title="Brukskonto" />);
        expect(container.querySelector('.ix-row__subtitle')).toBeNull();
        expect(container.querySelector('.ix-row__description')).toBeNull();
        expect(container.querySelector('.ix-row__leading')).toBeNull();
        expect(container.querySelector('.ix-row__trailing')).toBeNull();
    });

    it('gjør tittelen til lenke med href, og lenken er eneste interaktive mål', () => {
        render(<Row title="Brukskonto" href="/konto/1" navigation="internal" />);
        const link = screen.getByRole('link', { name: 'Brukskonto' });
        expect(link.getAttribute('href')).toBe('/konto/1');
        expect(link.className).toBe('ix-row__action');
        expect(link.hasAttribute('target')).toBe(false);
        expect(screen.getAllByRole('link')).toHaveLength(1);
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('sender linkProps til lenken uten å overstyre className og href', () => {
        render(<Row title="Brukskonto" href="/konto/1" linkProps={{ 'aria-describedby': 'saldo', hrefLang: 'nb' }} />);
        const link = screen.getByRole('link');
        expect(link.getAttribute('aria-describedby')).toBe('saldo');
        expect(link.getAttribute('hreflang')).toBe('nb');
        expect(link.className).toBe('ix-row__action');
        expect(link.getAttribute('href')).toBe('/konto/1');
        // @ts-expect-error: className styres av komponenten
        render(<Row title="X" href="/x" linkProps={{ className: 'feil' }} />);
    });

    it('viser chevron for intern navigasjon og skjuler ikonet for hjelpemidler', () => {
        const { container } = render(<Row title="Brukskonto" href="/konto/1" navigation="internal" />);
        const icon = container.querySelector('.ix-row__nav-icon')!;
        expect(icon.getAttribute('name')).toBe('keyboard_arrow_right');
        expect(icon.getAttribute('aria-hidden')).toBe('true');
    });

    it('legger skjult tekst til lenkenavnet og åpner i ny fane ved ekstern navigasjon', () => {
        const { container } = render(
            <Row title="Skatteetaten" href="https://skatteetaten.no" navigation="external" externalLabel="(åpnes i ny fane)" />
        );
        const link = screen.getByRole('link', { name: 'Skatteetaten (åpnes i ny fane)' });
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
        expect(container.querySelector('.ix-row__nav-icon')!.getAttribute('name')).toBe('open_in_new');
    });

    it('bruker linkAs og linkProps for router-lenker, uten href', () => {
        render(<Row title="Kort" linkAs={RouterLink} linkProps={{ to: '/kort' }} navigation="internal" />);
        const link = screen.getByRole('link', { name: 'Kort' });
        expect(link.getAttribute('href')).toBe('/kort');
        expect(link.className).toBe('ix-row__action');
        expect(link.hasAttribute('data-router')).toBe(true);
    });

    it('typesjekker linkProps mot router-lenken', () => {
        // @ts-expect-error: RouterLink krever to
        render(<Row title="Kort" linkAs={RouterLink} />);
        // @ts-expect-error: skrivefeil i linkProps
        render(<Row title="Kort" linkAs={RouterLink} linkProps={{ too: '/kort' }} />);
        // @ts-expect-error: ekstern navigasjon kan ikke kombineres med linkAs
        render(<Row title="Kort" linkAs={RouterLink} linkProps={{ to: '/kort' }} navigation="external" externalLabel="(ny fane)" />);
    });

    it('gjør tittelen til knapp med onClick', () => {
        const onClick = vi.fn();
        render(<Row title="Innstillinger" onClick={onClick} />);
        const button = screen.getByRole('button', { name: 'Innstillinger' });
        expect(button.getAttribute('type')).toBe('button');
        expect(button.className).toBe('ix-row__action');
        fireEvent.click(button);
        expect(onClick).toHaveBeenCalledOnce();
        expect(screen.queryByRole('link')).toBeNull();
    });

    it('sender buttonProps til knappen, men ikke disabled', () => {
        render(<Row title="Innstillinger" onClick={() => {}} buttonProps={{ 'aria-haspopup': 'dialog' }} />);
        expect(screen.getByRole('button').getAttribute('aria-haspopup')).toBe('dialog');
        // @ts-expect-error: Figma har ingen deaktivert rad
        render(<Row title="X" onClick={() => {}} buttonProps={{ disabled: true }} />);
    });

    it('viser ikke navigasjonsikon når navigation er utelatt', () => {
        const { container } = render(<Row title="Innstillinger" onClick={() => {}} />);
        expect(container.querySelector('.ix-row__nav-icon')).toBeNull();
    });

    it('rendrer trailingControl i en passiv rad', () => {
        const { container } = render(
            <Row title="Varsler på SMS" trailingControl={<button type="button">Endre</button>} />
        );
        expect(container.querySelector('.ix-row__control')!.textContent).toBe('Endre');
        expect(container.querySelector('.ix-row__trailing')).toBeNull();
        expect(container.querySelector('.ix-row__action')).toBeNull();
    });

    it('setter titleId på tittelen, så en kontroll kan vise til raden', () => {
        render(
            <Row
                title="Fast trekk"
                titleId="fast-trekk"
                trailingControl={
                    <button type="button" aria-describedby="fast-trekk">
                        Legg til
                    </button>
                }
            />
        );
        expect(screen.getByRole('button', { name: 'Legg til', description: 'Fast trekk' })).toBeTruthy();
    });

    it('setter titleAs på tittelen', () => {
        const { container } = render(<Row title="Brukskonto" titleAs="h3" href="/konto" />);
        const title = container.querySelector('.ix-row__title')!;
        expect(title.tagName).toBe('H3');
        expect(title.querySelector('a')).not.toBeNull();
    });

    it('sender ref til roten', () => {
        const ref = createRef<HTMLDivElement>();
        render(<Row ref={ref} title="Brukskonto" />);
        expect(ref.current?.className).toBe('ix-row');
    });

    it('slår sammen className og sender native attributter til roten', () => {
        const { container } = render(<Row title="Brukskonto" className="egen" data-testid="rad" />);
        const row = container.firstElementChild!;
        expect(row.className).toBe('ix-row egen');
        expect(row.getAttribute('data-testid')).toBe('rad');
    });

    // Kontrollene her skjer i typesjekken (tsc), ikke i vitest.
    it('typesjekker ikke kombinasjoner som gir flere interaktive mål', () => {
        // @ts-expect-error: href og trailingControl
        render(<Row title="X" href="/x" trailingControl={<button type="button">Y</button>} />);
        // @ts-expect-error: onClick og trailingControl
        render(<Row title="X" onClick={() => {}} trailingControl={<button type="button">Y</button>} />);
        // @ts-expect-error: href og onClick
        render(<Row title="X" href="/x" onClick={() => {}} />);
    });

    it('typesjekker ikke ugyldig navigasjon', () => {
        // @ts-expect-error: ekstern navigasjon krever externalLabel
        render(<Row title="X" href="/x" navigation="external" />);
        // @ts-expect-error: ekstern navigasjon på en knapp
        render(<Row title="X" onClick={() => {}} navigation="external" externalLabel="(ny fane)" />);
        // @ts-expect-error: navigasjonsikon uten interaktiv rad
        render(<Row title="X" navigation="internal" />);
    });
});

describe('Row.Leading', () => {
    it('rendrer ikon med data-variant og skjuler det for hjelpemidler', () => {
        const { container } = render(<Row.Leading variant="icon" icon="account_balance" />);
        const leading = container.firstElementChild!;
        expect(leading.className).toBe('ix-row__leading');
        expect(leading.getAttribute('data-variant')).toBe('icon');
        expect(leading.querySelector('ix-icon')!.getAttribute('aria-hidden')).toBe('true');
    });

    it('rendrer badge-ikon for icon-background', () => {
        const { container } = render(
            <Row.Leading variant="icon-background" icon="account_balance" badgeIcon="group" />
        );
        expect(container.querySelector('.ix-row__leading-badge ix-icon')!.getAttribute('name')).toBe('group');
        expect(container.querySelector('.ix-row__leading-badge ix-icon')!.getAttribute('aria-hidden')).toBe('true');
    });

    it('rendrer ikke badge uten badgeIcon, og typesjekker ikke badge på andre varianter', () => {
        const { container } = render(<Row.Leading variant="icon-background" icon="account_balance" />);
        expect(container.querySelector('.ix-row__leading-badge')).toBeNull();
        // @ts-expect-error: badge finnes bare på icon-background
        render(<Row.Leading variant="icon" icon="account_balance" badgeIcon="group" />);
    });

    it('rendrer dekorativ illustrasjon med tom alt', () => {
        const { container } = render(<Row.Leading variant="illustration" src="/hus.svg" alt="" />);
        const img = container.querySelector('img')!;
        expect(img.getAttribute('alt')).toBe('');
        expect(container.firstElementChild!.getAttribute('data-variant')).toBe('illustration');
        expect(screen.queryByRole('img')).toBeNull();
    });

    it('rendrer bilde med alt', () => {
        render(<Row.Leading variant="image" src="/kari.jpg" alt="Kari Nordmann" />);
        expect(screen.getByRole('img', { name: 'Kari Nordmann' }).getAttribute('src')).toBe('/kari.jpg');
    });
});

describe('Row.TrailingLabel', () => {
    it('rendrer label og subtitle', () => {
        const { container } = render(<Row.TrailingLabel label="12 345,00 kr" subtitle="Disponibelt" />);
        expect(container.querySelector('.ix-row__trailing-label')!.textContent).toBe('12 345,00 kr');
        expect(container.querySelector('.ix-row__trailing-subtitle')!.textContent).toBe('Disponibelt');
    });

    it('rendrer label og tag, uten subtitle', () => {
        const { container } = render(<Row.TrailingLabel label="1 240,00 kr" tag={<span className="ix-tag">Til godkjenning</span>} />);
        expect(container.querySelector('.ix-row__trailing-label')!.textContent).toBe('1 240,00 kr');
        expect(container.querySelector('.ix-tag')!.textContent).toBe('Til godkjenning');
        expect(container.querySelector('.ix-row__trailing-subtitle')).toBeNull();
    });
});
