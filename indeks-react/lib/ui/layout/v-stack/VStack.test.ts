import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VStack } from './VStack';

describe('VStack', () => {
    it('renders ix-stack without vertical attribute for default start align', () => {
        const { container } = render(VStack({ children: 'test' }) as never);
        const el = container.firstElementChild!;
        expect(el.tagName.toLowerCase()).toBe('ix-stack');
        expect(el.hasAttribute('vertical')).toBe(false);
    });

    it('sets vertical="center" when align is center', () => {
        const { container } = render(VStack({ align: 'center', children: 'test' }) as never);
        expect(container.firstElementChild!.getAttribute('vertical')).toBe('center');
    });

    it('sets vertical="end" when align is end', () => {
        const { container } = render(VStack({ align: 'end', children: 'test' }) as never);
        expect(container.firstElementChild!.getAttribute('vertical')).toBe('end');
    });

    it('sets gap attribute when gap is provided', () => {
        const { container } = render(VStack({ gap: 'lg', children: 'test' }) as never);
        expect(container.firstElementChild!.getAttribute('gap')).toBe('lg');
    });

    it('forwards extra className', () => {
        const { container } = render(VStack({ className: 'custom', children: 'test' }) as never);
        expect(container.firstElementChild!.classList).toContain('custom');
    });

    describe('with as prop', () => {
        it('renders the given element instead of ix-stack', () => {
            const { container } = render(VStack({ as: 'ul', children: 'test' }) as never);
            expect(container.firstElementChild!.tagName.toLowerCase()).toBe('ul');
        });

        it('uses CSS classes instead of attributes', () => {
            const { container } = render(VStack({ as: 'ul', children: 'test' }) as never);
            const el = container.firstElementChild!;
            expect(el.hasAttribute('vertical')).toBe(false);
            expect(el.classList).toContain('ix-stack');
        });

        it('applies no extra align class for default start', () => {
            const { container } = render(VStack({ as: 'ul', children: 'test' }) as never);
            const classList = Array.from(container.firstElementChild!.classList);
            expect(classList.some((c) => c.includes('vertical'))).toBe(false);
        });

        it('applies align class for center', () => {
            const { container } = render(VStack({ as: 'ul', align: 'center', children: 'test' }) as never);
            expect(container.firstElementChild!.classList).toContain('ix-stack-vertical-center');
        });

        it('applies gap class when gap is provided', () => {
            const { container } = render(VStack({ as: 'ul', gap: 'sm', children: 'test' }) as never);
            expect(container.firstElementChild!.classList).toContain('ix-gap-sm');
        });

        it('forwards extra className', () => {
            const { container } = render(VStack({ as: 'ul', className: 'custom', children: 'test' }) as never);
            expect(container.firstElementChild!.classList).toContain('custom');
        });
    });
});
