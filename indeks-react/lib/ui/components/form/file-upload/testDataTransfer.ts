// jsdom mangler DataTransfer og validerer at input.files er en ekte FileList.
// Shim: bygg en ekte jsdom-FileList ved å mutere impl-en (en Array-subklasse)
// bak en fersk file-input. Impl-symbolet finnes uten å importere jsdom-internals
// ved å lete opp det symbolet på et File-objekt hvis verdi er et impl.
function implSymbolFor(obj: object): symbol | null {
    for (const sym of Object.getOwnPropertySymbols(obj)) {
        const value = (obj as unknown as Record<symbol, unknown>)[sym];
        if (value && typeof value === 'object' && value.constructor?.name?.endsWith('Impl')) {
            return sym;
        }
    }
    return null;
}

export function installDataTransferShim(): void {
    if (typeof (globalThis as unknown as { DataTransfer?: unknown }).DataTransfer !== 'undefined') return;

    const probe = document.createElement('input');
    probe.type = 'file';
    const symbol = implSymbolFor(probe.files as unknown as object);
    if (!symbol) throw new Error('Fant ikke jsdom impl-symbol på FileList — shim kan ikke settes opp.');

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
            const impl = (fl as unknown as Record<symbol, File[]>)[symbol!];
            for (const f of this._files) impl.push((f as unknown as Record<symbol, File>)[symbol!]);
            return fl;
        }
    }
    (globalThis as unknown as { DataTransfer: unknown }).DataTransfer = ShimDataTransfer;
}
