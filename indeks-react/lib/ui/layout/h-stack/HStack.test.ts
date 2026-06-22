import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HStack } from './HStack';

describe('HStack', () => {
    it('renders ix-stack with horizontal attribute', () => {
        const { container } = render(HStack({ children: 'test' }) as never);
        const el = container.firstElementChild!;
        expect(el.tagName.toLowerCase()).toBe('ix-stack');
        expect(el.hasAttribute('horizontal')).toBe(true);
    });

    it('sets horizontal="start" when align is start', () => {
        const { container } = render(HStack({ align: 'start', children: 'test' }) as never);
        expect(container.firstElementChild!.getAttribute('horizontal')).toBe('start');
    });

    it('sets horizontal="end" when align is end', () => {
        const { container } = render(HStack({ align: 'end', children: 'test' }) as never);
        expect(container.firstElementChild!.getAttribute('horizontal')).toBe('end');
    });

    it('sets gap attribute when gap is provided', () => {
        const { container } = render(HStack({ gap: 'md', children: 'test' }) as never);
        expect(container.firstElementChild!.getAttribute('gap')).toBe('md');
    });

    it('forwards extra className', () => {
        const { container } = render(HStack({ className: 'custom', children: 'test' }) as never);
        expect(container.firstElementChild!.classList).toContain('custom');
    });

    describe('with as prop', () => {
        it('renders the given element instead of ix-stack', () => {
            const { container } = render(HStack({ as: 'nav', children: 'test' }) as never);
            expect(container.firstElementChild!.tagName.toLowerCase()).toBe('nav');
        });

        it('uses CSS classes instead of attributes', () => {
            const { container } = render(HStack({ as: 'nav', children: 'test' }) as never);
            const el = container.firstElementChild!;
            expect(el.hasAttribute('horizontal')).toBe(false);
            expect(el.classList).toContain('ix-stack-horizontal');
        });

        it('applies align class for start', () => {
            const { container } = render(HStack({ as: 'nav', align: 'start', children: 'test' }) as never);
            expect(container.firstElementChild!.classList).toContain('ix-stack-horizontal-start');
        });

        it('applies gap class when gap is provided', () => {
            const { container } = render(HStack({ as: 'nav', gap: 'lg', children: 'test' }) as never);
            expect(container.firstElementChild!.classList).toContain('ix-gap-lg');
        });

        it('forwards extra className', () => {
            const { container } = render(HStack({ as: 'nav', className: 'custom', children: 'test' }) as never);
            expect(container.firstElementChild!.classList).toContain('custom');
        });
    });
});
