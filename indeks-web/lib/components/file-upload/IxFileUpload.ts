/**
 * IxFileUpload — DOM-generator for filopplasting med to varianter:
 * kompakt (knapp, standard) og dropzone (dra-og-slipp-flate).
 *
 * ## Designfilosofi
 *
 * Forfatteren skriver kun host + en native `<input type="file">` i light DOM.
 * Komponenten genererer resten av den visuelle strukturen: en trigger-knapp
 * (kompakt) eller en dropzone-flate (dropzone), en fil-liste med fjern-knapper,
 * og en visuelt skjult polite live-region. Den native inputen forblir
 * sannhetskilden for `<form>`-submit — komponenten muterer aldri en egen
 * JS-tilstand, kun `input.files` via `DataTransfer`.
 *
 * ## Hvorfor DOM-generator (ikke ARIA-lim)
 *
 * Den indre strukturen (knapp, dropzone, fil-liste, live-region) er rent
 * instrumentell/visuell — forfatteren trenger ikke tilpasse den. Det eneste
 * semantiske elementet forfatteren eier er `<input type="file">`, som gir gratis
 * tastatur, skjermleser og form-submit. Dropzonen er en ren museforbedring
 * (OS-filer kan ikke dras inn via tastatur), så den fokuserbare knappen inni er
 * tilgjengelighetsveien — dropzone-`<div>`-en gjøres aldri tastatur-operabel.
 *
 * ## Validering
 *
 * `accept` (på inputen) lar browseren filtrere filvelgeren. `data-max-size`
 * (bytes) håndheves av komponenten: filer over grensen avvises, `input.files`
 * bygges om uten dem, og `error-too-large` (m/ `{name}`-plassholder) skrives til
 * nærmeste `[data-field="error"]` i `ix-field`-forelderen. `ix-field` sin
 * MutationObserver setter da `aria-invalid`.
 *
 * ## Annonsering (går lenger enn referansesystemene)
 *
 * En egen visuelt skjult `aria-live="polite"`-region annonserer «X lagt til» /
 * «X fjernet» via `added-label`/`removed-label` (m/ `{name}`-plassholder). Dette
 * er separat fra `ix-field`s error-region (som er for feil).
 *
 * ## Delelementer (data-field, generert av komponenten)
 *   - input[type="file"]              → sannhetskilde (skjules visuelt av CSS)
 *   - [data-field="trigger"]          → knapp (kompakt + inni dropzone)
 *   - [data-field="dropzone"]         → dra-og-slipp-flate (kun dropzone)
 *   - [data-field="dropzone-icon"]    → dekorativt ikon (aria-hidden)
 *   - [data-field="dropzone-hint"]    → dekorativ instruksjonstekst (aria-hidden)
 *   - [data-field="file-list"]        → <ul> med valgte filer
 *   - [data-field="file-item"]        → <li> per fil
 *   - [data-field="file-name"]        → filnavn
 *   - [data-field="file-size"]        → formatert størrelse
 *   - [data-field="file-remove"]      → fjern-knapp per fil
 *   - [data-field="announce"]         → skjult polite live-region
 *
 * @example Kompakt (standard)
 * <ix-field>
 *   <label class="ix-label">Vedlegg</label>
 *   <ix-file-upload trigger-label="Velg fil" remove-label="Fjern"
 *                   added-label="{name} lagt til" removed-label="{name} fjernet">
 *     <input type="file" name="vedlegg" multiple />
 *   </ix-file-upload>
 *   <span data-field="error"></span>
 * </ix-field>
 */

// Modul-teller for stabile, unike IDer på tvers av instanser.
let fileUploadCounter = 0;

export class IxFileUpload extends HTMLElement {
    private _instanceId = 0;

    // Cachede delelementer
    private _input: HTMLInputElement | null = null;
    private _trigger: HTMLButtonElement | null = null;
    private _dropzone: HTMLElement | null = null;
    private _list: HTMLElement | null = null;
    private _announce: HTMLElement | null = null;

    // Filnavn fra forrige render — brukes for å annonsere hvilke som ble lagt til.
    private _prevNames: string[] = [];
    // Siste feiltekst komponenten selv skrev — så vi kun rydder vår egen
    // maxSize-feil og aldri en errorMessage-prop skrevet av forelderen.
    private _lastError: string | null = null;
    // Første render (mount) annonserer ikke: forhåndsvalgte filer skal ikke leses opp.
    private _firstRender = true;

    // Cleanup-referanser
    private _onInputChange: (() => void) | null = null;
    private _onTriggerClick: (() => void) | null = null;
    private _onListClick: ((e: MouseEvent) => void) | null = null;
    private _onDragOver: ((e: DragEvent) => void) | null = null;
    private _onDragLeave: ((e: DragEvent) => void) | null = null;
    private _onDrop: ((e: DragEvent) => void) | null = null;

    static get observedAttributes(): string[] {
        return ['data-variant'];
    }

    connectedCallback(): void {
        this._instanceId = ++fileUploadCounter;
        this._wire();
    }

    disconnectedCallback(): void {
        const input = this._input;
        if (input && this._onInputChange) input.removeEventListener('change', this._onInputChange);
        if (this._trigger && this._onTriggerClick) this._trigger.removeEventListener('click', this._onTriggerClick);
        if (this._list && this._onListClick) this._list.removeEventListener('click', this._onListClick as EventListener);
        const dropzone = this._dropzone;
        if (dropzone) {
            if (this._onDragOver) dropzone.removeEventListener('dragover', this._onDragOver as EventListener);
            if (this._onDragLeave) dropzone.removeEventListener('dragleave', this._onDragLeave as EventListener);
            if (this._onDrop) dropzone.removeEventListener('drop', this._onDrop as EventListener);
        }

        this._onInputChange = null;
        this._onTriggerClick = null;
        this._onListClick = null;
        this._onDragOver = null;
        this._onDragLeave = null;
        this._onDrop = null;
        this._input = null;
        this._trigger = null;
        this._dropzone = null;
        this._list = null;
        this._announce = null;
    }

    attributeChangedCallback(name: string, _oldValue: string | null, _newValue: string | null): void {
        if (!this.isConnected) return;
        if (name === 'data-variant') {
            // Bytt trigger↔dropzone-UI: bygg den genererte strukturen på nytt.
            this._teardownGenerated();
            this._wire();
        }
    }

    // ── Egenskaper ──────────────────────────────────────────────────────────

    private get _variant(): 'compact' | 'dropzone' {
        return this.getAttribute('data-variant') === 'dropzone' ? 'dropzone' : 'compact';
    }

    private get _maxSize(): number {
        const raw = this.getAttribute('data-max-size');
        if (!raw) return 0;
        const n = Number(raw);
        return Number.isFinite(n) && n > 0 ? n : 0;
    }

    // ── Oppkobling ────────────────────────────────────────────────────────────

    private _wire(): void {
        const input = this.querySelector<HTMLInputElement>('input[type="file"]');
        if (!input) {
            console.info('[ix-file-upload] Fant ingen <input type="file">. Komponenten er ikke aktiv.');
            return;
        }
        this._input = input;

        if (import.meta.env.DEV && !this.getAttribute('trigger-label')) {
            console.warn('[ix-file-upload] Mangler trigger-label (React: triggerLabel). Knappen får ingen tekst på riktig språk.');
        }
        if (import.meta.env.DEV && this._variant === 'dropzone' && !this.getAttribute('dropzone-label')) {
            console.warn('[ix-file-upload] Mangler dropzone-label (React: dropzoneLabel) for dropzone-varianten.');
        }
        if (import.meta.env.DEV && !this.getAttribute('remove-label')) {
            console.warn('[ix-file-upload] Mangler remove-label (React: removeLabel). Fjern-knappene får ingen tilgjengelig tekst.');
        }

        // Bygg trigger-knappen (finnes i begge varianter).
        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.setAttribute('data-field', 'trigger');
        trigger.textContent = this.getAttribute('trigger-label') ?? '';
        this._trigger = trigger;

        // Klikk på trigger → åpne native filvelger.
        this._onTriggerClick = () => {
            if (!input.disabled) input.click();
        };
        trigger.addEventListener('click', this._onTriggerClick);

        if (this._variant === 'dropzone') {
            const dropzone = document.createElement('div');
            dropzone.setAttribute('data-field', 'dropzone');

            const icon = document.createElement('span');
            icon.setAttribute('data-field', 'dropzone-icon');
            icon.setAttribute('aria-hidden', 'true');
            dropzone.appendChild(icon);

            const hint = this.getAttribute('dropzone-label');
            if (hint) {
                const hintEl = document.createElement('span');
                hintEl.setAttribute('data-field', 'dropzone-hint');
                hintEl.setAttribute('aria-hidden', 'true');
                hintEl.textContent = hint;
                dropzone.appendChild(hintEl);
            }

            dropzone.appendChild(trigger);
            this._dropzone = dropzone;
            input.after(dropzone);

            this._wireDragAndDrop(dropzone, input);
        } else {
            input.after(trigger);
        }

        // Fil-liste (<ul>) — plasseres etter trigger/dropzone.
        const list = document.createElement('ul');
        list.setAttribute('data-field', 'file-list');
        this._list = list;
        (this._dropzone ?? trigger).after(list);

        // Klikk-delegasjon for fjern-knapper.
        this._onListClick = (e: MouseEvent) => this._handleListClick(e);
        list.addEventListener('click', this._onListClick as EventListener);

        // Skjult polite live-region for lagt til / fjernet.
        const announce = document.createElement('div');
        announce.className = 'ix-sr-only';
        announce.setAttribute('data-field', 'announce');
        announce.setAttribute('aria-live', 'polite');
        announce.id = `ix-file-upload-announce-${this._instanceId}`;
        list.after(announce);
        this._announce = announce;

        // Lytt på endringer i utvalget.
        this._onInputChange = () => this._renderList();
        input.addEventListener('change', this._onInputChange);

        // Render eventuelle forhåndsvalgte filer (SSR/programmert utvalg).
        this._renderList();
    }

    // Fjern kun den genererte strukturen (ikke input) — brukes ved variant-bytte.
    private _teardownGenerated(): void {
        const input = this._input;
        if (input && this._onInputChange) input.removeEventListener('change', this._onInputChange);
        if (this._trigger && this._onTriggerClick) this._trigger.removeEventListener('click', this._onTriggerClick);
        if (this._list && this._onListClick) this._list.removeEventListener('click', this._onListClick as EventListener);
        const dropzone = this._dropzone;
        if (dropzone) {
            if (this._onDragOver) dropzone.removeEventListener('dragover', this._onDragOver as EventListener);
            if (this._onDragLeave) dropzone.removeEventListener('dragleave', this._onDragLeave as EventListener);
            if (this._onDrop) dropzone.removeEventListener('drop', this._onDrop as EventListener);
        }
        this._trigger?.remove();
        this._dropzone?.remove();
        this._list?.remove();
        this._announce?.remove();
        this.removeAttribute('data-dragging');

        this._trigger = null;
        this._dropzone = null;
        this._list = null;
        this._announce = null;
        this._onInputChange = null;
        this._onTriggerClick = null;
        this._onListClick = null;
        this._onDragOver = null;
        this._onDragLeave = null;
        this._onDrop = null;
    }

    // ── Dra-og-slipp (kun dropzone; museforbedring) ───────────────────────────

    private _wireDragAndDrop(dropzone: HTMLElement, input: HTMLInputElement): void {
        this._onDragOver = (e: DragEvent) => {
            if (input.disabled) return;
            e.preventDefault();
            this.setAttribute('data-dragging', '');
        };
        this._onDragLeave = (e: DragEvent) => {
            // Ignorer dragleave når peker går til et barn inne i dropzonen.
            if (e.relatedTarget && dropzone.contains(e.relatedTarget as Node)) return;
            this.removeAttribute('data-dragging');
        };
        this._onDrop = (e: DragEvent) => {
            e.preventDefault();
            this.removeAttribute('data-dragging');
            if (input.disabled) return;
            const dropped = e.dataTransfer?.files;
            if (dropped && dropped.length > 0) this._addFiles(dropped);
        };
        dropzone.addEventListener('dragover', this._onDragOver as EventListener);
        dropzone.addEventListener('dragleave', this._onDragLeave as EventListener);
        dropzone.addEventListener('drop', this._onDrop as EventListener);
    }

    // Slå sammen slupne filer med eksisterende utvalg (respekterer multiple).
    private _addFiles(dropped: FileList): void {
        const input = this._input;
        if (!input) return;
        const dt = new DataTransfer();
        if (input.multiple) {
            for (const f of Array.from(input.files ?? [])) dt.items.add(f);
            for (const f of Array.from(dropped)) dt.items.add(f);
        } else {
            // Single: kun siste fil.
            dt.items.add(dropped[dropped.length - 1]);
        }
        input.files = dt.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // ── Fil-liste ───────────────────────────────────────────────────────────

    private _renderList(): void {
        const input = this._input;
        const list = this._list;
        if (!input || !list) return;

        // maxSize-validering: avvis for store filer og bygg input.files om.
        const tooLarge = this._enforceMaxSize();

        const files = Array.from(input.files ?? []);
        list.textContent = '';
        const removeLabel = this.getAttribute('remove-label') ?? '';

        for (const [index, file] of files.entries()) {
            const item = document.createElement('li');
            item.setAttribute('data-field', 'file-item');

            const name = document.createElement('span');
            name.setAttribute('data-field', 'file-name');
            name.textContent = file.name;
            item.appendChild(name);

            const size = document.createElement('span');
            size.setAttribute('data-field', 'file-size');
            size.textContent = this._formatSize(file.size);
            item.appendChild(size);

            const remove = document.createElement('button');
            remove.type = 'button';
            remove.setAttribute('data-field', 'file-remove');
            remove.setAttribute('data-index', String(index));
            // aria-label på knappen (ikke ikonet): «Fjern, filnavn».
            remove.setAttribute('aria-label', removeLabel ? `${removeLabel} ${file.name}` : file.name);
            item.appendChild(remove);

            list.appendChild(item);
        }

        // Annonser filer som er nye siden forrige render (picker- eller drop-utvalg).
        // Fjerning annonseres separat i _removeAt (der produseres ingen tillegg).
        // Multiset-diff: én konsumerbar kopi av forrige utvalg, fjern treff per navn.
        const names = files.map((f) => f.name);
        const prev = this._prevNames.slice();
        const added: string[] = [];
        for (const name of names) {
            const i = prev.indexOf(name);
            if (i === -1) added.push(name);
            else prev.splice(i, 1);
        }
        this._prevNames = names;
        if (added.length > 0 && !this._firstRender) this._announceText('added-label', added.join(', '));
        this._firstRender = false;

        if (tooLarge.length > 0) this._setError(tooLarge);
        else this._clearError();
    }

    // Håndhever data-max-size: fjerner for store filer fra input.files og
    // returnerer navnene som ble avvist. No-op uten grense.
    private _enforceMaxSize(): string[] {
        const input = this._input;
        const max = this._maxSize;
        if (!input || max <= 0) return [];
        const files = Array.from(input.files ?? []);
        const tooLarge = files.filter((f) => f.size > max);
        if (tooLarge.length === 0) return [];

        const dt = new DataTransfer();
        for (const f of files) if (f.size <= max) dt.items.add(f);
        input.files = dt.files;
        return tooLarge.map((f) => f.name);
    }

    private _setError(names: string[]): void {
        const field = this.closest('ix-field');
        const error = field?.querySelector<HTMLElement>('[data-field="error"]');
        if (!error) return;
        const template = this.getAttribute('error-too-large');
        if (!template) return;
        const text = names.map((name) => template.replace('{name}', name)).join(' ');
        error.textContent = text;
        this._lastError = text;
    }

    // Rydd feilregionen, men kun hvis komponenten selv skrev den (maxSize).
    // Rører aldri en errorMessage-prop skrevet av forelderen.
    private _clearError(): void {
        if (this._lastError === null) return;
        const field = this.closest('ix-field');
        const error = field?.querySelector<HTMLElement>('[data-field="error"]');
        if (error && error.textContent === this._lastError) error.textContent = '';
        this._lastError = null;
    }

    private _handleListClick(e: MouseEvent): void {
        const target = e.target as HTMLElement;
        const btn = target.closest<HTMLElement>('[data-field="file-remove"]');
        if (!btn || !this._list?.contains(btn)) return;
        const index = Number(btn.getAttribute('data-index'));
        if (Number.isNaN(index)) return;
        this._removeAt(index);
    }

    // Fjern fil ved indeks: bygg input.files om via DataTransfer (holder native
    // utvalg synk for form-submit uten JS-state).
    private _removeAt(index: number): void {
        const input = this._input;
        if (!input) return;
        const files = Array.from(input.files ?? []);
        const removed = files[index];
        if (!removed) return;
        const dt = new DataTransfer();
        files.forEach((f, i) => {
            if (i !== index) dt.items.add(f);
        });
        input.files = dt.files;
        this._renderList();
        this._announceText('removed-label', removed.name);

        // Flytt fokus etter fjerning så tastaturbrukeren ikke mister plassen:
        // neste fjern-knapp, ellers forrige, ellers trigger.
        const remaining = this._list?.querySelectorAll<HTMLButtonElement>('[data-field="file-remove"]');
        if (remaining && remaining.length > 0) {
            (remaining[index] ?? remaining[remaining.length - 1]).focus();
        } else {
            this._trigger?.focus();
        }
    }

    // ── Annonsering ───────────────────────────────────────────────────────────

    private _announceText(attr: 'added-label' | 'removed-label', name: string): void {
        const el = this._announce;
        if (!el) return;
        const template = this.getAttribute(attr);
        if (!template) return;
        el.textContent = template.replace('{name}', name);
    }

    // ── Størrelsesformatering (språknøytrale enheter) ─────────────────────────

    private _formatSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        const kb = bytes / 1024;
        if (kb < 1024) return `${Math.round(kb)} kB`;
        const mb = kb / 1024;
        return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
    }
}
