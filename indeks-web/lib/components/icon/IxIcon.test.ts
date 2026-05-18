import { afterEach, describe, expect, it } from 'vitest';
import { IxIcon } from './IxIcon';

if (!customElements.get('ix-icon')) {
    customElements.define('ix-icon', IxIcon);
}

function createIcon(html: string): IxIcon {
    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
    return div.querySelector('ix-icon')!;
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('IxIcon', () => {
    describe('--ii-icon-url', () => {
        it('setter --ii-icon-url naar name er satt', () => {
            const icon = createIcon(`<ix-icon name="hjem"></ix-icon>`);
            expect(icon.style.getPropertyValue('--ii-icon-url')).toContain('home.svg');
        });

        it('setter --ii-icon-url naar materialdesignname er satt', () => {
            const icon = createIcon(`<ix-icon materialdesignname="menu"></ix-icon>`);
            expect(icon.style.getPropertyValue('--ii-icon-url')).toContain('menu.svg');
        });

        it('fjerner --ii-icon-url naar verken name eller materialdesignname er satt', () => {
            const icon = createIcon(`<ix-icon></ix-icon>`);
            expect(icon.style.getPropertyValue('--ii-icon-url')).toBe('');
        });

        it('oppdaterer --ii-icon-url naar name-attributt endres', () => {
            const icon = createIcon(`<ix-icon name="hjem"></ix-icon>`);
            icon.setAttribute('name', 'meny');
            expect(icon.style.getPropertyValue('--ii-icon-url')).toContain('menu.svg');
        });
    });

    describe('data-size', () => {
        it('setter data-size="sm" naar size="sm"', () => {
            const icon = createIcon(`<ix-icon name="hjem" size="sm"></ix-icon>`);
            expect(icon.getAttribute('data-size')).toBe('sm');
        });

        it('setter ikke data-size naar size="md"', () => {
            const icon = createIcon(`<ix-icon name="hjem" size="md"></ix-icon>`);
            expect(icon.hasAttribute('data-size')).toBe(false);
        });

        it('setter ikke data-size naar size mangler', () => {
            const icon = createIcon(`<ix-icon name="hjem"></ix-icon>`);
            expect(icon.hasAttribute('data-size')).toBe(false);
        });

        it('oppdaterer data-size naar size-attributt endres', () => {
            const icon = createIcon(`<ix-icon name="hjem" size="sm"></ix-icon>`);
            icon.setAttribute('size', 'lg');
            expect(icon.getAttribute('data-size')).toBe('lg');
        });

        it('fjerner data-size naar size endres til md', () => {
            const icon = createIcon(`<ix-icon name="hjem" size="sm"></ix-icon>`);
            icon.setAttribute('size', 'md');
            expect(icon.hasAttribute('data-size')).toBe(false);
        });
    });

    describe('tilgjengelighet', () => {
        it('setter aria-hidden="true" som standard', () => {
            const icon = createIcon(`<ix-icon name="hjem"></ix-icon>`);
            expect(icon.getAttribute('aria-hidden')).toBe('true');
            expect(icon.hasAttribute('role')).toBe(false);
        });

        it('setter role="img" og fjerner aria-hidden naar aria-label er satt', () => {
            const icon = createIcon(`<ix-icon name="hjem" aria-label="Gå til forsiden"></ix-icon>`);
            expect(icon.getAttribute('role')).toBe('img');
            expect(icon.hasAttribute('aria-hidden')).toBe(false);
        });

        it('gaar tilbake til aria-hidden naar aria-label fjernes', () => {
            const icon = createIcon(`<ix-icon name="hjem" aria-label="Gå til forsiden"></ix-icon>`);
            icon.removeAttribute('aria-label');
            expect(icon.getAttribute('aria-hidden')).toBe('true');
            expect(icon.hasAttribute('role')).toBe(false);
        });
    });
});
