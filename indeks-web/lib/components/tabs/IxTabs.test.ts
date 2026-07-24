import { describe, expect, it, afterEach, vi } from 'vitest';
import { IxTabs, IxTabList, IxTab, IxTabPanel } from './IxTabs';

if (!customElements.get('ix-tabs')) {
    customElements.define('ix-tabs', IxTabs);
    customElements.define('ix-tab-list', IxTabList);
    customElements.define('ix-tab', IxTab);
    customElements.define('ix-tab-panel', IxTabPanel);
}

function mount(html: string): IxTabs {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
    return wrapper.querySelector('ix-tabs')!;
}

const BASIC = `
    <ix-tabs>
        <ix-tab-list>
            <ix-tab>Oversikt</ix-tab>
            <ix-tab>Detaljer</ix-tab>
            <ix-tab>Historikk</ix-tab>
        </ix-tab-list>
        <ix-tab-panel>Oversikt-innhold</ix-tab-panel>
        <ix-tab-panel>Detaljer-innhold</ix-tab-panel>
        <ix-tab-panel>Historikk-innhold</ix-tab-panel>
    </ix-tabs>
`;

function tabs(el: IxTabs): HTMLElement[] {
    return Array.from(el.querySelectorAll<HTMLElement>('ix-tab'));
}
function panels(el: IxTabs): HTMLElement[] {
    return Array.from(el.querySelectorAll<HTMLElement>('ix-tab-panel'));
}

function keydown(target: HTMLElement, key: string): void {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('IxTabs — roller og struktur', () => {
    it('setter tablist/tab/tabpanel-roller', () => {
        const el = mount(BASIC);
        expect(el.querySelector('ix-tab-list')!.getAttribute('role')).toBe('tablist');
        expect(el.querySelector('ix-tab-list')!.getAttribute('aria-orientation')).toBe('horizontal');
        for (const tab of tabs(el)) expect(tab.getAttribute('role')).toBe('tab');
        for (const panel of panels(el)) expect(panel.getAttribute('role')).toBe('tabpanel');
    });

    it('kobler aria-controls (fane→panel) og aria-labelledby (panel→fane)', () => {
        const el = mount(BASIC);
        const [t0, t1] = tabs(el);
        const [p0, p1] = panels(el);
        expect(t0.getAttribute('aria-controls')).toBe(p0.id);
        expect(p0.getAttribute('aria-labelledby')).toBe(t0.id);
        expect(t1.getAttribute('aria-controls')).toBe(p1.id);
        expect(p1.getAttribute('aria-labelledby')).toBe(t1.id);
    });

    it('kobler fane til panel via delt data-value (ikke posisjon)', () => {
        // Panelene står i motsatt rekkefølge av fanene — kun data-value knytter dem.
        const el = mount(`
            <ix-tabs>
                <ix-tab-list>
                    <ix-tab data-value="a">A</ix-tab>
                    <ix-tab data-value="b">B</ix-tab>
                </ix-tab-list>
                <ix-tab-panel data-value="b">B-innhold</ix-tab-panel>
                <ix-tab-panel data-value="a">A-innhold</ix-tab-panel>
            </ix-tabs>
        `);
        const [t0, t1] = tabs(el);
        const [pB, pA] = panels(el);
        expect(t0.getAttribute('aria-controls')).toBe(pA.id);
        expect(pA.getAttribute('aria-labelledby')).toBe(t0.id);
        expect(t1.getAttribute('aria-controls')).toBe(pB.id);
        // Fane A er valgt som default → panel A synlig, panel B skjult.
        expect(pA.hasAttribute('hidden')).toBe(false);
        expect(pB.hasAttribute('hidden')).toBe(true);
    });

    it('respekterer eksisterende id og aria-controls', () => {
        const el = mount(`
            <ix-tabs>
                <ix-tab-list>
                    <ix-tab id="min-fane" aria-controls="mitt-panel">A</ix-tab>
                    <ix-tab>B</ix-tab>
                </ix-tab-list>
                <ix-tab-panel id="mitt-panel">A-innhold</ix-tab-panel>
                <ix-tab-panel>B-innhold</ix-tab-panel>
            </ix-tabs>
        `);
        const [t0] = tabs(el);
        expect(t0.id).toBe('min-fane');
        expect(t0.getAttribute('aria-controls')).toBe('mitt-panel');
    });
});

describe('IxTabs — initial valgt', () => {
    it('velger første fane som default', () => {
        const el = mount(BASIC);
        const [t0, t1] = tabs(el);
        const [p0, p1] = panels(el);
        expect(t0.getAttribute('aria-selected')).toBe('true');
        expect(t0.tabIndex).toBe(0);
        expect(t1.getAttribute('aria-selected')).toBe('false');
        expect(t1.tabIndex).toBe(-1);
        expect(p0.hasAttribute('hidden')).toBe(false);
        expect(p1.hasAttribute('hidden')).toBe(true);
    });

    it('respekterer aria-selected="true" i markup', () => {
        const el = mount(`
            <ix-tabs>
                <ix-tab-list>
                    <ix-tab>A</ix-tab>
                    <ix-tab aria-selected="true">B</ix-tab>
                </ix-tab-list>
                <ix-tab-panel>A</ix-tab-panel>
                <ix-tab-panel>B</ix-tab-panel>
            </ix-tabs>
        `);
        const [t0, t1] = tabs(el);
        expect(t1.getAttribute('aria-selected')).toBe('true');
        expect(t0.getAttribute('aria-selected')).toBe('false');
        expect(panels(el)[1].hasAttribute('hidden')).toBe(false);
    });

    it('sender ikke change ved init', () => {
        const wrapper = document.createElement('div');
        const handler = vi.fn();
        wrapper.addEventListener('change', handler);
        wrapper.innerHTML = BASIC;
        document.body.appendChild(wrapper);
        expect(handler).not.toHaveBeenCalled();
    });
});

describe('IxTabs — aktivering', () => {
    it('klikk aktiverer fane og bytter panel', () => {
        const el = mount(BASIC);
        const [t0, t1] = tabs(el);
        const [p0, p1] = panels(el);
        t1.click();
        expect(t1.getAttribute('aria-selected')).toBe('true');
        expect(t0.getAttribute('aria-selected')).toBe('false');
        expect(p1.hasAttribute('hidden')).toBe(false);
        expect(p0.hasAttribute('hidden')).toBe(true);
        // Panelet er ikke en egen tab-stopp.
        expect(p1.hasAttribute('tabindex')).toBe(false);
    });

    it('Enter og Space aktiverer fokusert fane', () => {
        const el = mount(BASIC);
        const [, t1, t2] = tabs(el);
        keydown(t1, 'Enter');
        expect(t1.getAttribute('aria-selected')).toBe('true');
        keydown(t2, ' ');
        expect(t2.getAttribute('aria-selected')).toBe('true');
    });

    it('sender bubbling change ved aktivering', () => {
        const el = mount(BASIC);
        const handler = vi.fn();
        document.body.addEventListener('change', handler);
        tabs(el)[1].click();
        expect(handler).toHaveBeenCalledTimes(1);
        document.body.removeEventListener('change', handler);
    });

    it('sender ikke change når allerede-valgt fane aktiveres', () => {
        const el = mount(BASIC);
        const handler = vi.fn();
        el.addEventListener('change', handler);
        tabs(el)[0].click(); // allerede valgt
        expect(handler).not.toHaveBeenCalled();
    });

});

describe('IxTabs — tastaturnavigasjon (manuell aktivering)', () => {
    it('ArrowRight/ArrowLeft flytter kun fokus, ikke valg', () => {
        const el = mount(BASIC);
        const [t0, t1] = tabs(el);
        t0.focus();
        keydown(t0, 'ArrowRight');
        expect(document.activeElement).toBe(t1);
        expect(t1.tabIndex).toBe(0);
        expect(t0.tabIndex).toBe(-1);
        // Valget flyttes IKKE ved pilnavigasjon
        expect(t0.getAttribute('aria-selected')).toBe('true');
        expect(t1.getAttribute('aria-selected')).toBe('false');
    });

    it('Home/End går til første/siste fane', () => {
        const el = mount(BASIC);
        const [t0, , t2] = tabs(el);
        t0.focus();
        keydown(t0, 'End');
        expect(document.activeElement).toBe(t2);
        keydown(t2, 'Home');
        expect(document.activeElement).toBe(t0);
    });

    it('looper rundt ved endene', () => {
        const el = mount(BASIC);
        const [t0, , t2] = tabs(el);
        t0.focus();
        keydown(t0, 'ArrowLeft');
        expect(document.activeElement).toBe(t2);
        keydown(t2, 'ArrowRight');
        expect(document.activeElement).toBe(t0);
    });
});

describe('IxTabs — dynamisk DOM', () => {
    it('wirer fane/panel lagt til etter mount', async () => {
        const el = mount(BASIC);
        const list = el.querySelector('ix-tab-list')!;
        const tab = document.createElement('ix-tab');
        tab.textContent = 'Ny';
        list.appendChild(tab);
        const panel = document.createElement('ix-tab-panel');
        panel.textContent = 'Ny-innhold';
        el.appendChild(panel);

        await Promise.resolve(); // la MutationObserver kjøre
        expect(tab.getAttribute('role')).toBe('tab');
        expect(tab.id).toBeTruthy();
        expect(tab.getAttribute('aria-controls')).toBe(panel.id);
    });

    it('reagerer på ekstern aria-selected-endring uten å sende change', async () => {
        const el = mount(BASIC);
        const handler = vi.fn();
        el.addEventListener('change', handler);
        const [t0, t1] = tabs(el);
        // Simuler kontrollert React som setter aria-selected direkte
        t1.setAttribute('aria-selected', 'true');
        await Promise.resolve();
        expect(t1.getAttribute('aria-selected')).toBe('true');
        expect(t0.getAttribute('aria-selected')).toBe('false');
        expect(panels(el)[1].hasAttribute('hidden')).toBe(false);
        expect(handler).not.toHaveBeenCalled();
    });
});

describe('IxTabs — cleanup', () => {
    it('slutter å reagere på interaksjon etter disconnect', () => {
        const el = mount(BASIC);
        const [, t1] = tabs(el);
        el.remove();
        t1.click();
        // Observer/lyttere frakoblet — valget skal ikke ha endret seg
        expect(t1.getAttribute('aria-selected')).toBe('false');
    });

    it('mount → unmount → remount fungerer uten dupliserte change-events', () => {
        const el = mount(BASIC);
        el.remove();
        document.body.appendChild(el); // remount (kjører connectedCallback på nytt)

        const handler = vi.fn();
        el.addEventListener('change', handler);
        tabs(el)[1].click();
        expect(handler).toHaveBeenCalledTimes(1);
    });
});

describe('IxTabs — manglende barn', () => {
    it('advarer i dev når tab-liste mangler', () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mount(`<ix-tabs></ix-tabs>`);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    it('krasjer ikke uten faner', () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        expect(() => mount(`<ix-tabs><ix-tab-list></ix-tab-list></ix-tabs>`)).not.toThrow();
        spy.mockRestore();
    });
});
