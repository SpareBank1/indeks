import { describe, expect, it, afterEach, vi } from 'vitest';
import { IxPopover } from './IxPopover';

if (!customElements.get('ix-popover')) {
    customElements.define('ix-popover', IxPopover);
}

function mount(html: string): IxPopover {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
    return wrapper.querySelector('ix-popover')!;
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('IxPopover', () => {
    it('setter opp ARIA-koblinger ved connectedCallback', () => {
        const el = mount(`
            <ix-popover>
                <button>Trigger</button>
                <div class="ix-popover__content">
                    <p>Innhold</p>
                </div>
            </ix-popover>
        `);

        const trigger = el.querySelector('button')!;
        const content = el.querySelector('.ix-popover__content')!;

        expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        expect(trigger.getAttribute('aria-controls')).toBe(content.id);
        expect(content.getAttribute('role')).toBe('dialog');
        expect(content.hidden).toBe(true);
    });

    it('genererer unik id på content hvis ikke satt', () => {
        const el1 = mount(`
            <ix-popover>
                <button>Trigger</button>
                <div class="ix-popover__content">Innhold</div>
            </ix-popover>
        `);

        const el2 = mount(`
            <ix-popover>
                <button>Trigger 2</button>
                <div class="ix-popover__content">Innhold 2</div>
            </ix-popover>
        `);

        const content1 = el1.querySelector('.ix-popover__content')!;
        const content2 = el2.querySelector('.ix-popover__content')!;

        expect(content1.id).toMatch(/^ix-popover-content-\d+$/);
        expect(content2.id).toMatch(/^ix-popover-content-\d+$/);
        expect(content1.id).not.toBe(content2.id);
    });

    it('respekterer eksisterende id på content', () => {
        const el = mount(`
            <ix-popover>
                <button>Trigger</button>
                <div class="ix-popover__content" id="min-popover">Innhold</div>
            </ix-popover>
        `);

        const content = el.querySelector('.ix-popover__content')!;
        expect(content.id).toBe('min-popover');
    });

    it('åpner popover ved klikk på trigger', () => {
        const el = mount(`
            <ix-popover>
                <button>Trigger</button>
                <div class="ix-popover__content">Innhold</div>
            </ix-popover>
        `);

        const trigger = el.querySelector('button')!;
        const content = el.querySelector('.ix-popover__content')!;

        trigger.click();

        expect(el.hasAttribute('data-open')).toBe(true);
        expect(el.hasAttribute('open')).toBe(true);
        expect(trigger.getAttribute('aria-expanded')).toBe('true');
        expect(content.hidden).toBe(false);
    });

    it('lukker popover ved andre klikk på trigger', () => {
        const el = mount(`
            <ix-popover>
                <button>Trigger</button>
                <div class="ix-popover__content">Innhold</div>
            </ix-popover>
        `);

        const trigger = el.querySelector('button')!;

        trigger.click();
        expect(el.hasAttribute('open')).toBe(true);

        trigger.click();
        expect(el.hasAttribute('open')).toBe(false);
    });

    it('lukker popover ved Escape', () => {
        const el = mount(`
            <ix-popover>
                <button>Trigger</button>
                <div class="ix-popover__content">Innhold</div>
            </ix-popover>
        `);

        const trigger = el.querySelector('button')!;
        const content = el.querySelector('.ix-popover__content')!;

        trigger.click();
        expect(el.hasAttribute('open')).toBe(true);

        content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

        expect(el.hasAttribute('open')).toBe(false);
    });

    it('dispatcher open og close events', () => {
        const el = mount(`
            <ix-popover>
                <button>Trigger</button>
                <div class="ix-popover__content">Innhold</div>
            </ix-popover>
        `);

        const openSpy = vi.fn();
        const closeSpy = vi.fn();

        el.addEventListener('open', openSpy);
        el.addEventListener('close', closeSpy);

        const trigger = el.querySelector('button')!;

        trigger.click();
        expect(openSpy).toHaveBeenCalledTimes(1);

        trigger.click();
        expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('dispatcher open-request/close-request i kontrollert modus', () => {
        const el = mount(`
            <ix-popover data-controlled>
                <button>Trigger</button>
                <div class="ix-popover__content">Innhold</div>
            </ix-popover>
        `);

        const openRequestSpy = vi.fn();
        const closeRequestSpy = vi.fn();

        el.addEventListener('open-request', openRequestSpy);
        el.addEventListener('close-request', closeRequestSpy);

        const trigger = el.querySelector('button')!;

        trigger.click();
        expect(openRequestSpy).toHaveBeenCalledTimes(1);
        expect(el.hasAttribute('open')).toBe(false);

        el.setAttribute('open', '');
        trigger.click();
        expect(closeRequestSpy).toHaveBeenCalledTimes(1);
    });

    it('rydder opp event listeners i disconnectedCallback', () => {
        const el = mount(`
            <ix-popover>
                <button>Trigger</button>
                <div class="ix-popover__content">Innhold</div>
            </ix-popover>
        `);

        const trigger = el.querySelector('button')!;

        trigger.click();
        expect(el.hasAttribute('open')).toBe(true);

        el.remove();

        const newEl = mount(`
            <ix-popover>
                <button>Ny trigger</button>
                <div class="ix-popover__content">Nytt innhold</div>
            </ix-popover>
        `);

        const newTrigger = newEl.querySelector('button')!;
        newTrigger.click();
        expect(newEl.hasAttribute('open')).toBe(true);
    });

    it('setter data-placement på content', () => {
        const el = mount(`
            <ix-popover placement="bottom">
                <button>Trigger</button>
                <div class="ix-popover__content">Innhold</div>
            </ix-popover>
        `);

        const trigger = el.querySelector('button')!;
        const content = el.querySelector('.ix-popover__content')!;

        trigger.click();

        expect(content.hasAttribute('data-placement')).toBe(true);
    });

    it('logger warning når delelementer mangler', () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        mount(`<ix-popover></ix-popover>`);

        if (import.meta.env.DEV) {
            expect(spy).toHaveBeenCalledWith(expect.stringContaining('[ix-popover]'));
        }

        spy.mockRestore();
    });

    it('åpner popover ved Enter på trigger', () => {
        const el = mount(`
            <ix-popover>
                <button>Trigger</button>
                <div class="ix-popover__content">Innhold</div>
            </ix-popover>
        `);

        const trigger = el.querySelector('button')!;

        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

        expect(el.hasAttribute('open')).toBe(true);
    });

    it('åpner popover ved Space på trigger', () => {
        const el = mount(`
            <ix-popover>
                <button>Trigger</button>
                <div class="ix-popover__content">Innhold</div>
            </ix-popover>
        `);

        const trigger = el.querySelector('button')!;

        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

        expect(el.hasAttribute('open')).toBe(true);
    });

    it('remount fungerer uten dupliserte listeners', () => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <ix-popover>
                <button>Trigger</button>
                <div class="ix-popover__content">Innhold</div>
            </ix-popover>
        `;
        document.body.appendChild(wrapper);

        const el = wrapper.querySelector('ix-popover')!;
        const trigger = el.querySelector('button')!;

        el.remove();

        wrapper.appendChild(el);

        trigger.click();
        expect(el.hasAttribute('open')).toBe(true);

        trigger.click();
        expect(el.hasAttribute('open')).toBe(false);
    });

    it('synkroniserer open-attributt med intern tilstand', () => {
        const el = mount(`
            <ix-popover>
                <button>Trigger</button>
                <div class="ix-popover__content">Innhold</div>
            </ix-popover>
        `);

        el.setAttribute('open', '');

        expect(el.hasAttribute('data-open')).toBe(true);

        el.removeAttribute('open');

        expect(el.hasAttribute('data-open')).toBe(false);
    });
});
