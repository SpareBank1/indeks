import type { Meta, StoryObj } from '@storybook/react-vite';

import { FileUploadField } from '@sb1/indeks-react';

const meta = {
    title: 'Form/FileUploadField',
    component: FileUploadField,
    tags: ['autodocs'],
    args: {
        label: 'Vedlegg',
        triggerLabel: 'Velg fil',
        removeLabel: 'Fjern',
        addedLabel: '{name} lagt til',
        removedLabel: '{name} fjernet',
        multiple: true,
    },
} satisfies Meta<typeof FileUploadField>;

export default meta;
type Story = StoryObj<typeof meta>;

// Legg inn noen filer i den native inputen etter render (File finnes kun i
// nettleseren, ikke i args). Brukes av MedFiler.
async function selectSampleFiles(canvasElement: HTMLElement): Promise<void> {
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]');
    if (!input) return;
    const dt = new DataTransfer();
    dt.items.add(new File(['%PDF-1.4 ...'], 'kontrakt.pdf', { type: 'application/pdf' }));
    dt.items.add(new File(['fake-image-bytes'], 'kvittering.png', { type: 'image/png' }));
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
}

export const Standard: Story = {};

export const Dropzone: Story = {
    args: {
        variant: 'dropzone',
        dropzoneLabel: 'Dra og slipp filer her, eller',
    },
};

export const MedFiler: Story = {
    play: async ({ canvasElement }) => {
        await selectSampleFiles(canvasElement);
    },
};

export const MedBeskrivelse: Story = {
    args: {
        description: 'PDF eller bilde, maks 5 MB per fil',
        accept: '.pdf,image/*',
        maxSize: 5_242_880,
        errorTooLarge: '{name} er for stor (maks 5 MB)',
    },
};

export const MedFeilmelding: Story = {
    args: {
        errorMessage: 'Du må legge ved minst ett vedlegg',
    },
};

/**
 * Disabled-elementer er unntatt fra WCAG 1.4.3 kontrastkrav.
 */
export const Deaktivert: Story = {
    args: {
        disabled: true,
    },
};

export const HTML: Story = {
    render: () => (
        <ix-field>
            <label htmlFor="vedlegg-html">Vedlegg</label>
            <ix-file-upload
                class="ix-file-upload"
                trigger-label="Velg fil"
                remove-label="Fjern"
                added-label="{name} lagt til"
                removed-label="{name} fjernet"
            >
                <input id="vedlegg-html" type="file" name="vedlegg" multiple />
            </ix-file-upload>
            <span data-field="error" />
        </ix-field>
    ),
};
