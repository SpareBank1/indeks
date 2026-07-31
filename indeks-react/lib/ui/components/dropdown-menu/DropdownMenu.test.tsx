import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DropdownMenu } from './DropdownMenu';

describe('DropdownMenu', () => {
    it('rendrer uten feil', () => {
        const { container } = render(
            <DropdownMenu>
                <DropdownMenu.Trigger>
                    <button>Trigger</button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item>Item 1</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu>,
        );

        expect(container.querySelector('ix-dropdown')).toBeTruthy();
    });

    it('sender className videre til rot-element', () => {
        const { container } = render(
            <DropdownMenu className="custom-class">
                <DropdownMenu.Trigger>
                    <button>Trigger</button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item>Item</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu>,
        );

        const host = container.querySelector('ix-dropdown');
        expect(host?.classList.contains('custom-class')).toBe(true);
    });

    it('setter placement-attributt', () => {
        const { container } = render(
            <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                    <button>Trigger</button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item>Item</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu>,
        );

        const host = container.querySelector('ix-dropdown');
        expect(host?.getAttribute('placement')).toBe('bottom-end');
    });

    describe('DropdownMenu.Content', () => {
        it('rendrer med role="menu"', () => {
            const { container } = render(
                <DropdownMenu>
                    <DropdownMenu.Trigger>
                        <button>Trigger</button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item>Item</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu>,
            );

            const menu = container.querySelector('.ix-dropdown__menu');
            expect(menu).toBeTruthy();
            expect(menu?.getAttribute('role')).toBe('menu');
        });

        it('har ix-dropdown__menu-klasse', () => {
            const { container } = render(
                <DropdownMenu>
                    <DropdownMenu.Trigger>
                        <button>Trigger</button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item>Item</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu>,
            );

            expect(container.querySelector('.ix-dropdown__menu')).toBeTruthy();
        });
    });

    describe('DropdownMenu.Item', () => {
        it('rendrer med role="menuitem"', () => {
            const { container } = render(
                <DropdownMenu>
                    <DropdownMenu.Trigger>
                        <button>Trigger</button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item>Test Item</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu>,
            );

            const item = container.querySelector('.ix-dropdown__item');
            expect(item).toBeTruthy();
            expect(item?.getAttribute('role')).toBe('menuitem');
        });

        it('kaller onSelect ved klikk', () => {
            const onSelect = vi.fn();

            const { container } = render(
                <DropdownMenu>
                    <DropdownMenu.Trigger>
                        <button>Trigger</button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item onSelect={onSelect}>Click me</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu>,
            );

            const item = container.querySelector('.ix-dropdown__item')!;
            fireEvent.click(item);
            expect(onSelect).toHaveBeenCalledTimes(1);
        });

        it('setter data-danger på danger-items', () => {
            const { container } = render(
                <DropdownMenu>
                    <DropdownMenu.Trigger>
                        <button>Trigger</button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item danger>Delete</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu>,
            );

            const item = container.querySelector('.ix-dropdown__item');
            expect(item?.hasAttribute('data-danger')).toBe(true);
        });

        it('setter disabled og aria-disabled på disabled items', () => {
            const { container } = render(
                <DropdownMenu>
                    <DropdownMenu.Trigger>
                        <button>Trigger</button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item disabled>Disabled</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu>,
            );

            const item = container.querySelector('.ix-dropdown__item') as HTMLButtonElement;
            expect(item.disabled).toBe(true);
            expect(item.getAttribute('aria-disabled')).toBe('true');
        });

        it('kaller ikke onSelect når disabled', () => {
            const onSelect = vi.fn();

            const { container } = render(
                <DropdownMenu>
                    <DropdownMenu.Trigger>
                        <button>Trigger</button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item disabled onSelect={onSelect}>
                            Disabled
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu>,
            );

            const item = container.querySelector('.ix-dropdown__item')!;
            fireEvent.click(item);
            expect(onSelect).not.toHaveBeenCalled();
        });

        it('rendrer ikon når angitt', () => {
            render(
                <DropdownMenu>
                    <DropdownMenu.Trigger>
                        <button>Trigger</button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item icon={<span data-testid="icon">🔧</span>}>
                            With icon
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu>,
            );

            expect(screen.getByTestId('icon')).toBeTruthy();
        });
    });

    describe('DropdownMenu.Divider', () => {
        it('har ix-dropdown__divider-klasse', () => {
            const { container } = render(
                <DropdownMenu>
                    <DropdownMenu.Trigger>
                        <button>Trigger</button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item>Item 1</DropdownMenu.Item>
                        <DropdownMenu.Divider />
                        <DropdownMenu.Item>Item 2</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu>,
            );

            const divider = container.querySelector('.ix-dropdown__divider');
            expect(divider).toBeTruthy();
            expect(divider?.getAttribute('role')).toBe('separator');
        });
    });

    describe('DropdownMenu.Sub', () => {
        it('rendrer nøstet ix-dropdown med data-submenu', () => {
            const { container } = render(
                <DropdownMenu>
                    <DropdownMenu.Trigger>
                        <button>Trigger</button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Sub>
                            <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
                            <DropdownMenu.SubContent>
                                <DropdownMenu.Item>Sub item</DropdownMenu.Item>
                            </DropdownMenu.SubContent>
                        </DropdownMenu.Sub>
                    </DropdownMenu.Content>
                </DropdownMenu>,
            );

            const submenu = container.querySelector('ix-dropdown[data-submenu]');
            expect(submenu).toBeTruthy();
        });
    });

    describe('DropdownMenu.SubTrigger', () => {
        it('har chevron-ikon', () => {
            const { container } = render(
                <DropdownMenu>
                    <DropdownMenu.Trigger>
                        <button>Trigger</button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Sub>
                            <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
                            <DropdownMenu.SubContent>
                                <DropdownMenu.Item>Sub item</DropdownMenu.Item>
                            </DropdownMenu.SubContent>
                        </DropdownMenu.Sub>
                    </DropdownMenu.Content>
                </DropdownMenu>,
            );

            expect(container.querySelector('.ix-dropdown__chevron')).toBeTruthy();
        });

        it('har submenu-trigger-klasse', () => {
            const { container } = render(
                <DropdownMenu>
                    <DropdownMenu.Trigger>
                        <button>Trigger</button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Sub>
                            <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
                            <DropdownMenu.SubContent>
                                <DropdownMenu.Item>Sub item</DropdownMenu.Item>
                            </DropdownMenu.SubContent>
                        </DropdownMenu.Sub>
                    </DropdownMenu.Content>
                </DropdownMenu>,
            );

            expect(container.querySelector('.ix-dropdown__submenu-trigger')).toBeTruthy();
        });
    });

    describe('onOpenChange', () => {
        it('kalles med true når ix-open-event fyres', () => {
            const onOpenChange = vi.fn();

            const { container } = render(
                <DropdownMenu onOpenChange={onOpenChange}>
                    <DropdownMenu.Trigger>
                        <button>Trigger</button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item>Item</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu>,
            );

            const host = container.querySelector('ix-dropdown')!;
            host.dispatchEvent(new CustomEvent('ix-open', { bubbles: true }));

            expect(onOpenChange).toHaveBeenCalledWith(true);
        });

        it('kalles med false når ix-close-event fyres', () => {
            const onOpenChange = vi.fn();

            const { container } = render(
                <DropdownMenu onOpenChange={onOpenChange}>
                    <DropdownMenu.Trigger>
                        <button>Trigger</button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item>Item</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu>,
            );

            const host = container.querySelector('ix-dropdown')!;
            host.dispatchEvent(new CustomEvent('ix-close', { bubbles: true }));

            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });
});
