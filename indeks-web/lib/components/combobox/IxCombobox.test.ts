import { afterEach, describe, expect, it, vi } from 'vitest';
import { IxCombobox } from './IxCombobox';

if (!customElements.get('ix-combobox')) {
    customElements.define('ix-combobox', IxCombobox);
}

function mount(html: string): IxCombobox {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
    return wrapper.querySelector('ix-combobox')!;
}

const OPTIONS = `
  <div class="ix-combobox__option" data-value="47"><span class="ix-combobox__option-label">Norge</span><span class="ix-combobox__option-description">+47</span></div>
  <div class="ix-combobox__option" data-value="46"><span class="ix-combobox__option-label">Sverige</span></div>
  <div class="ix-combobox__option" data-value="45"><span class="ix-combobox__option-label">Danmark</span></div>
  <div class="ix-combobox__option" data-value="354"><span class="ix-combobox__option-label">Åland</span></div>
`;

function single(extraHostAttrs = ''): IxCombobox {
    return mount(`
    <ix-combobox data-no-hits-text="Ingen treff" ${extraHostAttrs}>
      <div class="ix-text-field">
        <input class="ix-text-field__input" aria-label="Land" />
        <button class="ix-combobox__toggle" aria-label="Vis alternativer"></button>
      </div>
      <div class="ix-combobox__listbox">${OPTIONS}</div>
      <div class="ix-combobox__no-hits" role="status" hidden>Ingen treff</div>
      <select data-field="native" hidden></select>
    </ix-combobox>
  `);
}

function multi(extraHostAttrs = ''): IxCombobox {
    return mount(`
    <ix-combobox multiple data-no-hits-text="Ingen treff" data-remove-chip-label="fjern" data-arrow-hint-text="Bruk piltast" ${extraHostAttrs}>
      <div class="ix-combobox__chips" data-field="chips"></div>
      <div class="ix-text-field">
        <input class="ix-text-field__input" aria-label="Land" />
        <button class="ix-combobox__toggle" aria-label="Vis alternativer"></button>
      </div>
      <div class="ix-combobox__listbox">${OPTIONS}</div>
      <div class="ix-combobox__no-hits" role="status" hidden>Ingen treff</div>
      <select data-field="native" name="land" hidden></select>
    </ix-combobox>
  `);
}

function input(el: IxCombobox): HTMLInputElement {
    return el.querySelector('input')!;
}
function listbox(el: IxCombobox): HTMLElement {
    return el.querySelector('.ix-combobox__listbox')!;
}
function options(el: IxCombobox): HTMLElement[] {
    return Array.from(el.querySelectorAll<HTMLElement>('.ix-combobox__option'));
}
function press(el: IxCombobox, key: string, target: HTMLElement = input(el)): void {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}
function type(el: IxCombobox, value: string): void {
    input(el).value = value;
    input(el).dispatchEvent(new Event('input', { bubbles: true }));
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('IxCombobox', () => {
    describe('ARIA-oppsett', () => {
        it('setter combobox-ARIA på input', () => {
            const el = single();
            const inp = input(el);
            expect(inp.getAttribute('role')).toBe('combobox');
            expect(inp.getAttribute('aria-autocomplete')).toBe('list');
            expect(inp.getAttribute('autocomplete')).toBe('off');
            expect(inp.getAttribute('aria-expanded')).toBe('false');
            expect(inp.getAttribute('aria-controls')).toBe(listbox(el).id);
        });

        it('setter listbox-rolle og genererer id', () => {
            const el = single();
            expect(listbox(el).getAttribute('role')).toBe('listbox');
            expect(listbox(el).id).toMatch(/^ix-combobox-listbox-\d+$/);
        });

        it('gir hver option role og stabil id', () => {
            const el = single();
            for (const o of options(el)) {
                expect(o.getAttribute('role')).toBe('option');
                expect(o.id).toBeTruthy();
                expect(o.getAttribute('aria-selected')).toBe('false');
            }
        });

        it('setter aria-multiselectable=true kun i multi', () => {
            expect(listbox(single()).getAttribute('aria-multiselectable')).toBe('false');
            expect(listbox(multi()).getAttribute('aria-multiselectable')).toBe('true');
        });

        it('respekterer eksisterende input-id', () => {
            const el = mount(`
              <ix-combobox>
                <div class="ix-text-field"><input id="egen-id" aria-label="x" /></div>
                <div class="ix-combobox__listbox">${OPTIONS}</div>
                <select data-field="native" hidden></select>
              </ix-combobox>`);
            expect(input(el).id).toBe('egen-id');
        });

        it('konfigurerer toggle-knapp', () => {
            const toggle = single().querySelector<HTMLButtonElement>('.ix-combobox__toggle')!;
            expect(toggle.type).toBe('button');
            expect(toggle.getAttribute('aria-label')).toBeTruthy();
        });
    });

    describe('åpne / lukke', () => {
        it('lista er skjult ved start', () => {
            expect(listbox(single()).hidden).toBe(true);
        });

        it('klikk på toggle åpner og lukker', () => {
            const el = single();
            const toggle = el.querySelector<HTMLButtonElement>('.ix-combobox__toggle')!;
            toggle.click();
            expect(listbox(el).hidden).toBe(false);
            expect(input(el).getAttribute('aria-expanded')).toBe('true');
            expect(el.hasAttribute('data-open')).toBe(true);
            toggle.click();
            expect(listbox(el).hidden).toBe(true);
            expect(el.hasAttribute('data-open')).toBe(false);
        });

        it('ArrowDown åpner lista', () => {
            const el = single();
            press(el, 'ArrowDown');
            expect(listbox(el).hidden).toBe(false);
        });

        it('Escape lukker lista', () => {
            const el = single();
            press(el, 'ArrowDown');
            press(el, 'Escape');
            expect(listbox(el).hidden).toBe(true);
        });

        it('Escape lukker lista selv når target ikke er inputen', () => {
            const el = single();
            press(el, 'ArrowDown');
            // I nettleseren er Escape-target ikke garantert inputen — send fra
            // listboxen (bubbler til host-lytteren) og verifiser at den lukkes.
            press(el, 'Escape', listbox(el));
            expect(listbox(el).hidden).toBe(true);
            expect(input(el).getAttribute('aria-expanded')).toBe('false');
        });

        it('klikk utenfor lukker lista', () => {
            const el = single();
            press(el, 'ArrowDown');
            document.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
            expect(listbox(el).hidden).toBe(true);
        });
    });

    describe('filtrering', () => {
        it('skjuler options som ikke matcher', () => {
            const el = single();
            type(el, 'sve');
            const visible = options(el).filter((o) => !o.hidden);
            expect(visible).toHaveLength(1);
            expect(visible[0].getAttribute('data-value')).toBe('46');
        });

        it('matcher på data-value', () => {
            const el = single();
            type(el, '46');
            const visible = options(el).filter((o) => !o.hidden);
            expect(visible.map((o) => o.getAttribute('data-value'))).toEqual(['46']);
        });

        it('matcher på beskrivelse (2. linje)', () => {
            const el = single();
            // Kun Norge har beskrivelsen "+47"; verdien er "47".
            type(el, '+47');
            const visible = options(el).filter((o) => !o.hidden);
            expect(visible.map((o) => o.getAttribute('data-value'))).toEqual(['47']);
        });

        it('er case-uavhengig, også for æøå (Å = egen bokstav i norsk)', () => {
            const el = single();
            // Norsk collator: Å er egen bokstav, ikke aksentert A. Case-uavhengig
            // treff på selve Å-en (ÅL → Åland), men "al" skal IKKE matche Åland.
            type(el, 'ÅL');
            const visible = options(el).filter((o) => !o.hidden);
            expect(visible.map((o) => o.getAttribute('data-value'))).toEqual(['354']);
        });

        it('viser no-hits-tekst når 0 treff', () => {
            const el = single();
            type(el, 'zzzzz');
            const noHits = el.querySelector<HTMLElement>('.ix-combobox__no-hits')!;
            // Live region toggles via tekstinnhold, ikke hidden — den forblir i
            // tilgjengelighetstreet (WCAG 4.1.3). Tom tekst skjules av CSS :empty.
            expect(noHits.textContent).toBe('Ingen treff');
            expect(noHits.hasAttribute('hidden')).toBe(false);
        });

        it('tom query viser alle igjen og tømmer no-hits', () => {
            const el = single();
            type(el, 'zzzzz');
            type(el, '');
            expect(options(el).every((o) => !o.hidden)).toBe(true);
            const noHits = el.querySelector<HTMLElement>('.ix-combobox__no-hits')!;
            expect(noHits.textContent).toBe('');
        });
    });

    describe('single-valg', () => {
        it('velger option med Enter og lukker', () => {
            const el = single();
            press(el, 'ArrowDown'); // åpner + aktiverer første
            press(el, 'Enter');
            expect(input(el).value).toBe('Norge');
            expect(listbox(el).hidden).toBe(true);
            expect(options(el)[0].getAttribute('aria-selected')).toBe('true');
        });

        it('klikk på option velger den', () => {
            const el = single();
            press(el, 'ArrowDown');
            options(el)[1].click();
            expect(input(el).value).toBe('Sverige');
        });

        it('bare én option er valgt om gangen', () => {
            const el = single();
            press(el, 'ArrowDown');
            options(el)[0].click();
            options(el)[2].click();
            const selected = options(el).filter((o) => o.getAttribute('aria-selected') === 'true');
            expect(selected).toHaveLength(1);
            expect(selected[0].getAttribute('data-value')).toBe('45');
        });

        it('synker valgt verdi til skjult select', () => {
            const el = single();
            press(el, 'ArrowDown');
            options(el)[0].click();
            const sel = el.querySelector('select')!;
            expect(sel.value).toBe('47');
            expect(sel.multiple).toBe(false);
        });
    });

    describe('multi-valg + chips', () => {
        it('legger til chip ved valg og holder lista åpen', () => {
            const el = multi();
            press(el, 'ArrowDown');
            options(el)[0].click();
            const chips = el.querySelectorAll('data.ix-chip');
            expect(chips).toHaveLength(1);
            expect(chips[0].getAttribute('value')).toBe('47');
            expect(listbox(el).hidden).toBe(false);
            expect(input(el).value).toBe('');
        });

        it('chip har removable-attributt og i18n aria-label', () => {
            const el = multi();
            press(el, 'ArrowDown');
            options(el)[0].click();
            const chip = el.querySelector('data.ix-chip')!;
            expect(chip.hasAttribute('data-removable')).toBe(true);
            expect(chip.getAttribute('aria-label')).toBe('Norge, fjern');
        });

        it('klikk på chip fjerner valget', () => {
            const el = multi();
            press(el, 'ArrowDown');
            options(el)[0].click();
            el.querySelector<HTMLElement>('data.ix-chip')!.click();
            expect(el.querySelectorAll('data.ix-chip')).toHaveLength(0);
            expect(options(el)[0].getAttribute('aria-selected')).toBe('false');
        });

        it('velger flere og synker <select multiple>', () => {
            const el = multi();
            press(el, 'ArrowDown');
            options(el)[0].click();
            options(el)[2].click();
            const sel = el.querySelector('select')!;
            expect(sel.multiple).toBe(true);
            expect(Array.from(sel.selectedOptions).map((o) => o.value).sort()).toEqual(['45', '47']);
        });

        it('re-klikk på valgt option avvelger den', () => {
            const el = multi();
            press(el, 'ArrowDown');
            options(el)[0].click();
            options(el)[0].click();
            expect(el.querySelectorAll('data.ix-chip')).toHaveLength(0);
        });

        it('setter aria-description (piltast-hint) på input i multi', () => {
            expect(input(multi()).getAttribute('aria-description')).toBe('Bruk piltast');
            expect(input(single()).getAttribute('aria-description')).toBeNull();
        });
    });

    describe('tastatur — chips-navigasjon', () => {
        it('Backspace på tom input flytter fokus til siste chip', () => {
            const el = multi();
            press(el, 'ArrowDown');
            options(el)[0].click();
            input(el).setSelectionRange(0, 0);
            press(el, 'Backspace');
            const chip = el.querySelector<HTMLElement>('data.ix-chip')!;
            expect(document.activeElement).toBe(chip);
        });

        it('Backspace på fokusert chip fjerner den', () => {
            const el = multi();
            press(el, 'ArrowDown');
            options(el)[0].click();
            const chip = el.querySelector<HTMLDataElement>('data.ix-chip')!;
            chip.focus();
            press(el, 'Backspace', chip);
            expect(el.querySelectorAll('data.ix-chip')).toHaveLength(0);
        });
    });

    describe('aktivt element', () => {
        it('ArrowDown/Up flytter data-active og aria-activedescendant', () => {
            const el = single();
            press(el, 'ArrowDown'); // aktiverer første
            expect(options(el)[0].hasAttribute('data-active')).toBe(true);
            expect(input(el).getAttribute('aria-activedescendant')).toBe(options(el)[0].id);
            press(el, 'ArrowDown'); // andre
            expect(options(el)[1].hasAttribute('data-active')).toBe(true);
            expect(options(el)[0].hasAttribute('data-active')).toBe(false);
        });
    });

    describe('tilstand', () => {
        it('disabled speiles til input og blokkerer åpning', () => {
            const el = single('disabled');
            expect(input(el).disabled).toBe(true);
            expect(el.hasAttribute('data-disabled')).toBe(true);
            press(el, 'ArrowDown');
            expect(listbox(el).hidden).toBe(true);
        });

        it('readonly speiles til input', () => {
            const el = single('readonly');
            expect(input(el).readOnly).toBe(true);
            expect(el.hasAttribute('data-readonly')).toBe(true);
        });

        it('endring av disabled etter mount synkroniseres', () => {
            const el = single();
            el.setAttribute('disabled', '');
            expect(input(el).disabled).toBe(true);
            el.removeAttribute('disabled');
            expect(input(el).disabled).toBe(false);
        });
    });

    describe('initial-tilstand fra HTML', () => {
        it('leser aria-selected fra options ved mount (single)', () => {
            const el = mount(`
              <ix-combobox>
                <div class="ix-text-field"><input aria-label="Land" /></div>
                <div class="ix-combobox__listbox">
                  <div class="ix-combobox__option" data-value="47" aria-selected="true"><span class="ix-combobox__option-label">Norge</span></div>
                  <div class="ix-combobox__option" data-value="46"><span class="ix-combobox__option-label">Sverige</span></div>
                </div>
                <select data-field="native" hidden></select>
              </ix-combobox>`);
            expect(input(el).value).toBe('Norge');
            expect(el.querySelector('select')!.value).toBe('47');
        });

        it('rendrer chips fra initielt valgte options (multi)', () => {
            const el = mount(`
              <ix-combobox multiple>
                <div class="ix-combobox__chips" data-field="chips"></div>
                <div class="ix-text-field"><input aria-label="Land" /></div>
                <div class="ix-combobox__listbox">
                  <div class="ix-combobox__option" data-value="47" aria-selected="true"><span class="ix-combobox__option-label">Norge</span></div>
                  <div class="ix-combobox__option" data-value="46" aria-selected="true"><span class="ix-combobox__option-label">Sverige</span></div>
                </div>
                <select data-field="native" hidden></select>
              </ix-combobox>`);
            expect(el.querySelectorAll('data.ix-chip')).toHaveLength(2);
        });
    });

    describe('form-synk uten forfatter-select', () => {
        it('oppretter skjult select om den mangler', () => {
            const el = mount(`
              <ix-combobox name="land">
                <div class="ix-text-field"><input aria-label="Land" /></div>
                <div class="ix-combobox__listbox">${OPTIONS}</div>
              </ix-combobox>`);
            const sel = el.querySelector('select')!;
            expect(sel).toBeTruthy();
            expect(sel.name).toBe('land');
        });
    });

    describe('opprydding', () => {
        it('fjerner document-lyttere ved disconnect', () => {
            const el = single();
            press(el, 'ArrowDown');
            el.remove();
            // Etter fjerning skal pointerdown ikke kaste eller ha effekt.
            expect(() => document.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))).not.toThrow();
        });

        it('remount fungerer uten dobbel-oppsett', () => {
            const el = single();
            const parent = el.parentElement!;
            el.remove();
            parent.appendChild(el);
            press(el, 'ArrowDown');
            expect(listbox(el).hidden).toBe(false);
        });
    });

    describe('dev-warnings', () => {
        it('advarer når input mangler', () => {
            const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            mount(`<ix-combobox><div class="ix-combobox__listbox"></div></ix-combobox>`);
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });
    });

    describe('i18n — ingen hardkodet tekst', () => {
        it('setter ingen fallback-aria-label på toggle, men advarer i DEV', () => {
            const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const el = mount(`
              <ix-combobox data-no-hits-text="Ingen treff">
                <div class="ix-text-field">
                  <input class="ix-text-field__input" aria-label="Land" />
                  <button class="ix-combobox__toggle"></button>
                </div>
                <div class="ix-combobox__listbox">${OPTIONS}</div>
                <select data-field="native" hidden></select>
              </ix-combobox>`);
            const toggle = el.querySelector<HTMLButtonElement>('.ix-combobox__toggle')!;
            // Ingen hardkodet norsk fallback — konsumenten må selv sette teksten.
            expect(toggle.getAttribute('aria-label')).toBeNull();
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });

        it('chip-aria-label er bare label uten data-remove-chip-label (+ DEV-warn)', () => {
            const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const el = mount(`
              <ix-combobox multiple data-no-hits-text="Ingen treff">
                <div class="ix-combobox__chips" data-field="chips"></div>
                <div class="ix-text-field">
                  <input class="ix-text-field__input" aria-label="Land" />
                  <button class="ix-combobox__toggle" aria-label="Vis alternativer"></button>
                </div>
                <div class="ix-combobox__listbox">${OPTIONS}</div>
                <select data-field="native" name="land" hidden></select>
              </ix-combobox>`);
            press(el, 'ArrowDown');
            options(el)[0].click();
            const chip = el.querySelector('data.ix-chip')!;
            // Uten suffiks-tekst: ingen hardkodet «, fjern» — bare label-teksten.
            expect(chip.getAttribute('aria-label')).toBe('Norge');
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });
    });
});
