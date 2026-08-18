import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Popover } from './Popover';

describe('Popover', () => {
    it('rendrer uten feil', () => {
        const { container } = render(
            <Popover>
                <Popover.Trigger>
                    <button>Trigger</button>
                </Popover.Trigger>
                <Popover.Content>Innhold</Popover.Content>
            </Popover>,
        );

        expect(container.querySelector('ix-popover')).toBeTruthy();
    });

    it('sender className videre til rot-element', () => {
        const { container } = render(
            <Popover className="custom-class">
                <Popover.Trigger>
                    <button>Trigger</button>
                </Popover.Trigger>
                <Popover.Content>Innhold</Popover.Content>
            </Popover>,
        );

        const host = container.querySelector('ix-popover');
        expect(host?.classList.contains('ix-popover')).toBe(true);
        expect(host?.classList.contains('custom-class')).toBe(true);
    });

    it('setter placement-attributt', () => {
        const { container } = render(
            <Popover placement="bottom">
                <Popover.Trigger>
                    <button>Trigger</button>
                </Popover.Trigger>
                <Popover.Content>Innhold</Popover.Content>
            </Popover>,
        );

        const host = container.querySelector('ix-popover');
        expect(host?.getAttribute('placement')).toBe('bottom');
    });

    it('bruker top som default placement', () => {
        const { container } = render(
            <Popover>
                <Popover.Trigger>
                    <button>Trigger</button>
                </Popover.Trigger>
                <Popover.Content>Innhold</Popover.Content>
            </Popover>,
        );

        const host = container.querySelector('ix-popover');
        expect(host?.getAttribute('placement')).toBe('top');
    });

    it('setter data-arrow="false" når arrow={false}', () => {
        const { container } = render(
            <Popover arrow={false}>
                <Popover.Trigger>
                    <button>Trigger</button>
                </Popover.Trigger>
                <Popover.Content>Innhold</Popover.Content>
            </Popover>,
        );

        const host = container.querySelector('ix-popover');
        expect(host?.getAttribute('data-arrow')).toBe('false');
    });

    it('utelater data-arrow når arrow={true} (default)', () => {
        const { container } = render(
            <Popover>
                <Popover.Trigger>
                    <button>Trigger</button>
                </Popover.Trigger>
                <Popover.Content>Innhold</Popover.Content>
            </Popover>,
        );

        const host = container.querySelector('ix-popover');
        expect(host?.hasAttribute('data-arrow')).toBe(false);
    });

    it('setter data-controlled i kontrollert modus', () => {
        const { container } = render(
            <Popover open={false}>
                <Popover.Trigger>
                    <button>Trigger</button>
                </Popover.Trigger>
                <Popover.Content>Innhold</Popover.Content>
            </Popover>,
        );

        const host = container.querySelector('ix-popover');
        expect(host?.hasAttribute('data-controlled')).toBe(true);
    });

    it('utelater data-controlled i ukontrollert modus', () => {
        const { container } = render(
            <Popover>
                <Popover.Trigger>
                    <button>Trigger</button>
                </Popover.Trigger>
                <Popover.Content>Innhold</Popover.Content>
            </Popover>,
        );

        const host = container.querySelector('ix-popover');
        expect(host?.hasAttribute('data-controlled')).toBe(false);
    });

    it('setter open-attributt når open={true}', async () => {
        const { container } = render(
            <Popover open={true}>
                <Popover.Trigger>
                    <button>Trigger</button>
                </Popover.Trigger>
                <Popover.Content>Innhold</Popover.Content>
            </Popover>,
        );

        await vi.waitFor(() => {
            const host = container.querySelector('ix-popover');
            expect(host?.hasAttribute('open')).toBe(true);
        });
    });

    it('fjerner open-attributt når open={false}', async () => {
        const { container, rerender } = render(
            <Popover open={true}>
                <Popover.Trigger>
                    <button>Trigger</button>
                </Popover.Trigger>
                <Popover.Content>Innhold</Popover.Content>
            </Popover>,
        );

        rerender(
            <Popover open={false}>
                <Popover.Trigger>
                    <button>Trigger</button>
                </Popover.Trigger>
                <Popover.Content>Innhold</Popover.Content>
            </Popover>,
        );

        await vi.waitFor(() => {
            const host = container.querySelector('ix-popover');
            expect(host?.hasAttribute('open')).toBe(false);
        });
    });
});

describe('Popover.Trigger', () => {
    it('rendrer trigger-elementet', () => {
        render(
            <Popover>
                <Popover.Trigger>
                    <button>Klikk meg</button>
                </Popover.Trigger>
                <Popover.Content>Innhold</Popover.Content>
            </Popover>,
        );

        expect(screen.getByRole('button', { name: 'Klikk meg' })).toBeTruthy();
    });
});

describe('Popover.Content', () => {
    it('rendrer innhold med riktig klasse', () => {
        const { container } = render(
            <Popover>
                <Popover.Trigger>
                    <button>Trigger</button>
                </Popover.Trigger>
                <Popover.Content>Test-innhold</Popover.Content>
            </Popover>,
        );

        const content = container.querySelector('.ix-popover__content');
        expect(content).toBeTruthy();
        expect(content?.textContent).toBe('Test-innhold');
    });

    it('videresender className til content', () => {
        const { container } = render(
            <Popover>
                <Popover.Trigger>
                    <button>Trigger</button>
                </Popover.Trigger>
                <Popover.Content className="custom-content">Innhold</Popover.Content>
            </Popover>,
        );

        const content = container.querySelector('.ix-popover__content');
        expect(content?.classList.contains('custom-content')).toBe(true);
    });
});

describe('Popover.Heading', () => {
    it('rendrer heading med riktig klasse', () => {
        const { container } = render(
            <Popover>
                <Popover.Trigger>
                    <button>Trigger</button>
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.Heading>Overskrift</Popover.Heading>
                </Popover.Content>
            </Popover>,
        );

        const heading = container.querySelector('.ix-popover__heading');
        expect(heading).toBeTruthy();
        expect(heading?.textContent).toBe('Overskrift');
    });
});

describe('Popover.Body', () => {
    it('rendrer body med riktig klasse', () => {
        const { container } = render(
            <Popover>
                <Popover.Trigger>
                    <button>Trigger</button>
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.Body>Brødtekst</Popover.Body>
                </Popover.Content>
            </Popover>,
        );

        const body = container.querySelector('.ix-popover__body');
        expect(body).toBeTruthy();
        expect(body?.textContent).toBe('Brødtekst');
    });
});

describe('Popover.Actions', () => {
    it('rendrer actions med riktig klasse', () => {
        const { container } = render(
            <Popover>
                <Popover.Trigger>
                    <button>Trigger</button>
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.Actions>
                        <button>Handling</button>
                    </Popover.Actions>
                </Popover.Content>
            </Popover>,
        );

        const actions = container.querySelector('.ix-popover__actions');
        expect(actions).toBeTruthy();
    });
});
