import { afterEach, describe, expect, it } from 'vitest';
import { IxProgressBar } from './IxProgressBar';

if (!customElements.get('ix-progress-bar')) {
    customElements.define('ix-progress-bar', IxProgressBar);
}

function mount(html: string): IxProgressBar {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
    return wrapper.querySelector('ix-progress-bar')!;
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('IxProgressBar', () => {
    describe('DOM-generering', () => {
        it('bygger header, track, fill, support-text og announcer', () => {
            const el = mount(`<ix-progress-bar value="50" data-state="active"></ix-progress-bar>`);
            expect(el.querySelector('.ix-progress-bar__header')).not.toBeNull();
            expect(el.querySelector('.ix-progress-bar__label')).not.toBeNull();
            expect(el.querySelector('.ix-progress-bar__track')).not.toBeNull();
            expect(el.querySelector('.ix-progress-bar__fill')).not.toBeNull();
            expect(el.querySelector('.ix-progress-bar__support-text')).not.toBeNull();
            expect(el.querySelector('[aria-live="polite"]')).not.toBeNull();
        });

        it('erstatter forfatters indre HTML med generert struktur', () => {
            const el = mount(
                `<ix-progress-bar value="50" data-state="active"><p id="author-content">test</p></ix-progress-bar>`,
            );
            expect(el.querySelector('#author-content')).toBeNull();
            expect(el.querySelector('.ix-progress-bar__track')).not.toBeNull();
        });
    });

    describe('Header-synlighet', () => {
        it('skjuler header når label mangler og tilstand er active', () => {
            const el = mount(`<ix-progress-bar value="50" data-state="active"></ix-progress-bar>`);
            expect(el.querySelector<HTMLElement>('.ix-progress-bar__header')?.hidden).toBe(true);
        });

        it('viser header når label er satt', () => {
            const el = mount(
                `<ix-progress-bar value="50" data-state="active" label="Laster opp"></ix-progress-bar>`,
            );
            expect(el.querySelector<HTMLElement>('.ix-progress-bar__header')?.hidden).toBe(false);
        });

        it('viser header i success selv uten label (pga ikon)', () => {
            const el = mount(`<ix-progress-bar value="100" data-state="success"></ix-progress-bar>`);
            expect(el.querySelector<HTMLElement>('.ix-progress-bar__header')?.hidden).toBe(false);
        });

        it('viser header i error selv uten label (pga ikon)', () => {
            const el = mount(`<ix-progress-bar value="50" data-state="error"></ix-progress-bar>`);
            expect(el.querySelector<HTMLElement>('.ix-progress-bar__header')?.hidden).toBe(false);
        });
    });

    describe('ARIA i active-tilstand', () => {
        it('setter role=progressbar, valuemin, valuemax og valuenow på host', () => {
            const el = mount(`<ix-progress-bar value="40" data-state="active"></ix-progress-bar>`);
            expect(el.getAttribute('role')).toBe('progressbar');
            expect(el.getAttribute('aria-valuemin')).toBe('0');
            expect(el.getAttribute('aria-valuemax')).toBe('100');
            expect(el.getAttribute('aria-valuenow')).toBe('40');
        });

        it('setter aria-hidden på track', () => {
            const el = mount(`<ix-progress-bar value="40" data-state="active"></ix-progress-bar>`);
            const track = el.querySelector('.ix-progress-bar__track')!;
            expect(track.getAttribute('aria-hidden')).toBe('true');
        });

        it('setter --ix-progress-bar-value CSS custom property på track', () => {
            const el = mount(`<ix-progress-bar value="65" data-state="active"></ix-progress-bar>`);
            const track = el.querySelector<HTMLElement>('.ix-progress-bar__track')!;
            expect(track.style.getPropertyValue('--ix-progress-bar-value')).toBe('65%');
        });

        it('setter --ix-progress-bar-value ved initial render med data-state="error"', () => {
            const el = mount(`<ix-progress-bar value="40" data-state="error"></ix-progress-bar>`);
            const track = el.querySelector<HTMLElement>('.ix-progress-bar__track')!;
            expect(track.style.getPropertyValue('--ix-progress-bar-value')).toBe('40%');
        });
    });

    describe('ARIA i terminal-tilstand (success/error)', () => {
        it('fjerner progressbar-rolle og aria-value* fra host i success', () => {
            const el = mount(`<ix-progress-bar value="100" data-state="success"></ix-progress-bar>`);
            expect(el.hasAttribute('role')).toBe(false);
            expect(el.hasAttribute('aria-valuemin')).toBe(false);
            expect(el.hasAttribute('aria-valuemax')).toBe(false);
            expect(el.hasAttribute('aria-valuenow')).toBe(false);
        });

        it('setter aria-hidden på track i success', () => {
            const el = mount(`<ix-progress-bar value="100" data-state="success"></ix-progress-bar>`);
            const track = el.querySelector('.ix-progress-bar__track')!;
            expect(track.getAttribute('aria-hidden')).toBe('true');
        });

        it('fjerner progressbar-rolle og aria-value* fra host i error', () => {
            const el = mount(`<ix-progress-bar value="50" data-state="error"></ix-progress-bar>`);
            expect(el.hasAttribute('role')).toBe(false);
            expect(el.hasAttribute('aria-valuenow')).toBe(false);
        });

        it('setter aria-hidden på track i error', () => {
            const el = mount(`<ix-progress-bar value="50" data-state="error"></ix-progress-bar>`);
            const track = el.querySelector('.ix-progress-bar__track')!;
            expect(track.getAttribute('aria-hidden')).toBe('true');
        });
    });

    describe('Verdi-clamping', () => {
        it('clammer verdi over 100 til 100', () => {
            const el = mount(`<ix-progress-bar value="150" data-state="active"></ix-progress-bar>`);
            expect(el.getAttribute('aria-valuenow')).toBe('100');
        });

        it('clammer verdi under 0 til 0', () => {
            const el = mount(`<ix-progress-bar value="-10" data-state="active"></ix-progress-bar>`);
            expect(el.getAttribute('aria-valuenow')).toBe('0');
        });

        it('behandler ugyldig verdi som 0', () => {
            const el = mount(`<ix-progress-bar value="abc" data-state="active"></ix-progress-bar>`);
            expect(el.getAttribute('aria-valuenow')).toBe('0');
        });
    });

    describe('Label-kobling', () => {
        it('setter label-tekst i label-elementet', () => {
            const el = mount(
                `<ix-progress-bar value="50" data-state="active" label="Laster opp"></ix-progress-bar>`,
            );
            const label = el.querySelector<HTMLElement>('.ix-progress-bar__label')!;
            expect(label.textContent).toBe('Laster opp');
        });

        it('genererer ID på label og setter aria-labelledby på host', () => {
            const el = mount(
                `<ix-progress-bar value="50" data-state="active" label="Laster opp"></ix-progress-bar>`,
            );
            const label = el.querySelector<HTMLElement>('.ix-progress-bar__label')!;
            expect(label.id).toMatch(/^ix-progress-bar-label-\d+$/);
            expect(el.getAttribute('aria-labelledby')).toBe(label.id);
        });

        it('fjerner aria-labelledby fra host når label mangler', () => {
            const el = mount(`<ix-progress-bar value="50" data-state="active"></ix-progress-bar>`);
            expect(el.hasAttribute('aria-labelledby')).toBe(false);
        });

        it('gjenbruker eksisterende ID på label-element ved attributtendring', () => {
            const el = mount(
                `<ix-progress-bar value="50" data-state="active" label="Laster opp"></ix-progress-bar>`,
            );
            const label = el.querySelector<HTMLElement>('.ix-progress-bar__label')!;
            const firstId = label.id;
            el.setAttribute('label', 'Ny tekst');
            expect(label.id).toBe(firstId);
        });
    });

    describe('data-support-text', () => {
        it('setter støttetekst i support-text-elementet', () => {
            const el = mount(
                `<ix-progress-bar value="50" data-state="active" data-support-text="50 % fullført"></ix-progress-bar>`,
            );
            const supportText = el.querySelector('.ix-progress-bar__support-text')!;
            expect(supportText.textContent).toBe('50 % fullført');
        });
    });

    describe('Ikoninjeksjon', () => {
        it('injiserer ikon i header ved success', () => {
            const el = mount(`<ix-progress-bar value="100" data-state="success"></ix-progress-bar>`);
            const icon = el.querySelector('[data-progress-bar="icon"]');
            expect(icon).not.toBeNull();
            expect(icon?.getAttribute('aria-hidden')).toBe('true');
        });

        it('injiserer ikon i header ved error', () => {
            const el = mount(`<ix-progress-bar value="50" data-state="error"></ix-progress-bar>`);
            const icon = el.querySelector('[data-progress-bar="icon"]');
            expect(icon).not.toBeNull();
        });

        it('viser ikke ikon i active', () => {
            const el = mount(`<ix-progress-bar value="50" data-state="active"></ix-progress-bar>`);
            expect(el.querySelector('[data-progress-bar="icon"]')).toBeNull();
        });

        it('fjerner ikon når data-state endres tilbake til active', () => {
            const el = mount(`<ix-progress-bar value="100" data-state="success"></ix-progress-bar>`);
            expect(el.querySelector('[data-progress-bar="icon"]')).not.toBeNull();
            el.setAttribute('data-state', 'active');
            expect(el.querySelector('[data-progress-bar="icon"]')).toBeNull();
        });
    });

    describe('aria-live annonsering', () => {
        it('injiserer skjult aria-live-element med aria-atomic', () => {
            const el = mount(`<ix-progress-bar value="50" data-state="active"></ix-progress-bar>`);
            const announcer = el.querySelector('[aria-live="polite"]');
            expect(announcer).not.toBeNull();
            expect(announcer?.getAttribute('aria-atomic')).toBe('true');
        });

        it('fyller announcer med data-support-text ved success', () => {
            const el = mount(
                `<ix-progress-bar value="100" data-state="success" data-support-text="Alle filer er lastet opp"></ix-progress-bar>`,
            );
            const announcer = el.querySelector('[aria-live="polite"]')!;
            expect(announcer.textContent).toBe('Alle filer er lastet opp');
        });

        it('bruker fallback-tekst «Fullført» ved success uten support-text', () => {
            const el = mount(`<ix-progress-bar value="100" data-state="success"></ix-progress-bar>`);
            const announcer = el.querySelector('[aria-live="polite"]')!;
            expect(announcer.textContent).toBe('Fullført');
        });

        it('bruker fallback-tekst «Feilet» ved error uten support-text', () => {
            const el = mount(`<ix-progress-bar value="50" data-state="error"></ix-progress-bar>`);
            const announcer = el.querySelector('[aria-live="polite"]')!;
            expect(announcer.textContent).toBe('Feilet');
        });
    });

    describe('attributeChangedCallback', () => {
        it('oppdaterer aria-valuenow på host når value-attributt endres', () => {
            const el = mount(`<ix-progress-bar value="30" data-state="active"></ix-progress-bar>`);
            expect(el.getAttribute('aria-valuenow')).toBe('30');
            el.setAttribute('value', '75');
            expect(el.getAttribute('aria-valuenow')).toBe('75');
        });

        it('bytter til terminal-modus når data-state endres til success', () => {
            const el = mount(`<ix-progress-bar value="100" data-state="active"></ix-progress-bar>`);
            expect(el.getAttribute('role')).toBe('progressbar');
            el.setAttribute('data-state', 'success');
            expect(el.hasAttribute('role')).toBe(false);
            expect(el.querySelector('.ix-progress-bar__track')?.getAttribute('aria-hidden')).toBe('true');
        });

        it('bytter tilbake til active-modus når data-state endres fra success til active', () => {
            const el = mount(`<ix-progress-bar value="100" data-state="success"></ix-progress-bar>`);
            expect(el.hasAttribute('role')).toBe(false);
            el.setAttribute('data-state', 'active');
            expect(el.getAttribute('role')).toBe('progressbar');
        });
    });

    describe('cleanup', () => {
        it('nullstiller interne referanser i disconnectedCallback', () => {
            const el = mount(`<ix-progress-bar value="50" data-state="active"></ix-progress-bar>`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tilgang til privat felt for å teste cleanup
            expect((el as any)._announcer).not.toBeNull();
            el.remove();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tilgang til privat felt for å teste cleanup
            expect((el as any)._announcer).toBeNull();
        });
    });
});
