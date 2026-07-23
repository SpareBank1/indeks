import { afterEach, describe, expect, it, vi } from 'vitest';
import { IxProgressBar } from './IxProgressBar';
import { IxIcon } from '../icon/IxIcon';

if (!customElements.get('ix-icon')) {
    customElements.define('ix-icon', IxIcon);
}
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
    describe('struktur', () => {
        it('genererer track, fill, header og støttetekst', () => {
            const el = mount(`<ix-progress-bar value="25"></ix-progress-bar>`);
            expect(el.querySelector('.ix-progress-bar__track')).not.toBeNull();
            expect(el.querySelector('.ix-progress-bar__fill')).not.toBeNull();
            expect(el.querySelector('.ix-progress-bar__header')).not.toBeNull();
            expect(el.querySelector('.ix-progress-bar__support')).not.toBeNull();
        });

        it('støtteteksten er en stabil aria-live-region', () => {
            const el = mount(`<ix-progress-bar value="25"></ix-progress-bar>`);
            const support = el.querySelector('.ix-progress-bar__support')!;
            expect(support.getAttribute('role')).toBe('status');
            expect(support.getAttribute('aria-live')).toBe('polite');
            expect(support.getAttribute('aria-atomic')).toBe('false');
        });

        it('bygger ikke strukturen på nytt ved gjentatte oppdateringer', () => {
            const el = mount(`<ix-progress-bar value="25"></ix-progress-bar>`);
            const track = el.querySelector('.ix-progress-bar__track');
            el.setAttribute('value', '60');
            expect(el.querySelectorAll('.ix-progress-bar__track')).toHaveLength(1);
            expect(el.querySelector('.ix-progress-bar__track')).toBe(track);
        });
    });

    describe('klamping av value', () => {
        it('klamper negativ verdi til 0', () => {
            const el = mount(`<ix-progress-bar value="-5"></ix-progress-bar>`);
            expect(el.style.getPropertyValue('--ii-progress-bar-fill')).toBe('0%');
            expect(el.getAttribute('aria-valuenow')).toBe('0');
        });

        it('klamper verdi over 100 til 100', () => {
            const el = mount(`<ix-progress-bar value="150"></ix-progress-bar>`);
            expect(el.style.getPropertyValue('--ii-progress-bar-fill')).toBe('100%');
            expect(el.getAttribute('aria-valuenow')).toBe('100');
        });

        it('behandler ikke-numerisk verdi som 0', () => {
            const el = mount(`<ix-progress-bar value="abc"></ix-progress-bar>`);
            expect(el.style.getPropertyValue('--ii-progress-bar-fill')).toBe('0%');
            expect(el.getAttribute('aria-valuenow')).toBe('0');
        });

        it('avrunder aria-valuenow', () => {
            const el = mount(`<ix-progress-bar value="42.7"></ix-progress-bar>`);
            expect(el.getAttribute('aria-valuenow')).toBe('43');
        });
    });

    describe('active-tilstand', () => {
        it('eksponerer role=progressbar med aria-value*', () => {
            const el = mount(`<ix-progress-bar value="25"></ix-progress-bar>`);
            expect(el.getAttribute('role')).toBe('progressbar');
            expect(el.getAttribute('aria-valuemin')).toBe('0');
            expect(el.getAttribute('aria-valuemax')).toBe('100');
            expect(el.getAttribute('aria-valuenow')).toBe('25');
        });

        it('setter ikke data-status', () => {
            const el = mount(`<ix-progress-bar value="25"></ix-progress-bar>`);
            expect(el.hasAttribute('data-status')).toBe(false);
        });

        it('viser ingen statusikon', () => {
            const el = mount(`<ix-progress-bar value="25"></ix-progress-bar>`);
            expect(el.querySelector('ix-icon')).toBeNull();
        });

        it('kobler label via aria-labelledby', () => {
            const el = mount(`<ix-progress-bar value="25" label="Laster opp"></ix-progress-bar>`);
            const labelEl = el.querySelector('.ix-progress-bar__label')!;
            expect(labelEl.textContent).toBe('Laster opp');
            expect(el.getAttribute('aria-labelledby')).toBe(labelEl.id);
        });

        it('setter aria-valuetext fra data-value-text', () => {
            const el = mount(`<ix-progress-bar value="25" data-value-text="25 av 100"></ix-progress-bar>`);
            expect(el.getAttribute('aria-valuetext')).toBe('25 av 100');
        });

        it('viser prosent i header når data-show-value er satt', () => {
            const el = mount(`<ix-progress-bar value="25" data-show-value></ix-progress-bar>`);
            const value = el.querySelector('.ix-progress-bar__value')!;
            // Hardt mellomrom (U+00A0) foran %-tegnet.
            expect(value.textContent).toBe('25 %');
        });

        it('kobler støttetekst via aria-describedby', () => {
            const el = mount(`<ix-progress-bar value="25" data-support-text="Vent litt"></ix-progress-bar>`);
            const support = el.querySelector('.ix-progress-bar__support')!;
            expect(el.getAttribute('aria-describedby')).toBe(support.id);
            expect(support.textContent).toContain('Vent litt');
        });
    });

    describe('success-tilstand', () => {
        it('fjerner role og alle aria-value*', () => {
            const el = mount(`<ix-progress-bar value="100" data-state="success"></ix-progress-bar>`);
            expect(el.hasAttribute('role')).toBe(false);
            expect(el.hasAttribute('aria-valuenow')).toBe(false);
            expect(el.hasAttribute('aria-valuemin')).toBe(false);
            expect(el.hasAttribute('aria-valuemax')).toBe(false);
        });

        it('setter data-status=success', () => {
            const el = mount(`<ix-progress-bar value="100" data-state="success"></ix-progress-bar>`);
            expect(el.getAttribute('data-status')).toBe('success');
        });

        it('viser check-ikon som badge', () => {
            const el = mount(`<ix-progress-bar value="100" data-state="success"></ix-progress-bar>`);
            const icon = el.querySelector('ix-icon')!;
            expect(icon).not.toBeNull();
            expect(icon.getAttribute('name')).toBe('check');
            expect(icon.hasAttribute('data-badge')).toBe(true);
            expect(icon.getAttribute('aria-hidden')).toBe('true');
        });

        it('fyller baren til 100 %', () => {
            const el = mount(`<ix-progress-bar value="40" data-state="success"></ix-progress-bar>`);
            expect(el.style.getPropertyValue('--ii-progress-bar-fill')).toBe('100%');
        });
    });

    describe('error-tilstand', () => {
        it('fjerner role og setter data-status=danger', () => {
            const el = mount(`<ix-progress-bar value="60" data-state="error"></ix-progress-bar>`);
            expect(el.hasAttribute('role')).toBe(false);
            expect(el.getAttribute('data-status')).toBe('danger');
        });

        it('viser priority_high-ikon', () => {
            const el = mount(`<ix-progress-bar value="60" data-state="error"></ix-progress-bar>`);
            expect(el.querySelector('ix-icon')!.getAttribute('name')).toBe('priority_high');
        });

        it('beholder klampet fyllgrad', () => {
            const el = mount(`<ix-progress-bar value="60" data-state="error"></ix-progress-bar>`);
            expect(el.style.getPropertyValue('--ii-progress-bar-fill')).toBe('60%');
        });
    });

    describe('overgang mellom tilstander', () => {
        it('går fra active til success: bytter role, ikon og status', () => {
            const el = mount(`<ix-progress-bar value="80"></ix-progress-bar>`);
            expect(el.getAttribute('role')).toBe('progressbar');
            expect(el.querySelector('ix-icon')).toBeNull();

            el.setAttribute('data-state', 'success');
            expect(el.hasAttribute('role')).toBe(false);
            expect(el.getAttribute('data-status')).toBe('success');
            expect(el.querySelector('ix-icon')!.getAttribute('name')).toBe('check');
        });

        it('går tilbake til active: gjenoppretter role og fjerner ikon', () => {
            const el = mount(`<ix-progress-bar value="80" data-state="error"></ix-progress-bar>`);
            el.setAttribute('data-state', 'active');
            expect(el.getAttribute('role')).toBe('progressbar');
            expect(el.hasAttribute('data-status')).toBe(false);
            expect(el.querySelector('ix-icon')).toBeNull();
        });
    });

    describe('ikke-interaktiv', () => {
        it('setter aldri tabindex', () => {
            const el = mount(`<ix-progress-bar value="25"></ix-progress-bar>`);
            expect(el.hasAttribute('tabindex')).toBe(false);
        });
    });

    describe('cleanup og remount', () => {
        it('bygger strukturen på nytt etter remount', () => {
            const el = mount(`<ix-progress-bar value="25"></ix-progress-bar>`);
            el.remove();
            document.body.appendChild(el);
            expect(el.querySelectorAll('.ix-progress-bar__track')).toHaveLength(1);
            expect(el.getAttribute('aria-valuenow')).toBe('25');
        });
    });

    describe('A1 — tilgjengelig navn i active', () => {
        it('advarer når active mangler tilgjengelig navn', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            mount(`<ix-progress-bar value="40"></ix-progress-bar>`);
            expect(warn).toHaveBeenCalledWith(expect.stringContaining('Mangler tilgjengelig navn'));
            warn.mockRestore();
        });

        it('advarer ikke når label er satt', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            mount(`<ix-progress-bar value="40" label="Laster opp"></ix-progress-bar>`);
            expect(warn).not.toHaveBeenCalled();
            warn.mockRestore();
        });

        it('advarer ikke når aria-label er satt', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            mount(`<ix-progress-bar value="40" aria-label="Laster opp"></ix-progress-bar>`);
            expect(warn).not.toHaveBeenCalled();
            warn.mockRestore();
        });
    });

    describe('A2 — iOS-workaround', () => {
        function stubUserAgent(ua: string) {
            return vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(ua);
        }

        it('bruker role=img og baker prosent inn i aria-label på iOS', () => {
            const spy = stubUserAgent(
                'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
            );
            const el = mount(`<ix-progress-bar value="25" label="Laster opp"></ix-progress-bar>`);
            expect(el.getAttribute('role')).toBe('img');
            // Hardt mellomrom (U+00A0) foran %-tegnet, som i header-verdien.
            expect(el.getAttribute('aria-label')).toBe('Laster opp, 25 %');
            expect(el.hasAttribute('aria-valuenow')).toBe(false);
            expect(el.hasAttribute('aria-labelledby')).toBe(false);
            spy.mockRestore();
        });

        it('foretrekker valueText i iOS-label', () => {
            const spy = stubUserAgent(
                'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
            );
            const el = mount(
                `<ix-progress-bar value="25" label="Laster opp" data-value-text="25 av 100"></ix-progress-bar>`,
            );
            expect(el.getAttribute('aria-label')).toBe('Laster opp, 25 av 100');
            spy.mockRestore();
        });

        it('beholder aria-describedby for støttetekst på iOS', () => {
            const spy = stubUserAgent(
                'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
            );
            const el = mount(
                `<ix-progress-bar value="25" label="Laster opp" data-support-text="Vent litt"></ix-progress-bar>`,
            );
            const support = el.querySelector('.ix-progress-bar__support')!;
            expect(el.getAttribute('aria-describedby')).toBe(support.id);
            spy.mockRestore();
        });

        it('beholder role=progressbar på ikke-iOS', () => {
            const spy = stubUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
            );
            const el = mount(`<ix-progress-bar value="25" label="Laster opp"></ix-progress-bar>`);
            expect(el.getAttribute('role')).toBe('progressbar');
            expect(el.getAttribute('aria-valuenow')).toBe('25');
            expect(el.hasAttribute('aria-label')).toBe(false);
            spy.mockRestore();
        });
    });

    describe('A5 — stille fullføring', () => {
        it('advarer ved success uten støttetekst', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            mount(`<ix-progress-bar value="100" data-state="success" label="Ferdig"></ix-progress-bar>`);
            expect(warn).toHaveBeenCalledWith(expect.stringContaining('annonseres ikke for skjermleser'));
            warn.mockRestore();
        });

        it('advarer ikke når success har støttetekst', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            mount(
                `<ix-progress-bar value="100" data-state="success" label="Ferdig" data-support-text="Alt lastet opp"></ix-progress-bar>`,
            );
            expect(warn).not.toHaveBeenCalled();
            warn.mockRestore();
        });
    });
});
