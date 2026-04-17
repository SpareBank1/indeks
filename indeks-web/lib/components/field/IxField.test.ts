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
});
