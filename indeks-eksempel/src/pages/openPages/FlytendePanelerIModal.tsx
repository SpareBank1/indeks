import { Button, Combobox, DropdownMenu, Heading, Modal, Popover, Text, VStack } from '@sb1/indeks-react';
import { useState } from 'react';

/*
 * Datagrunnlag for e2e-testen `modal-flytende-paneler.spec.ts`.
 *
 * De flytende panelene i Indeks (combobox-liste, dropdown-meny, popover) er
 * `position: fixed` og posisjoneres med rå viewport-koordinater fra
 * getBoundingClientRect(). Skaper en ancestor en containing block for
 * `position: fixed`, tolker nettleseren de koordinatene relativt til ancestoren i
 * stedet for viewporten, og panelet havner forskjøvet.
 *
 * `.ix-modal[open]` gjorde nettopp det: `transform: scale(1)` sto igjen som
 * hvileverdi etter åpne-animasjonen. Siden alle tre panelene deler mekanismen,
 * dekker denne siden alle tre — ikke bare combobox der feilen ble oppdaget.
 *
 * Jsdom har ingen layout, så dette kan ikke enhetstestes; det må kjøres i en
 * ekte nettleser.
 */

const landOptions = [
    { value: 'no', label: 'Norge' },
    { value: 'se', label: 'Sverige' },
    { value: 'dk', label: 'Danmark' },
    { value: 'fi', label: 'Finland' },
    { value: 'is', label: 'Island' },
];

export default function FlytendePanelerIModal() {
    const [open, setOpen] = useState(false);

    return (
        <div className="ix-p-md">
            <VStack gap="md">
                <Heading as="h1" size="xl">
                    Flytende paneler i modal
                </Heading>
                <Text long>
                    Åpne modalen og åpne panelene inni den. Hvert panel skal ligge inntil sin egen
                    trigger, ikke forskjøvet ned og til høyre.
                </Text>

                <div>
                    <Button aria-haspopup="dialog" onClick={() => setOpen(true)}>
                        Åpne modal
                    </Button>
                </div>
            </VStack>

            <Modal open={open} onOpenChange={setOpen} closeOnBackdropClick={false}>
                <Modal.Header>
                    <Modal.Title>Paneler i modal</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <VStack gap="lg">
                        <Combobox
                            label="Land"
                            placeholder="Søk etter land"
                            options={landOptions}
                            noHitsText="Ingen treff"
                            toggleLabel="Vis land"
                            resultsText="land funnet"
                        />

                        <div>
                            <DropdownMenu>
                                <DropdownMenu.Trigger>
                                    <Button variant="secondary">Handlinger</Button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content>
                                    <DropdownMenu.Item>Rediger</DropdownMenu.Item>
                                    <DropdownMenu.Item>Dupliser</DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu>
                        </div>

                        <div>
                            <Popover placement="bottom">
                                <Popover.Trigger>
                                    <Button variant="tertiary">Hva betyr dette?</Button>
                                </Popover.Trigger>
                                <Popover.Content>
                                    <Popover.Heading>Forklaring</Popover.Heading>
                                    <Popover.Body>Panelet skal peke på triggeren sin.</Popover.Body>
                                </Popover.Content>
                            </Popover>
                        </div>
                    </VStack>
                </Modal.Body>

                <Modal.Footer>
                    <Modal.ButtonGroup>
                        <Button variant="secondary" onClick={() => setOpen(false)}>
                            Lukk
                        </Button>
                    </Modal.ButtonGroup>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
