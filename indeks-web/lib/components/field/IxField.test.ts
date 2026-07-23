import { afterEach, describe, expect, it, vi } from 'vitest';
import { IxField } from './IxField';

if (!customElements.get('ix-field')) {
    customElements.define('ix-field', IxField);
}

function createField(html: string): IxField {
    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
    return div.querySelector('ix-field')!;
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('IxField', () => {
    describe('ID-generering', () => {
        it('genererer stabil ID paa input naar den mangler', () => {
            const field = createField(`
                <ix-field>
                    <label>Navn</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const input = field.querySelector('input')!;
            expect(input.id).toMatch(/^ix-field-\d+$/);
        });

        it('beholder eksisterende ID paa input', () => {
            createField(`
                <ix-field>
                    <label>Navn</label>
                    <input id="min-id" />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const input = document.querySelector('input')!;
            expect(input.id).toBe('min-id');
        });

        it('genererer unike IDer for flere instanser', () => {
            const field1 = createField(`
                <ix-field>
                    <label>Felt 1</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const field2 = createField(`
                <ix-field>
                    <label>Felt 2</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const id1 = field1.querySelector('input')!.id;
            const id2 = field2.querySelector('input')!.id;
            expect(id1).not.toBe(id2);
        });
    });

    describe('Label-kobling', () => {
        it('setter label.htmlFor til input.id', () => {
            const field = createField(`
                <ix-field>
                    <label>E-post</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const label = field.querySelector('label')!;
            const input = field.querySelector('input')!;
            expect(label.htmlFor).toBe(input.id);
        });

        it('respekterer eksisterende htmlFor paa label', () => {
            createField(`
                <ix-field>
                    <label for="manuell-id">E-post</label>
                    <input id="manuell-id" />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const label = document.querySelector('label')!;
            expect(label.htmlFor).toBe('manuell-id');
        });
    });

    describe('aria-describedby', () => {
        it('setter aria-describedby med description og error IDer', () => {
            const field = createField(`
                <ix-field>
                    <label>Beloep</label>
                    <span data-field="description">Uten desimaler</span>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const input = field.querySelector('input')!;
            const desc = field.querySelector('[data-field="description"]')!;
            const error = field.querySelector('[data-field="error"]')!;
            expect(input.getAttribute('aria-describedby')).toBe(`${desc.id} ${error.id}`);
        });

        it('setter aria-describedby kun med error naar description mangler', () => {
            const field = createField(`
                <ix-field>
                    <label>Beloep</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const input = field.querySelector('input')!;
            const error = field.querySelector('[data-field="error"]')!;
            expect(input.getAttribute('aria-describedby')).toBe(error.id);
        });

        it('setter ikke aria-describedby naar baade description og error mangler', () => {
            const field = createField(`
                <ix-field>
                    <label>Beloep</label>
                    <input />
                </ix-field>
            `);
            const input = field.querySelector('input')!;
            expect(input.hasAttribute('aria-describedby')).toBe(false);
        });

        it('genererer IDer paa description og error naar de mangler', () => {
            const field = createField(`
                <ix-field>
                    <label>Beloep</label>
                    <span data-field="description">Hjelp</span>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const input = field.querySelector('input')!;
            const desc = field.querySelector('[data-field="description"]')!;
            const error = field.querySelector('[data-field="error"]')!;
            expect(desc.id).toBe(`${input.id}-description`);
            expect(error.id).toBe(`${input.id}-error`);
        });
    });

    describe('aria-live', () => {
        it('setter aria-live="polite" paa error-elementet', () => {
            const field = createField(`
                <ix-field>
                    <label>Navn</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const error = field.querySelector('[data-field="error"]')!;
            expect(error.getAttribute('aria-live')).toBe('polite');
        });
    });

    describe('aria-invalid synkronisering', () => {
        it('setter aria-invalid="true" naar error har innhold', () => {
            const field = createField(`
                <ix-field>
                    <label>Kontonummer</label>
                    <input />
                    <span data-field="error">Maa ha 11 siffer</span>
                </ix-field>
            `);
            const input = field.querySelector('input')!;
            expect(input.getAttribute('aria-invalid')).toBe('true');
        });

        it('setter ikke aria-invalid naar error er tom', () => {
            const field = createField(`
                <ix-field>
                    <label>Kontonummer</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const input = field.querySelector('input')!;
            expect(input.hasAttribute('aria-invalid')).toBe(false);
        });

        it('setter ikke aria-invalid naar error kun har whitespace', () => {
            const field = createField(`
                <ix-field>
                    <label>Kontonummer</label>
                    <input />
                    <span data-field="error">   </span>
                </ix-field>
            `);
            const input = field.querySelector('input')!;
            expect(input.hasAttribute('aria-invalid')).toBe(false);
        });

        it('oppdaterer aria-invalid naar error-innhold endres dynamisk', async () => {
            const field = createField(`
                <ix-field>
                    <label>Kontonummer</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const input = field.querySelector('input')!;
            const error = field.querySelector('[data-field="error"]')!;

            expect(input.hasAttribute('aria-invalid')).toBe(false);

            error.textContent = 'Ugyldig';
            // MutationObserver er asynkron — vent paa mikrotask
            await new Promise((r) => setTimeout(r, 0));
            expect(input.getAttribute('aria-invalid')).toBe('true');

            error.textContent = '';
            await new Promise((r) => setTimeout(r, 0));
            expect(input.hasAttribute('aria-invalid')).toBe(false);
        });
    });

    describe('aria-hidden paa prefix/suffix', () => {
        it('setter aria-hidden="true" paa prefix og suffix', () => {
            const field = createField(`
                <ix-field>
                    <label>Beloep i kroner</label>
                    <div>
                        <div data-field="prefix">kr</div>
                        <input />
                        <div data-field="suffix">,00</div>
                    </div>
                    <span data-field="error"></span>
                </ix-field>
            `);
            const prefix = field.querySelector('[data-field="prefix"]')!;
            const suffix = field.querySelector('[data-field="suffix"]')!;
            expect(prefix.getAttribute('aria-hidden')).toBe('true');
            expect(suffix.getAttribute('aria-hidden')).toBe('true');
        });
    });

    describe('cleanup', () => {
        it('kobler fra MutationObserver i disconnectedCallback', () => {
            const field = createField(`
                <ix-field>
                    <label>Navn</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tilgang til privat felt for aa teste cleanup
            const observer = (field as any)._observer as MutationObserver;
            expect(observer).not.toBeNull();

            const disconnectSpy = vi.spyOn(observer, 'disconnect');
            field.remove();
            expect(disconnectSpy).toHaveBeenCalled();
        });

        it('setter observer til null etter disconnect', () => {
            const field = createField(`
                <ix-field>
                    <label>Navn</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            field.remove();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tilgang til privat felt for aa teste cleanup
            expect((field as any)._observer).toBeNull();
        });
    });

    describe('tegnteller', () => {
        it('oppretter char-count element naar maxlength er satt', () => {
            const field = createField(`
                <ix-field>
                    <label>Kommentar</label>
                    <textarea maxlength="200"></textarea>
                    <span data-field="error"></span>
                </ix-field>
            `);
            const counter = field.querySelector('[data-field="char-count"]');
            expect(counter).not.toBeNull();
            expect(counter?.textContent).toBe('0/200');
        });

        it('oppretter char-count element naar minlength er satt', () => {
            const field = createField(`
                <ix-field>
                    <label>Kommentar</label>
                    <textarea minlength="10"></textarea>
                    <span data-field="error"></span>
                </ix-field>
            `);
            const counter = field.querySelector('[data-field="char-count"]');
            expect(counter).not.toBeNull();
            expect(counter?.textContent).toBe('0 tegn (minimum 10)');
        });

        it('oppretter ikke char-count element naar verken min- eller maxlength er satt', () => {
            const field = createField(`
                <ix-field>
                    <label>Kommentar</label>
                    <textarea></textarea>
                    <span data-field="error"></span>
                </ix-field>
            `);
            const counter = field.querySelector('[data-field="char-count"]');
            expect(counter).toBeNull();
        });

        it('inkluderer char-count id i aria-describedby', () => {
            const field = createField(`
                <ix-field>
                    <label>Kommentar</label>
                    <textarea maxlength="200"></textarea>
                    <span data-field="error"></span>
                </ix-field>
            `);
            const textarea = field.querySelector('textarea')!;
            const counter = field.querySelector('[data-field="char-count"]')!;
            expect(textarea.getAttribute('aria-describedby')).toContain(counter.id);
        });

        it('oppdaterer tellerinnhold ved input', () => {
            const field = createField(`
                <ix-field>
                    <label>Kommentar</label>
                    <textarea maxlength="200"></textarea>
                    <span data-field="error"></span>
                </ix-field>
            `);
            const textarea = field.querySelector('textarea')!;
            const counter = field.querySelector('[data-field="char-count"]')!;

            textarea.value = 'Hei';
            textarea.dispatchEvent(new Event('input'));

            expect(counter.textContent).toBe('3/200');
        });

        it('fungerer med input-element og maxlength', () => {
            const field = createField(`
                <ix-field>
                    <label>Navn</label>
                    <input maxlength="50" />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const counter = field.querySelector('[data-field="char-count"]');
            expect(counter).not.toBeNull();
            expect(counter?.textContent).toBe('0/50');
        });

        it('kobler fra input-lytter i disconnectedCallback', () => {
            const field = createField(`
                <ix-field>
                    <label>Kommentar</label>
                    <textarea maxlength="100"></textarea>
                    <span data-field="error"></span>
                </ix-field>
            `);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tilgang til privat felt for aa teste cleanup
            expect((field as any)._charCountListener).not.toBeNull();
            field.remove();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tilgang til privat felt for aa teste cleanup
            expect((field as any)._charCountListener).toBeNull();
        });

        it('oppretter char-count naar maxlength settes etter connectedCallback (React-timing)', async () => {
            const field = createField(`
                <ix-field>
                    <label>Kommentar</label>
                    <textarea></textarea>
                    <span data-field="error"></span>
                </ix-field>
            `);
            const textarea = field.querySelector('textarea')!;

            // Ingen teller ennaa — attributtet er ikke satt
            expect(field.querySelector('[data-field="char-count"]')).toBeNull();

            // React setter attributtet etter mounting
            textarea.setAttribute('maxlength', '200');
            await new Promise((r) => setTimeout(r, 0));

            const counter = field.querySelector('[data-field="char-count"]');
            expect(counter).not.toBeNull();
            expect(counter?.textContent).toBe('0/200');
            expect(textarea.getAttribute('aria-describedby')).toContain(counter!.id);
        });
    });

    describe('aria-label advarsel', () => {
        it('advarer naar label mangler og aria-label ikke er satt', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            createField(`
                <ix-field>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('tilgjengelig navn'));
            warnSpy.mockRestore();
        });

        it('advarer ikke naar label finnes', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            createField(`
                <ix-field>
                    <label>Navn</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining('tilgjengelig navn'));
            warnSpy.mockRestore();
        });

        it('advarer ikke naar aria-label er satt paa kontrollen', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            createField(`
                <ix-field>
                    <input aria-label="Søk" />
                    <span data-field="error"></span>
                </ix-field>
            `);
            expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining('tilgjengelig navn'));
            warnSpy.mockRestore();
        });

        it('advarer ikke naar aria-labelledby er satt paa kontrollen', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            createField(`
                <ix-field>
                    <input aria-labelledby="ekstern-label" />
                    <span data-field="error"></span>
                </ix-field>
            `);
            expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining('tilgjengelig navn'));
            warnSpy.mockRestore();
        });
    });

    describe('manglende delelementer', () => {
        it('logger info naar input mangler', () => {
            const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
            createField(`
                <ix-field>
                    <label>Uten input</label>
                </ix-field>
            `);
            expect(infoSpy).toHaveBeenCalledWith(
                expect.stringContaining('Fant ingen')
            );
            infoSpy.mockRestore();
        });

        it('advarer ved type="number"', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            createField(`
                <ix-field>
                    <label>Antall</label>
                    <input type="number" />
                    <span data-field="error"></span>
                </ix-field>
            `);
            expect(warnSpy).toHaveBeenCalledWith(
                expect.stringContaining('type="number"')
            );
            warnSpy.mockRestore();
        });
    });

    describe('ulike native kontroller', () => {
        it('fungerer med checkbox der label omslutter input', () => {
            const field = createField(`
                <ix-field>
                    <div class="ix-checkbox">
                        <label>
                            <input type="checkbox" />
                            <span data-field="indicator"></span>
                            Godta vilkår
                        </label>
                        <span data-field="error"></span>
                    </div>
                </ix-field>
            `);
            const input = field.querySelector('input')!;
            const label = field.querySelector('label')!;
            const error = field.querySelector('[data-field="error"]')!;

            // ID genereres automatisk
            expect(input.id).toMatch(/^ix-field-\d+$/);
            // label.htmlFor settes (selv om implicit wrapping allerede virker)
            expect(label.htmlFor).toBe(input.id);
            // aria-describedby kobles til error-elementet
            expect(input.getAttribute('aria-describedby')).toBe(error.id);
            // aria-live settes av ix-field
            expect(error.getAttribute('aria-live')).toBe('polite');
        });

        it('synkroniserer aria-invalid for checkbox via MutationObserver', async () => {
            const field = createField(`
                <ix-field>
                    <div class="ix-checkbox">
                        <label>
                            <input type="checkbox" />
                            <span data-field="indicator"></span>
                            Godta vilkår
                        </label>
                        <span data-field="error"></span>
                    </div>
                </ix-field>
            `);
            const input = field.querySelector('input')!;
            const error = field.querySelector('[data-field="error"]')!;

            expect(input.hasAttribute('aria-invalid')).toBe(false);

            error.textContent = 'Du må godta vilkårene';
            await new Promise((r) => setTimeout(r, 0));
            expect(input.getAttribute('aria-invalid')).toBe('true');

            error.textContent = '';
            await new Promise((r) => setTimeout(r, 0));
            expect(input.hasAttribute('aria-invalid')).toBe(false);
        });

        it('fungerer med select-element', () => {
            const field = createField(`
                <ix-field>
                    <label>Velg land</label>
                    <select>
                        <option>Norge</option>
                    </select>
                    <span data-field="error"></span>
                </ix-field>
            `);
            const select = field.querySelector('select')!;
            const label = field.querySelector('label')!;
            expect(select.id).toMatch(/^ix-field-\d+$/);
            expect(label.htmlFor).toBe(select.id);
        });

        it('fungerer med textarea-element', () => {
            const field = createField(`
                <ix-field>
                    <label>Kommentar</label>
                    <textarea></textarea>
                    <span data-field="error"></span>
                </ix-field>
            `);
            const textarea = field.querySelector('textarea')!;
            const label = field.querySelector('label')!;
            expect(textarea.id).toMatch(/^ix-field-\d+$/);
            expect(label.htmlFor).toBe(textarea.id);
        });
    });

    describe('formatering', () => {
        // Skjult rå-mirror finnes ved siden av synlig input når feltet har name.
        const mirror = (field: HTMLElement): HTMLInputElement | null => field.querySelector('input[type="hidden"]');

        describe('live (innebygde varianter)', () => {
            it('seeder synlig input formatert, mirror holder rå (data-format="phone")', () => {
                const field = createField(`
                    <ix-field>
                        <label>Telefon</label>
                        <input name="tlf" data-format="phone" value="12345678" />
                        <span data-field="error"></span>
                    </ix-field>
                `);
                const input = field.querySelector('input')!;
                expect(input.value).toBe('123 45 678');
                expect(mirror(field)!.value).toBe('12345678');
            });

            it('navnejuggling: synlig får ${name}_formatted, mirror får opprinnelig name', () => {
                const field = createField(`
                    <ix-field>
                        <label>Telefon</label>
                        <input name="tlf" data-format="phone" value="12345678" />
                        <span data-field="error"></span>
                    </ix-field>
                `);
                const input = field.querySelector('input')!;
                expect(input.getAttribute('name')).toBe('tlf_formatted');
                expect(mirror(field)!.name).toBe('tlf');
            });

            it('formaterer i selve inputen mens man skriver, mirror holder rå', () => {
                const field = createField(`
                    <ix-field>
                        <label>Telefon</label>
                        <input name="tlf" data-format="phone" value="" />
                        <span data-field="error"></span>
                    </ix-field>
                `);
                const input = field.querySelector('input')!;
                input.value = '12345678';
                input.setSelectionRange(8, 8);
                input.dispatchEvent(new Event('input'));
                expect(input.value).toBe('123 45 678');
                expect(mirror(field)!.value).toBe('12345678');
            });

            it('viser alt — masker ikke: en bokstav i et sifferfelt bevares', () => {
                const field = createField(`
                    <ix-field>
                        <label>Telefon</label>
                        <input name="tlf" data-format="phone" value="" />
                        <span data-field="error"></span>
                    </ix-field>
                `);
                const input = field.querySelector('input')!;
                input.value = '1234567a';
                input.setSelectionRange(8, 8);
                input.dispatchEvent(new Event('input'));
                // Bokstaven legges verbatim på slutten; rå bevarer den for validering.
                expect(input.value).toBe('123 45 67a');
                expect(mirror(field)!.value).toBe('1234567a');
            });

            it('caret plasseres etter riktig antall signifikante tegn', () => {
                const field = createField(`
                    <ix-field>
                        <label>Telefon</label>
                        <input name="tlf" data-format="phone" value="" />
                        <span data-field="error"></span>
                    </ix-field>
                `);
                const input = field.querySelector('input')!;
                // Skriv 4 siffer, caret etter tallet 4 (posisjon 4 i "1234").
                input.value = '1234';
                input.setSelectionRange(4, 4);
                input.dispatchEvent(new Event('input'));
                // "123 4" — 4 signifikante tegn før caret ⇒ posisjon 5 (etter '4').
                expect(input.value).toBe('123 4');
                expect(input.selectionStart).toBe(5);
            });

            it('caret hopper forbi den auto-innsatte separatoren når en gruppe fylles', () => {
                const field = createField(`
                    <ix-field>
                        <label>Telefon</label>
                        <input name="tlf" data-format="phone" value="" />
                        <span data-field="error"></span>
                    </ix-field>
                `);
                const input = field.querySelector('input')!;
                // Fyll første gruppe (3 siffer) → separatoren dukker opp med én gang.
                input.value = '123';
                input.setSelectionRange(3, 3);
                input.dispatchEvent(new InputEvent('input', { inputType: 'insertText' }));
                // "123 " — caret skal stå ETTER mellomrommet (posisjon 4), klar for
                // neste siffer, ikke foran det ("123|").
                expect(input.value).toBe('123 ');
                expect(input.selectionStart).toBe(4);
            });

            it('caret fanges ikke bak separatoren ved sletting (backspace)', () => {
                const field = createField(`
                    <ix-field>
                        <label>Telefon</label>
                        <input name="tlf" data-format="phone" value="" />
                        <span data-field="error"></span>
                    </ix-field>
                `);
                const input = field.querySelector('input')!;
                // Etterlikn backspace fra "123 4": brukeren sletter '4', caret på 4.
                input.value = '123 ';
                input.setSelectionRange(4, 4);
                input.dispatchEvent(new InputEvent('input', { inputType: 'deleteContentBackward' }));
                // Ved sletting hopper vi IKKE forbi separatoren — caret blir stående på
                // 3 (foran mellomrommet), så neste backspace når det siste sifferet.
                expect(input.value).toBe('123 ');
                expect(input.selectionStart).toBe(3);
            });
        });

        describe('blur (egen ikke-live formatter)', () => {
            it('seeder formatert, viser rå ved fokus, formatert ved blur', () => {
                const field = createField(`
                    <ix-field>
                        <label>Dato</label>
                        <input name="dato" data-format-pattern="00.00.0000" value="24122026" />
                        <span data-field="error"></span>
                    </ix-field>
                `);
                const input = field.querySelector('input')!;
                // Ufokusert ved kabling ⇒ formatert.
                expect(input.value).toBe('24.12.2026');
                expect(mirror(field)!.value).toBe('24122026');

                input.focus();
                input.dispatchEvent(new Event('focus'));
                expect(input.value).toBe('24122026');

                input.blur();
                input.dispatchEvent(new Event('blur'));
                expect(input.value).toBe('24.12.2026');
            });

            it('mirror holder rå mens man skriver (fokusert)', () => {
                const field = createField(`
                    <ix-field>
                        <label>Dato</label>
                        <input name="dato" data-format-pattern="00.00.0000" value="" />
                        <span data-field="error"></span>
                    </ix-field>
                `);
                const input = field.querySelector('input')!;
                input.focus();
                input.dispatchEvent(new Event('focus'));
                input.value = '24122026';
                input.dispatchEvent(new Event('input'));
                expect(mirror(field)!.value).toBe('24122026');
            });
        });

        describe('data-format-live (per-felt override)', () => {
            it('data-format-live="false" tvinger en innebygd (live) variant til blur', () => {
                const field = createField(`
                    <ix-field>
                        <label>Telefon</label>
                        <input name="tlf" data-format="phone" data-format-live="false" value="12345678" />
                        <span data-field="error"></span>
                    </ix-field>
                `);
                const input = field.querySelector('input')!;
                // Blur-modus: ufokusert ⇒ formatert, fokus ⇒ rå.
                expect(input.value).toBe('123 45 678');
                input.focus();
                input.dispatchEvent(new Event('focus'));
                expect(input.value).toBe('12345678');
            });

            it('data-format-live tvinger en egen (blur) pattern til live', () => {
                const field = createField(`
                    <ix-field>
                        <label>Dato</label>
                        <input name="dato" data-format-pattern="00.00.0000" data-format-live value="" />
                        <span data-field="error"></span>
                    </ix-field>
                `);
                const input = field.querySelector('input')!;
                // Live-modus: formaterer i inputen mens man skriver, uten fokus-bytte.
                input.value = '2412';
                input.setSelectionRange(4, 4);
                input.dispatchEvent(new Event('input'));
                // Begge grupper fulle ⇒ separator dukker opp med én gang etter måneden.
                expect(input.value).toBe('24.12.');
                expect(mirror(field)!.value).toBe('2412');
            });

            it('endring av data-format-live re-kabler modus', async () => {
                const field = createField(`
                    <ix-field>
                        <label>Telefon</label>
                        <input name="tlf" data-format="phone" value="12345678" />
                        <span data-field="error"></span>
                    </ix-field>
                `);
                const input = field.querySelector('input')!;
                input.setAttribute('data-format-live', 'false');
                await Promise.resolve();
                input.focus();
                input.dispatchEvent(new Event('focus'));
                // Nå blur ⇒ rå ved fokus.
                expect(input.value).toBe('12345678');
            });
        });

        describe('mirror & name', () => {
            it('uten name: ingen mirror, men rawValue gir rå (parse av synlig)', () => {
                const field = createField(`
                    <ix-field>
                        <label>Telefon</label>
                        <input data-format="phone" value="12345678" />
                        <span data-field="error"></span>
                    </ix-field>
                `);
                expect(mirror(field)).toBeNull();
                expect(field.rawValue).toBe('12345678');
            });

            it('mirror.disabled følger kontrollens disabled', () => {
                const field = createField(`
                    <ix-field>
                        <label>Telefon</label>
                        <input name="tlf" data-format="phone" value="12345678" />
                        <span data-field="error"></span>
                    </ix-field>
                `);
                const input = field.querySelector('input')!;
                expect(mirror(field)!.disabled).toBe(false);
                input.disabled = true;
                // _stateObserver speiler disabled til mirror.
                return Promise.resolve().then(() => {
                    expect(mirror(field)!.disabled).toBe(true);
                });
            });

            it('rawValue leser mirror', () => {
                const field = createField(`
                    <ix-field>
                        <label>Telefon</label>
                        <input name="tlf" data-format="phone" value="12345678" />
                        <span data-field="error"></span>
                    </ix-field>
                `);
                expect(field.rawValue).toBe('12345678');
            });

            it('rawValue er tom streng uten aktiv formatter', () => {
                const field = createField(`
                    <ix-field>
                        <label>Vanlig</label>
                        <input value="12345678" />
                        <span data-field="error"></span>
                    </ix-field>
                `);
                expect(field.rawValue).toBe('');
            });
        });

        it('formatter-property har høyest presedens', () => {
            const field = createField(`
                <ix-field>
                    <label>Egendefinert</label>
                    <input value="abc" />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const input = field.querySelector('input')!;
            field.formatter = {
                format: (raw) => raw.toUpperCase(),
                parse: (display) => display.toLowerCase(),
            };
            // Objekt-formatter uten live-flagg ⇒ blur; ufokusert ⇒ formatert i input.
            expect(input.value).toBe('ABC');
            expect(field.rawValue).toBe('abc');
        });

        it('advarer ved ukjent data-format', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            createField(`
                <ix-field>
                    <label>Ukjent</label>
                    <input data-format="finnes-ikke" value="123" />
                    <span data-field="error"></span>
                </ix-field>
            `);
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Ukjent data-format'));
            warnSpy.mockRestore();
        });

        it('gjør ingenting uten formatter (uendret oppførsel, ingen mirror)', () => {
            const field = createField(`
                <ix-field>
                    <label>Vanlig</label>
                    <input name="vanlig" value="12345678" />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const input = field.querySelector('input')!;
            expect(input.value).toBe('12345678');
            expect(input.getAttribute('name')).toBe('vanlig');
            expect(mirror(field)).toBeNull();
        });

        it('refreshFormat(raw) reformaterer live-input fra rå prop-verdi (controlled)', () => {
            const field = createField(`
                <ix-field>
                    <label>Telefon</label>
                    <input name="tlf" data-format="phone" value="12345678" />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const input = field.querySelector('input')!;
            expect(input.value).toBe('123 45 678');

            // Simuler at React skriver ny rå prop-verdi ved re-render.
            field.refreshFormat('87654321');
            expect(input.value).toBe('876 54 321');
            expect(mirror(field)!.value).toBe('87654321');
        });

        it('refreshFormat() er en no-op uten aktiv formatter', () => {
            const field = createField(`
                <ix-field>
                    <label>Vanlig</label>
                    <input value="12345678" />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const input = field.querySelector('input')!;
            expect(() => field.refreshFormat()).not.toThrow();
            expect(input.value).toBe('12345678');
        });

        it('rydder opp mirror, name og lyttere i disconnectedCallback', () => {
            const field = createField(`
                <ix-field>
                    <label>Telefon</label>
                    <input name="tlf" data-format="phone" value="12345678" />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const input = field.querySelector('input')!;
            expect(mirror(field)).not.toBeNull();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tilgang til privat felt for aa teste cleanup
            expect((field as any)._formatTeardown).not.toBeNull();

            field.remove();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tilgang til privat felt for aa teste cleanup
            expect((field as any)._formatTeardown).toBeNull();
            // Mirror fjernet, name gjenopprettet, synlig input tilbake til rå.
            expect(field.querySelector('input[type="hidden"]')).toBeNull();
            expect(input.getAttribute('name')).toBe('tlf');
            expect(input.value).toBe('12345678');
        });
    });

    describe('tooltip-knapp', () => {
        it('injiserer tooltip-knapp naar tooltip-attributt er satt', () => {
            const field = createField(`
                <ix-field tooltip="Hjelpetekst">
                    <label>Navn</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const btn = field.querySelector('.ix-field__tooltip-btn');
            expect(btn).not.toBeNull();
            expect(btn!.getAttribute('data-tooltip')).toBe('Hjelpetekst');
        });

        it('setter ikke aria-label paa knappen naar tooltip-label mangler', () => {
            const field = createField(`
                <ix-field tooltip="Hjelpetekst">
                    <label>Navn</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const btn = field.querySelector('.ix-field__tooltip-btn');
            expect(btn!.hasAttribute('aria-label')).toBe(false);
        });

        it('bruker tooltip-label-attributt som aria-label', () => {
            const field = createField(`
                <ix-field tooltip="Hjelpetekst" tooltip-label="More information">
                    <label>Name</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const btn = field.querySelector('.ix-field__tooltip-btn');
            expect(btn!.getAttribute('aria-label')).toBe('More information');
        });

        it('wrapper label i label-row', () => {
            const field = createField(`
                <ix-field tooltip="Hjelpetekst">
                    <label>Navn</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            const labelRow = field.querySelector('.ix-field__label-row');
            expect(labelRow).not.toBeNull();
            expect(labelRow!.querySelector('label')).not.toBeNull();
            expect(labelRow!.querySelector('.ix-field__tooltip-btn')).not.toBeNull();
        });

        it('oppdaterer knapp ved endring av tooltip-attributt', async () => {
            const field = createField(`
                <ix-field tooltip="Gammel tekst">
                    <label>Navn</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            field.setAttribute('tooltip', 'Ny tekst');
            await Promise.resolve();
            const btn = field.querySelector('.ix-field__tooltip-btn');
            expect(btn!.getAttribute('data-tooltip')).toBe('Ny tekst');
        });

        it('fjerner tooltip-knapp naar tooltip-attributt fjernes, men beholder label-row', async () => {
            const field = createField(`
                <ix-field tooltip="Hjelpetekst">
                    <label>Navn</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            field.removeAttribute('tooltip');
            await Promise.resolve();
            expect(field.querySelector('.ix-field__tooltip-btn')).toBeNull();
            expect(field.querySelector('.ix-field__label-row')).not.toBeNull();
        });

        it('oppretter alltid label-row for label, selv uten tooltip', () => {
            const field = createField(`
                <ix-field>
                    <label>Navn</label>
                    <input />
                    <span data-field="error"></span>
                </ix-field>
            `);
            expect(field.querySelector('.ix-field__label-row')).not.toBeNull();
            expect(field.querySelector('.ix-field__tooltip-btn')).toBeNull();
        });
    });
});
