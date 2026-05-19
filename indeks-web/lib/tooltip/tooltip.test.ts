import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Import side-effect — registers event listeners
import './tooltip';

const TOOLTIP_ID = 'ix-tooltip-singleton';

function createTrigger(attrs: Record<string, string> = {}): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.setAttribute('data-tooltip', attrs['data-tooltip'] ?? 'Hjelpetekst');
    if (attrs['data-tooltip-placement']) {
        btn.setAttribute('data-tooltip-placement', attrs['data-tooltip-placement']);
    }
    document.body.appendChild(btn);
    return btn;
}

function getTip(): HTMLElement | null {
    return document.getElementById(TOOLTIP_ID);
}

afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllTimers();
});

describe('tooltip', () => {
    describe('show og hide ved focus', () => {
        it('viser tooltip ved focusin', () => {
            const btn = createTrigger();
            btn.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: null }));

            const tip = getTip();
            expect(tip).not.toBeNull();
            expect(tip!.hidden).toBe(false);
            expect(tip!.textContent).toBe('Hjelpetekst');
        });

        it('skjuler tooltip ved focusout til annet element', () => {
            const btn = createTrigger();
            btn.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: null }));

            const other = document.createElement('input');
            document.body.appendChild(other);
            btn.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: other }));

            expect(getTip()!.hidden).toBe(true);
        });

        it('setter aria-describedby paa trigger naar tooltip er synlig', () => {
            const btn = createTrigger();
            btn.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: null }));

            expect(btn.getAttribute('aria-describedby')).toBe(TOOLTIP_ID);
        });

        it('fjerner aria-describedby fra trigger naar tooltip skjules', () => {
            const btn = createTrigger();
            btn.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: null }));

            const other = document.createElement('input');
            document.body.appendChild(other);
            btn.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: other }));

            expect(btn.hasAttribute('aria-describedby')).toBe(false);
        });
    });

    describe('show med delay ved hover', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('viser ikke tooltip foer delay er utloept', () => {
            const btn = createTrigger();
            btn.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, relatedTarget: null }));

            expect(getTip()?.hidden ?? true).toBe(true);
        });

        it('viser tooltip etter delay', () => {
            const btn = createTrigger();
            btn.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, relatedTarget: null }));
            vi.runAllTimers();

            expect(getTip()!.hidden).toBe(false);
        });

        it('skjuler tooltip ved mouseout', () => {
            const btn = createTrigger();
            btn.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            vi.runAllTimers();

            btn.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: document.body }));

            expect(getTip()!.hidden).toBe(true);
        });
    });

    describe('Escape-tast', () => {
        it('skjuler tooltip ved Escape', () => {
            const btn = createTrigger();
            btn.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: null }));

            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

            expect(getTip()!.hidden).toBe(true);
        });

        it('gjor ingenting naar ingen tooltip er apen', () => {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
            expect(getTip()).toBeNull();
        });
    });

    describe('plassering', () => {
        it('bruker top som standard placement naar det er plass', () => {
            const btn = createTrigger();
            // Simuler at trigger er midt paa siden saa det er plass over
            vi.spyOn(btn, 'getBoundingClientRect').mockReturnValue({
                top: 400, bottom: 420, left: 100, right: 200,
                width: 100, height: 20, x: 100, y: 400, toJSON: () => ({})
            });
            btn.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: null }));

            expect(getTip()!.getAttribute('data-placement')).toBe('top');
        });

        it('bruker oppgitt placement-attributt', () => {
            const btn = createTrigger({ 'data-tooltip': 'Tekst', 'data-tooltip-placement': 'bottom' });
            btn.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: null }));

            expect(getTip()!.getAttribute('data-placement')).toBe('bottom');
        });
    });

    describe('singleton', () => {
        it('gjenbruker samme panel-element for flere triggere', () => {
            const btn1 = createTrigger({ 'data-tooltip': 'Tekst 1' });
            const btn2 = createTrigger({ 'data-tooltip': 'Tekst 2' });

            btn1.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: null }));
            btn2.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: null }));

            const tips = document.querySelectorAll(`#${TOOLTIP_ID}`);
            expect(tips.length).toBe(1);
            expect(tips[0].textContent).toBe('Tekst 2');
        });
    });
});
