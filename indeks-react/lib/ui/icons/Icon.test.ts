import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { Icon } from './Icon';

describe('Icon', () => {
    it('sender ariaLabel-prop som aria-label-attributt', () => {
        const { container } = render(createElement(Icon, { name: 'home', ariaLabel: 'Gå til forsiden' }));
        const el = container.querySelector('ix-icon')!;
        expect(el.getAttribute('aria-label')).toBe('Gå til forsiden');
    });

    it('setter data-size-attributt for ikke-standard størrelser', () => {
        for (const size of ['sm', 'lg', 'xl'] as const) {
            const { container } = render(createElement(Icon, { name: 'home', size }));
            expect(container.querySelector('ix-icon')!.getAttribute('data-size')).toBe(size);
        }
    });

    it('utelater data-size-attributt for md (standard)', () => {
        const { container } = render(createElement(Icon, { name: 'home', size: 'md' }));
        expect(container.querySelector('ix-icon')!.hasAttribute('data-size')).toBe(false);
    });

    it('setter ix-icon-klasse', () => {
        const { container } = render(createElement(Icon, { name: 'home' }));
        expect(container.querySelector('ix-icon')!.classList.contains('ix-icon')).toBe(true);
    });
});
