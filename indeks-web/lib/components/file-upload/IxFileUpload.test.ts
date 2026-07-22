import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { IxFileUpload } from './IxFileUpload';

if (!customElements.get('ix-file-upload')) {
    customElements.define('ix-file-upload', IxFileUpload);
}

// jsdom har ingen DataTransfer og validerer at input.files er en ekte FileList.
// Shim: bygg en ekte jsdom-FileList ved å mutere impl-en (Array-subklasse) bak en
// fersk file-input. Impl-symbolet finnes uten jsdom-internals ved å lete det opp
// på File-objektet (verdien er et *Impl-objekt).
function implSymbolFor(obj: object): symbol | null {
    for (const sym of Object.getOwnPropertySymbols(obj)) {
        const value = (obj as unknown as Record<symbol, unknown>)[sym];
        if (value && typeof value === 'object' && (value as { constructor?: { name?: string } }).constructor?.name?.endsWith('Impl')) {
            return sym;
        }
    }
    return null;
}

beforeAll(() => {
    if (typeof (globalThis as unknown as { DataTransfer?: unknown }).DataTransfer !== 'undefined') return;
    const probe = document.createElement('input');
    probe.type = 'file';
    const symbol = implSymbolFor(probe.files as unknown as object);
    if (!symbol) throw new Error('Fant ikke jsdom impl-symbol på FileList.');
    class ShimDataTransfer {
        private _files: File[] = [];
        items = {
            add: (f: File): void => {
                this._files.push(f);
            },
        };
        get files(): FileList {
            const input = document.createElement('input');
            input.type = 'file';
            const fl = input.files as FileList;
            const impl = (fl as unknown as Record<symbol, File[]>)[symbol];
            for (const f of this._files) impl.push((f as unknown as Record<symbol, File>)[symbol]);
            return fl;
        }
    }
    (globalThis as unknown as { DataTransfer: unknown }).DataTransfer = ShimDataTransfer;
});

function mount(hostAttrs = '', inputAttrs = ''): { host: IxFileUpload; input: HTMLInputElement; error: HTMLElement } {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <ix-field>
      <label class="ix-label">Vedlegg</label>
      <ix-file-upload trigger-label="Velg fil" remove-label="Fjern" added-label="{name} lagt til" removed-label="{name} fjernet" ${hostAttrs}>
        <input type="file" ${inputAttrs} />
      </ix-file-upload>
      <span data-field="error"></span>
    </ix-field>`;
    document.body.appendChild(wrapper);
    return {
        host: wrapper.querySelector('ix-file-upload')!,
        input: wrapper.querySelector('input')!,
        error: wrapper.querySelector('[data-field="error"]')!,
    };
}

// Sett input.files til gitte filer via DataTransfer og fyr change (som filvelgeren).
function selectFiles(input: HTMLInputElement, files: File[]): void {
    const dt = new DataTransfer();
    for (const f of files) dt.items.add(f);
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
}

function file(name: string, size = 10): File {
    const f = new File(['x'.repeat(size)], name);
    // jsdom utleder size fra innhold; sikre eksakt size for maxSize-tester.
    Object.defineProperty(f, 'size', { value: size });
    return f;
}

function items(host: IxFileUpload): HTMLElement[] {
    return Array.from(host.querySelectorAll<HTMLElement>('[data-field="file-item"]'));
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('IxFileUpload', () => {
    describe('generert struktur', () => {
        it('genererer trigger-knapp i kompakt variant', () => {
            const { host } = mount();
            const trigger = host.querySelector<HTMLButtonElement>('[data-field="trigger"]');
            expect(trigger).not.toBeNull();
            expect(trigger!.type).toBe('button');
            expect(trigger!.textContent).toBe('Velg fil');
            expect(host.querySelector('[data-field="dropzone"]')).toBeNull();
        });

        it('genererer dropzone med ikon, hint og trigger', () => {
            const { host } = mount('data-variant="dropzone" dropzone-label="Dra filer hit"');
            const dropzone = host.querySelector('[data-field="dropzone"]');
            expect(dropzone).not.toBeNull();
            expect(dropzone!.querySelector('[data-field="dropzone-icon"]')?.getAttribute('aria-hidden')).toBe('true');
            const hint = dropzone!.querySelector('[data-field="dropzone-hint"]');
            expect(hint?.textContent).toBe('Dra filer hit');
            expect(hint?.getAttribute('aria-hidden')).toBe('true');
            expect(dropzone!.querySelector('[data-field="trigger"]')).not.toBeNull();
        });

        it('lager en tom fil-liste og en polite live-region', () => {
            const { host } = mount();
            expect(host.querySelector('[data-field="file-list"]')?.tagName).toBe('UL');
            const announce = host.querySelector('[data-field="announce"]');
            expect(announce?.getAttribute('aria-live')).toBe('polite');
            expect(announce?.classList.contains('ix-sr-only')).toBe(true);
        });

        it('logger info og gjør ingenting uten <input type="file">', () => {
            const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
            const wrapper = document.createElement('div');
            wrapper.innerHTML = `<ix-file-upload trigger-label="Velg"></ix-file-upload>`;
            document.body.appendChild(wrapper);
            expect(wrapper.querySelector('[data-field="trigger"]')).toBeNull();
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });
    });

    describe('fil-liste', () => {
        it('rendrer valgte filer med navn, størrelse og fjern-knapp', () => {
            const { host, input } = mount('', 'multiple');
            selectFiles(input, [file('rapport.pdf', 2048), file('bilde.png', 500)]);
            const list = items(host);
            expect(list).toHaveLength(2);
            expect(list[0].querySelector('[data-field="file-name"]')?.textContent).toBe('rapport.pdf');
            expect(list[0].querySelector('[data-field="file-size"]')?.textContent).toBe('2 kB');
            const remove = list[0].querySelector<HTMLButtonElement>('[data-field="file-remove"]');
            expect(remove?.getAttribute('aria-label')).toBe('Fjern rapport.pdf');
        });

        it('fjerner en fil og bygger om input.files', () => {
            const { host, input } = mount('', 'multiple');
            selectFiles(input, [file('a.pdf'), file('b.pdf'), file('c.pdf')]);
            expect(input.files).toHaveLength(3);
            const removeBtn = items(host)[1].querySelector<HTMLButtonElement>('[data-field="file-remove"]')!;
            removeBtn.click();
            expect(Array.from(input.files!).map((f) => f.name)).toEqual(['a.pdf', 'c.pdf']);
            expect(items(host)).toHaveLength(2);
        });
    });

    describe('dra-og-slipp (dropzone)', () => {
        it('setter data-dragging ved dragover og fjerner ved drop', () => {
            const { host, input } = mount('data-variant="dropzone" dropzone-label="Dra hit"', 'multiple');
            const dropzone = host.querySelector<HTMLElement>('[data-field="dropzone"]')!;
            dropzone.dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }));
            expect(host.hasAttribute('data-dragging')).toBe(true);

            const dt = new DataTransfer();
            dt.items.add(file('slipp.pdf'));
            const drop = new Event('drop', { bubbles: true, cancelable: true }) as DragEvent;
            Object.defineProperty(drop, 'dataTransfer', { value: dt });
            dropzone.dispatchEvent(drop);

            expect(host.hasAttribute('data-dragging')).toBe(false);
            expect(Array.from(input.files!).map((f) => f.name)).toEqual(['slipp.pdf']);
        });
    });

    describe('maxSize-validering', () => {
        it('avviser for store filer og skriver feiltekst', () => {
            const { host, input, error } = mount('data-max-size="1000" error-too-large="{name} er for stor"', 'multiple');
            selectFiles(input, [file('ok.pdf', 500), file('stor.pdf', 2000)]);
            expect(Array.from(input.files!).map((f) => f.name)).toEqual(['ok.pdf']);
            expect(error.textContent).toBe('stor.pdf er for stor');
            expect(items(host)).toHaveLength(1);
        });

        it('rydder egen feiltekst når det ikke lenger finnes for store filer', () => {
            const { input, error } = mount('data-max-size="1000" error-too-large="{name} er for stor"', 'multiple');
            selectFiles(input, [file('stor.pdf', 2000)]);
            expect(error.textContent).toBe('stor.pdf er for stor');
            // Nytt utvalg uten for store filer skal fjerne den utdaterte feilen.
            selectFiles(input, [file('ok.pdf', 500)]);
            expect(error.textContent).toBe('');
        });

        it('rører ikke en feiltekst forelderen har skrevet', () => {
            const { input, error } = mount('data-max-size="1000" error-too-large="{name} er for stor"', 'multiple');
            error.textContent = 'Du må legge ved minst ett vedlegg';
            selectFiles(input, [file('ok.pdf', 500)]);
            expect(error.textContent).toBe('Du må legge ved minst ett vedlegg');
        });
    });

    describe('live-region', () => {
        it('annonserer lagt til ved nytt utvalg', () => {
            const { host, input } = mount('', 'multiple');
            selectFiles(input, [file('ny.pdf')]);
            expect(host.querySelector('[data-field="announce"]')?.textContent).toBe('ny.pdf lagt til');
        });

        it('annonserer fjernet ved fjerning', () => {
            const { host, input } = mount('', 'multiple');
            selectFiles(input, [file('a.pdf'), file('b.pdf')]);
            items(host)[0].querySelector<HTMLButtonElement>('[data-field="file-remove"]')!.click();
            expect(host.querySelector('[data-field="announce"]')?.textContent).toBe('a.pdf fjernet');
        });
    });

    describe('fokushåndtering ved fjerning', () => {
        it('flytter fokus til fjern-knappen som tok den fjernedes plass', () => {
            const { host, input } = mount('', 'multiple');
            selectFiles(input, [file('a.pdf'), file('b.pdf'), file('c.pdf')]);
            items(host)[0].querySelector<HTMLButtonElement>('[data-field="file-remove"]')!.click();
            // b.pdf tok index 0; fokus skal ligge på dens fjern-knapp.
            const focused = document.activeElement as HTMLElement;
            expect(focused.getAttribute('aria-label')).toBe('Fjern b.pdf');
        });

        it('flytter fokus til trigger når siste fil fjernes', () => {
            const { host, input } = mount('', 'multiple');
            selectFiles(input, [file('a.pdf')]);
            items(host)[0].querySelector<HTMLButtonElement>('[data-field="file-remove"]')!.click();
            expect(document.activeElement).toBe(host.querySelector('[data-field="trigger"]'));
        });
    });

    describe('variant-bytte og cleanup', () => {
        it('bygger om UI ved data-variant-endring', () => {
            const { host } = mount();
            expect(host.querySelector('[data-field="dropzone"]')).toBeNull();
            host.setAttribute('data-variant', 'dropzone');
            expect(host.querySelector('[data-field="dropzone"]')).not.toBeNull();
        });

        it('rydder opp lyttere ved fjerning fra DOM', () => {
            const { host, input } = mount('', 'multiple');
            host.remove();
            // Etter fjerning skal change ikke lenger produsere fil-liste-innhold.
            selectFiles(input, [file('etter.pdf')]);
            expect(host.querySelector('[data-field="file-item"]')).toBeNull();
        });
    });

    describe('i18n-advarsler', () => {
        it('advarer i DEV når trigger-label mangler', () => {
            const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const wrapper = document.createElement('div');
            wrapper.innerHTML = `<ix-file-upload remove-label="Fjern"><input type="file" /></ix-file-upload>`;
            document.body.appendChild(wrapper);
            expect(spy).toHaveBeenCalledWith(expect.stringContaining('trigger-label'));
            spy.mockRestore();
        });
    });
});
