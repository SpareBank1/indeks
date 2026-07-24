import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { useId, useState } from 'react';

import { Button, Modal } from '@sb1/indeks-react';

/**
 * Modal viser innhold i et dialogvindu som krever brukerens oppmerksomhet.
 *
 * Storyene her er **interaktive og realistiske**: hver viser en trigger-knapp som
 * åpner den ekte modalen med native `showModal()` — med dempet bakgrunn
 * (`::backdrop`), top-layer-rendering, fokus-trap og Escape-lukking. En
 * `play`-funksjon klikker knappen automatisk, slik at skjermbildetesten fanger
 * den åpne, sentrerte dialogen (ikke bare et inline dialog-kort).
 *
 * Fordi en `showModal()`-dialog males i browserens **top layer** — sentrert i
 * viewporten, ikke inne i story-containeren — er storyene tagget `top-layer`, som
 * ber testharnessen ta skjermbilde av hele siden. Det finnes bare én top layer per
 * dokument, så lys og mørk modus kan ikke vises samtidig; hver story låser derfor
 * ett tema via `globals.scheme` (`Standard` = lys, `Mørk modus` = mørk).
 *
 * Gi alltid en `Modal.Title`: den navngir dialogen for skjermlesere via
 * `aria-labelledby` (WCAG 1.3.1). All tekst (tittel, lukk-knapp, handlinger)
 * sendes inn av konsumenten og skal oversettes (i18n).
 */
const meta = {
    title: 'Components/Modal',
    component: Modal,
    // `top-layer`: modalen males utenfor #stories-container, så harnessen tar
    // skjermbilde av hele siden. `autodocs`: props-tabell.
    tags: ['top-layer', 'autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Bruk `open` + `onOpenChange` i appen. Eksemplene under åpnes ved klikk og viser den ekte modalen med dempet bakgrunn.',
            },
        },
    },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Klikk-utløst modal: en trigger-knapp åpner den ekte `Modal`-komponenten via
 * `showModal()` (styrt av `open`-state). `Modal` er kontrollert, så `useState` er
 * nødvendig — determinismen for skjermbildet sikres av `play`-funksjonen (som
 * åpner dialogen) og `prefers-reduced-motion: reduce` (som fjerner animasjonen).
 */
function ModalDemo({
    triggerLabel,
    title,
    body,
    footer,
}: {
    triggerLabel: string;
    title: string;
    body: React.ReactNode;
    // Footer får en `close`-callback så handlingsknappene (Avbryt/Slett osv.)
    // faktisk lukker dialogen når de klikkes — som i en ekte app.
    footer: (close: () => void) => React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);
    return (
        <>
            <Button aria-haspopup="dialog" onClick={() => setOpen(true)}>
                {triggerLabel}
            </Button>

            <Modal open={open} onOpenChange={setOpen}>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                    <Modal.CloseButton label="Lukk" />
                </Modal.Header>
                <Modal.Body>{body}</Modal.Body>
                <Modal.Footer>
                    <Modal.ButtonGroup>{footer(close)}</Modal.ButtonGroup>
                </Modal.Footer>
            </Modal>
        </>
    );
}

/** Klikker trigger-knappen og venter til den native dialogen faktisk er åpen. */
function openModalPlay(triggerName: string) {
    return async ({ canvasElement }: { canvasElement: HTMLElement }) => {
        const canvas = within(canvasElement);
        await userEvent.click(canvas.getByRole('button', { name: triggerName }));
        await waitFor(() => {
            expect(canvasElement.ownerDocument.querySelector('dialog.ix-modal[open]')).toBeTruthy();
        });
    };
}

/** Standard bekreftelsesdialog (medium bredde) i lys modus. */
export const Standard: Story = {
    globals: { scheme: 'light' },
    render: () => (
        <ModalDemo
            triggerLabel="Slett element"
            title="Bekreft sletting"
            body={<p>Er du sikker på at du vil slette dette elementet? Handlingen kan ikke angres.</p>}
            footer={(close) => (
                <>
                    <Button variant="secondary" onClick={close}>
                        Avbryt
                    </Button>
                    <Button danger onClick={close}>
                        Slett
                    </Button>
                </>
            )}
        />
    ),
    play: openModalPlay('Slett element'),
};

/** Samme dialog i mørk modus — modalen arver tema fra `.ix-scheme-dark`-wrapperen. */
export const DarkMode: Story = {
    name: 'Mørk modus',
    globals: { scheme: 'dark' },
    render: () => (
        <ModalDemo
            triggerLabel="Slett element"
            title="Bekreft sletting"
            body={<p>Er du sikker på at du vil slette dette elementet? Handlingen kan ikke angres.</p>}
            footer={(close) => (
                <>
                    <Button variant="secondary" onClick={close}>
                        Avbryt
                    </Button>
                    <Button danger onClick={close}>
                        Slett
                    </Button>
                </>
            )}
        />
    ),
    play: openModalPlay('Slett element'),
};

/**
 * Ren HTML med native `<dialog>` og atferds-modulet fra `@sb1/indeks-web`.
 * Trigger-knappen åpner via `data-modal-open` (peker på dialogens `id`) og lukk-
 * knappene lukker via `data-modal-close`. Backdrop-klikk lukker som standard.
 * Ingen React — kun native `<dialog>` + CSS + web-modulet.
 */
export const HTML: Story = {
    globals: { scheme: 'light' },
    render: function HtmlStory() {
        const dialogId = useId();
        const titleId = useId();
        return (
            <div>
                <button
                    className="ix-button"
                    data-variant="primary"
                    data-modal-open={dialogId}
                    aria-haspopup="dialog"
                    aria-controls={dialogId}
                >
                    Åpne dialog
                </button>
                <dialog id={dialogId} className="ix-modal" aria-labelledby={titleId}>
                    <div className="ix-modal__header">
                        <h2 className="ix-modal__title" id={titleId}>
                            Ren HTML
                        </h2>
                        <button className="ix-modal__close" aria-label="Lukk" data-modal-close>
                            <ix-icon name="close" />
                        </button>
                    </div>
                    <div className="ix-modal__body">
                        <p>
                            Fungerer uten React — kun native &lt;dialog&gt; + CSS + atferds-modulet.
                        </p>
                    </div>
                    <div className="ix-modal__footer">
                        <div className="ix-modal__button-group">
                            <button className="ix-button" data-variant="secondary" data-modal-close>
                                Lukk
                            </button>
                        </div>
                    </div>
                </dialog>
            </div>
        );
    },
    play: openModalPlay('Åpne dialog'),
};
