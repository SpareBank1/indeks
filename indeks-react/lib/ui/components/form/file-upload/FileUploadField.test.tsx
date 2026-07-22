import { render, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { IxField, IxFileUpload } from '@sb1/indeks-web';
import { FileUploadField } from './FileUploadField';
import { installDataTransferShim } from './testDataTransfer';

if (!customElements.get('ix-field')) {
    customElements.define('ix-field', IxField);
}
if (!customElements.get('ix-file-upload')) {
    customElements.define('ix-file-upload', IxFileUpload);
}

beforeAll(() => installDataTransferShim());

function renderField(props: Partial<React.ComponentProps<typeof FileUploadField>> = {}) {
    return render(
        <FileUploadField
            label="Vedlegg"
            triggerLabel="Velg fil"
            removeLabel="Fjern"
            addedLabel="{name} lagt til"
            removedLabel="{name} fjernet"
            {...props}
        />
    );
}

function fileInput(): HTMLInputElement {
    return document.querySelector('ix-file-upload input[type="file"]')!;
}

function selectFiles(files: File[]): void {
    const input = fileInput();
    const dt = new DataTransfer();
    for (const f of files) dt.items.add(f);
    input.files = dt.files;
    fireEvent.change(input);
}

describe('FileUploadField', () => {
    it('rendrer label koblet til input via htmlFor/id', () => {
        renderField({ id: 'vedlegg' });
        const input = fileInput();
        expect(input.id).toBe('vedlegg');
        expect(document.querySelector('label')?.htmlFor).toBe('vedlegg');
    });

    it('genererer id automatisk når id ikke er satt', () => {
        renderField();
        const input = fileInput();
        expect(input.id).toBeTruthy();
        expect(document.querySelector('label')?.htmlFor).toBe(input.id);
    });

    it('setter name på den native inputen for form-submit', () => {
        renderField({ name: 'vedlegg' });
        expect(fileInput().name).toBe('vedlegg');
    });

    it('videresender accept og multiple til inputen', () => {
        renderField({ accept: '.pdf,image/*', multiple: true });
        const input = fileInput();
        expect(input.accept).toBe('.pdf,image/*');
        expect(input.multiple).toBe(true);
    });

    it('rendrer trigger-knapp i kompakt variant (standard)', () => {
        renderField();
        const trigger = document.querySelector('[data-field="trigger"]');
        expect(trigger?.textContent).toBe('Velg fil');
        expect(document.querySelector('[data-field="dropzone"]')).toBeNull();
    });

    it('rendrer dropzone når variant="dropzone"', () => {
        renderField({ variant: 'dropzone', dropzoneLabel: 'Dra hit' });
        const host = document.querySelector('ix-file-upload');
        expect(host?.getAttribute('data-variant')).toBe('dropzone');
        expect(document.querySelector('[data-field="dropzone"]')).not.toBeNull();
    });

    it('speiler disabled til inputen', () => {
        renderField({ disabled: true });
        expect(fileInput().disabled).toBe(true);
    });

    it('viser feilmelding og setter aria-invalid via ix-field', () => {
        renderField({ errorMessage: 'Noe gikk galt' });
        const error = document.querySelector('[data-field="error"]');
        expect(error?.textContent).toBe('Noe gikk galt');
        expect(fileInput().getAttribute('aria-invalid')).toBe('true');
    });

    it('rendrer valgt fil-liste og fjerner via fjern-knapp', () => {
        renderField({ multiple: true });
        selectFiles([new File(['a'], 'a.pdf'), new File(['b'], 'b.pdf')]);
        expect(document.querySelectorAll('[data-field="file-item"]')).toHaveLength(2);
        const remove = document.querySelector<HTMLButtonElement>('[data-field="file-remove"]')!;
        fireEvent.click(remove);
        expect(Array.from(fileInput().files!).map((f) => f.name)).toEqual(['b.pdf']);
    });

    it('videresender ref til den native inputen', () => {
        const ref = createRef<HTMLInputElement>();
        renderField({ ref });
        expect(ref.current).toBe(fileInput());
    });

    it('kaller onChange når filer velges', () => {
        const onChange = vi.fn();
        renderField({ onChange });
        selectFiles([new File(['a'], 'a.pdf')]);
        expect(onChange).toHaveBeenCalled();
    });
});
