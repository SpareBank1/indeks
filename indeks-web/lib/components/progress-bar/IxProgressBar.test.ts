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
    describe('Label-kobling', () => {
        it('setter label[for] til progress[id]', () => {
            const el = mount(`
                <ix-progress-bar>
                    <label>Laster opp</label>
                    <progress value="65" max="100"></progress>
                </ix-progress-bar>
            `);
            const label = el.querySelector('label')!;
            const progress = el.querySelector('progress')!;
            expect(progress.id).toMatch(/^ix-pb-\d+$/);
            expect(label.htmlFor).toBe(progress.id);
        });

        it('gjenbruker eksisterende id på progress', () => {
            const el = mount(`
                <ix-progress-bar>
                    <label>Laster opp</label>
                    <progress id="my-progress" value="65" max="100"></progress>
                </ix-progress-bar>
            `);
            expect(el.querySelector('label')!.htmlFor).toBe('my-progress');
        });

        it('setter ingen label[for] når label mangler', () => {
            const el = mount(`
                <ix-progress-bar aria-label="Laster inn">
                    <progress value="30" max="100"></progress>
                </ix-progress-bar>
            `);
            expect(el.querySelector('label')).toBeNull();
        });
    });

    describe('aria-label videreføring', () => {
        it('kopierer aria-label fra host til progress når label mangler', () => {
            const el = mount(`
                <ix-progress-bar aria-label="Laster inn innhold">
                    <progress value="30" max="100"></progress>
                </ix-progress-bar>
            `);
            expect(el.querySelector('progress')?.getAttribute('aria-label')).toBe('Laster inn innhold');
        });

        it('oppdaterer aria-label på progress ved attributtendring', () => {
            const el = mount(`
                <ix-progress-bar aria-label="Gammel tekst">
                    <progress value="30" max="100"></progress>
                </ix-progress-bar>
            `);
            el.setAttribute('aria-label', 'Ny tekst');
            expect(el.querySelector('progress')?.getAttribute('aria-label')).toBe('Ny tekst');
        });

        it('kopierer ikke aria-label når synlig label finnes', () => {
            const el = mount(`
                <ix-progress-bar aria-label="Ignorert">
                    <label>Synlig label</label>
                    <progress value="30" max="100"></progress>
                </ix-progress-bar>
            `);
            expect(el.querySelector('progress')?.hasAttribute('aria-label')).toBe(false);
        });
    });

    describe('Prosentvisning', () => {
        it('injiserer __percent-span', () => {
            const el = mount(`
                <ix-progress-bar>
                    <label>Laster opp</label>
                    <progress value="65" max="100"></progress>
                </ix-progress-bar>
            `);
            expect(el.querySelector('.ix-progress-bar__percent')).not.toBeNull();
        });

        it('viser korrekt prosent basert på value og max', () => {
            const el = mount(`
                <ix-progress-bar>
                    <label>Laster opp</label>
                    <progress value="65" max="100"></progress>
                </ix-progress-bar>
            `);
            expect(el.querySelector('.ix-progress-bar__percent')?.textContent).toBe('65 %');
        });

        it('oppdaterer prosent når progress value-attributt endres', async () => {
            const el = mount(`
                <ix-progress-bar>
                    <label>Laster opp</label>
                    <progress value="40" max="100"></progress>
                </ix-progress-bar>
            `);
            el.querySelector('progress')!.setAttribute('value', '80');
            await Promise.resolve();
            expect(el.querySelector('.ix-progress-bar__percent')?.textContent).toBe('80 %');
        });

        it('skjuler prosent i success-tilstand', () => {
            const el = mount(`
                <ix-progress-bar state="success">
                    <label>Laster opp</label>
                    <progress value="100" max="100"></progress>
                </ix-progress-bar>
            `);
            expect(el.querySelector<HTMLElement>('.ix-progress-bar__percent')!.hidden).toBe(true);
        });

        it('skjuler prosent i error-tilstand', () => {
            const el = mount(`
                <ix-progress-bar state="error">
                    <label>Laster opp</label>
                    <progress value="40" max="100"></progress>
                </ix-progress-bar>
            `);
            expect(el.querySelector<HTMLElement>('.ix-progress-bar__percent')!.hidden).toBe(true);
        });
    });

    describe('aria-hidden på progress ved terminal-tilstand', () => {
        it('setter ikke aria-hidden på progress uten state-attributt', () => {
            const el = mount(`
                <ix-progress-bar>
                    <progress value="65" max="100"></progress>
                </ix-progress-bar>
            `);
            expect(el.querySelector('progress')?.hasAttribute('aria-hidden')).toBe(false);
        });

        it('setter aria-hidden="true" på progress i success', () => {
            const el = mount(`
                <ix-progress-bar state="success">
                    <progress value="100" max="100"></progress>
                </ix-progress-bar>
            `);
            expect(el.querySelector('progress')?.getAttribute('aria-hidden')).toBe('true');
        });

        it('setter aria-hidden="true" på progress i error', () => {
            const el = mount(`
                <ix-progress-bar state="error">
                    <progress value="40" max="100"></progress>
                </ix-progress-bar>
            `);
            expect(el.querySelector('progress')?.getAttribute('aria-hidden')).toBe('true');
        });

        it('fjerner aria-hidden fra progress når state endres til active', () => {
            const el = mount(`
                <ix-progress-bar state="success">
                    <progress value="100" max="100"></progress>
                </ix-progress-bar>
            `);
            el.setAttribute('state', 'active');
            expect(el.querySelector('progress')?.hasAttribute('aria-hidden')).toBe(false);
        });
    });

    describe('Ikoninjeksjon', () => {
        it('injiserer ikon ved success', () => {
            const el = mount(`
                <ix-progress-bar state="success">
                    <label>Laster opp</label>
                    <progress value="100" max="100"></progress>
                </ix-progress-bar>
            `);
            expect(el.querySelector('[data-progress-bar="icon"]')).not.toBeNull();
        });

        it('injiserer ikon ved error', () => {
            const el = mount(`
                <ix-progress-bar state="error">
                    <label>Laster opp</label>
                    <progress value="40" max="100"></progress>
                </ix-progress-bar>
            `);
            expect(el.querySelector('[data-progress-bar="icon"]')).not.toBeNull();
        });

        it('viser ikke ikon uten state-attributt', () => {
            const el = mount(`
                <ix-progress-bar>
                    <label>Laster opp</label>
                    <progress value="65" max="100"></progress>
                </ix-progress-bar>
            `);
            expect(el.querySelector('[data-progress-bar="icon"]')).toBeNull();
        });

        it('fjerner ikon når state endres tilbake til active', () => {
            const el = mount(`
                <ix-progress-bar state="success">
                    <label>Laster opp</label>
                    <progress value="100" max="100"></progress>
                </ix-progress-bar>
            `);
            el.setAttribute('state', 'active');
            expect(el.querySelector('[data-progress-bar="icon"]')).toBeNull();
        });

        it('ikon har aria-hidden="true"', () => {
            const el = mount(`
                <ix-progress-bar state="success">
                    <label>Laster opp</label>
                    <progress value="100" max="100"></progress>
                </ix-progress-bar>
            `);
            expect(el.querySelector('[data-progress-bar="icon"]')?.getAttribute('aria-hidden')).toBe('true');
        });
    });

    describe('aria-live annonsering', () => {
        it('injiserer skjult aria-live-element med aria-atomic', () => {
            const el = mount(`
                <ix-progress-bar>
                    <progress value="65" max="100"></progress>
                </ix-progress-bar>
            `);
            const announcer = el.querySelector('[aria-live="polite"]');
            expect(announcer).not.toBeNull();
            expect(announcer?.getAttribute('aria-atomic')).toBe('true');
        });

        it('annonserer «Fullført» ved success', () => {
            const el = mount(`
                <ix-progress-bar state="success">
                    <progress value="100" max="100"></progress>
                </ix-progress-bar>
            `);
            expect(el.querySelector('[aria-live="polite"]')?.textContent).toBe('Fullført');
        });

        it('annonserer «Feilet» ved error', () => {
            const el = mount(`
                <ix-progress-bar state="error">
                    <progress value="40" max="100"></progress>
                </ix-progress-bar>
            `);
            expect(el.querySelector('[aria-live="polite"]')?.textContent).toBe('Feilet');
        });

        it('annonserer når state endres til success', () => {
            const el = mount(`
                <ix-progress-bar>
                    <progress value="100" max="100"></progress>
                </ix-progress-bar>
            `);
            el.setAttribute('state', 'success');
            expect(el.querySelector('[aria-live="polite"]')?.textContent).toBe('Fullført');
        });
    });

    describe('Cleanup', () => {
        it('disconnecterer MutationObserver i disconnectedCallback', () => {
            const el = mount(`
                <ix-progress-bar>
                    <progress value="65" max="100"></progress>
                </ix-progress-bar>
            `);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tilgang til privat felt for å teste cleanup
            expect((el as any)._observer).not.toBeNull();
            el.remove();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tilgang til privat felt for å teste cleanup
            expect((el as any)._observer).toBeNull();
        });
    });
});
