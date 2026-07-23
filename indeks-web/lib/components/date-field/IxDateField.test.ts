import { describe, expect, it, vi, afterEach } from 'vitest';
import { IxDateField } from './IxDateField';

if (!customElements.get('ix-date-field')) {
    customElements.define('ix-date-field', IxDateField);
}

function mount(html: string): IxDateField {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
    return wrapper.querySelector('ix-date-field')!;
}

function visibleInput(el: IxDateField): HTMLInputElement {
    return el.querySelector<HTMLInputElement>('.ix-text-field input:not(.ix-date-field__native)')!;
}

function nativeInput(el: IxDateField): HTMLInputElement {
    return el.querySelector<HTMLInputElement>('input.ix-date-field__native')!;
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('IxDateField', () => {
    it('injiserer kalenderknapp og native date-input i .ix-text-field', () => {
        const el = mount(`
            <ix-date-field data-open-label="Åpne kalender">
                <div class="ix-text-field"><input data-format="date" /></div>
            </ix-date-field>
        `);
        const toggle = el.querySelector('button.ix-date-field__toggle');
        const native = el.querySelector('input.ix-date-field__native');
        expect(toggle).not.toBeNull();
        expect(toggle!.getAttribute('type')).toBe('button');
        expect(toggle!.getAttribute('aria-label')).toBe('Åpne kalender');
        expect(native).not.toBeNull();
        expect(native!.getAttribute('type')).toBe('date');
        expect(native!.getAttribute('aria-hidden')).toBe('true');
        expect(native!.getAttribute('tabindex')).toBe('-1');
    });

    it('genererer ikke dobbelt hvis elementene finnes fra før (idempotent)', () => {
        const el = mount(`
            <ix-date-field data-open-label="Åpne kalender">
                <div class="ix-text-field">
                    <input data-format="date" />
                    <button class="ix-date-field__toggle" type="button"></button>
                    <input class="ix-date-field__native" type="date" />
                </div>
            </ix-date-field>
        `);
        expect(el.querySelectorAll('button.ix-date-field__toggle')).toHaveLength(1);
        expect(el.querySelectorAll('input.ix-date-field__native')).toHaveLength(1);
    });

    it('setter ikke data-touch på desktop (jsdom er ikke-touch)', () => {
        // På desktop lar CSS pekeren gå gjennom native-inputen til knappen; touch-
        // markøren skal derfor være fraværende. IS_TOUCH leses fra userAgent ved
        // modullasting, som i jsdom ikke er en mobil-UA.
        const el = mount(`
            <ix-date-field data-open-label="Åpne kalender">
                <div class="ix-text-field"><input data-format="date" /></div>
            </ix-date-field>
        `);
        expect(el.hasAttribute('data-touch')).toBe(false);
    });

    it('setter name på native og fjerner det fra synlig input', () => {
        const el = mount(`
            <ix-date-field data-open-label="Åpne kalender" name="fodt">
                <div class="ix-text-field"><input data-format="date" name="fodt" /></div>
            </ix-date-field>
        `);
        expect(nativeInput(el).name).toBe('fodt');
        expect(visibleInput(el).hasAttribute('name')).toBe(false);
    });

    it('speiler min/max/disabled/readonly til native input', () => {
        const el = mount(`
            <ix-date-field data-open-label="Åpne kalender" min="2020-01-01" max="2030-12-31" disabled readonly>
                <div class="ix-text-field"><input data-format="date" /></div>
            </ix-date-field>
        `);
        const native = nativeInput(el);
        expect(native.min).toBe('2020-01-01');
        expect(native.max).toBe('2030-12-31');
        expect(native.disabled).toBe(true);
        expect(native.readOnly).toBe(true);
    });

    it('oppdaterer native min ved attributtendring etter mount', () => {
        const el = mount(`
            <ix-date-field data-open-label="Åpne kalender">
                <div class="ix-text-field"><input data-format="date" /></div>
            </ix-date-field>
        `);
        el.setAttribute('min', '2021-06-01');
        expect(nativeInput(el).min).toBe('2021-06-01');
    });

    it('native change (ISO) → synlig viser dd.mm.åååå og host emitter change', () => {
        const el = mount(`
            <ix-date-field data-open-label="Åpne kalender">
                <div class="ix-text-field"><input data-format="date" /></div>
            </ix-date-field>
        `);
        const changes: string[] = [];
        el.addEventListener('change', () => changes.push(nativeInput(el).value));

        const native = nativeInput(el);
        native.value = '1990-05-17';
        native.dispatchEvent(new Event('change', { bubbles: true }));

        expect(visibleInput(el).value).toBe('17.05.1990');
        expect(changes).toEqual(['1990-05-17']);
    });

    it('synlig input (dd.mm.åååå-siffer) → native får ISO', () => {
        const el = mount(`
            <ix-date-field data-open-label="Åpne kalender">
                <div class="ix-text-field"><input data-format="date" /></div>
            </ix-date-field>
        `);
        const input = visibleInput(el);
        input.value = '17.05.1990';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(nativeInput(el).value).toBe('1990-05-17');
    });

    it('ufullstendig synlig verdi gir tom native ISO', () => {
        const el = mount(`
            <ix-date-field data-open-label="Åpne kalender">
                <div class="ix-text-field"><input data-format="date" /></div>
            </ix-date-field>
        `);
        const input = visibleInput(el);
        input.value = '17.05';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(nativeInput(el).value).toBe('');
    });

    it('value-attributt (ISO) seeder både native og synlig', () => {
        const el = mount(`
            <ix-date-field data-open-label="Åpne kalender" value="2000-12-24">
                <div class="ix-text-field"><input data-format="date" /></div>
            </ix-date-field>
        `);
        expect(nativeInput(el).value).toBe('2000-12-24');
        expect(visibleInput(el).value).toBe('24.12.2000');
    });

    it('emitterer kun én change per faktisk endring (ingen løkke)', () => {
        const el = mount(`
            <ix-date-field data-open-label="Åpne kalender">
                <div class="ix-text-field"><input data-format="date" /></div>
            </ix-date-field>
        `);
        let count = 0;
        el.addEventListener('change', () => count++);
        const native = nativeInput(el);
        native.value = '1990-05-17';
        native.dispatchEvent(new Event('change', { bubbles: true }));
        expect(count).toBe(1);
    });

    it('klikk på kalenderknapp kaster ikke selv om showPicker mangler', () => {
        const el = mount(`
            <ix-date-field data-open-label="Åpne kalender">
                <div class="ix-text-field"><input data-format="date" /></div>
            </ix-date-field>
        `);
        const toggle = el.querySelector<HTMLButtonElement>('button.ix-date-field__toggle')!;
        expect(() => toggle.click()).not.toThrow();
    });

    it('advarer i DEV når data-open-label mangler', () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mount(`
            <ix-date-field>
                <div class="ix-text-field"><input data-format="date" /></div>
            </ix-date-field>
        `);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    it('advarer i DEV når .ix-text-field mangler, uten å krasje', () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        expect(() => mount(`<ix-date-field data-open-label="Åpne kalender"></ix-date-field>`)).not.toThrow();
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    it('rydder opp lyttere i disconnectedCallback (synk-logikk kjører ikke etter fjerning)', () => {
        const el = mount(`
            <ix-date-field data-open-label="Åpne kalender">
                <div class="ix-text-field"><input data-format="date" /></div>
            </ix-date-field>
        `);
        const native = nativeInput(el);
        const input = visibleInput(el);
        el.remove();
        // Etter fjerning skal vår native-lytter være borte: den synlige inputen
        // oppdateres ikke lenger (DOM kan fortsatt boble native-eventet, men vår
        // synk-logikk kjører ikke).
        native.value = '1990-05-17';
        native.dispatchEvent(new Event('change', { bubbles: true }));
        expect(input.value).toBe('');
    });

    it('remount fungerer uten dupliserte lyttere', () => {
        const el = mount(`
            <ix-date-field data-open-label="Åpne kalender">
                <div class="ix-text-field"><input data-format="date" /></div>
            </ix-date-field>
        `);
        const parent = el.parentElement!;
        el.remove();
        parent.appendChild(el);

        let count = 0;
        el.addEventListener('change', () => count++);
        const native = nativeInput(el);
        native.value = '1990-05-17';
        native.dispatchEvent(new Event('change', { bubbles: true }));
        expect(count).toBe(1);
    });
});
