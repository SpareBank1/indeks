/**
 * IxTabs — ARIA-lim for faner (tabs) i light DOM.
 *
 * ## Designfilosofi
 *
 * Komponenten erstatter ingen native elementer. Forfatteren skriver semantisk
 * HTML — en liste med faner og ett panel per fane — og <ix-tabs> kobler dem
 * sammen med ARIA, roving tabindex, tastaturnavigasjon og panel-visning.
 * Logikken er portet fra u-elements (u-tabs), men til Indeks' light-DOM-
 * konvensjon (ingen Shadow DOM, ingen ::slotted).
 *
 * Fire custom elements samarbeider:
 *   - <ix-tabs>       — rot og koordinator. Eier all kabling og tastatur.
 *   - <ix-tab-list>   — role="tablist", horisontal orientering.
 *   - <ix-tab>        — role="tab", én per fane.
 *   - <ix-tab-panel>  — role="tabpanel", ett innholdspanel per fane.
 *
 * Underelementene setter kun sin egen `role` (så de fungerer isolert); <ix-tabs>
 * er den autoritative koordinatoren og kjører ved connectedCallback.
 *
 * ## Hva <ix-tabs> gjør
 *
 * 1. Setter role="tablist" + aria-orientation="horizontal" på tab-lista,
 *    role="tab" på fanene og role="tabpanel" på panelene.
 * 2. Genererer stabile IDer på faner og paneler (der de mangler) og setter opp
 *    kryssreferansene aria-controls (fane → panel) og aria-labelledby
 *    (panel → fane). Eksisterende IDer og aria-controls respekteres. Fane[i]
 *    kobles til panel[i], eller til panelet fanens aria-controls peker på.
 * 3. Manuell aktivering: piltast (Venstre/Høyre) og Home/End flytter kun FOKUS
 *    via roving tabindex (fokusert fane får tabindex=0, resten -1).
 *    Piltast-navigasjonen looper rundt endene. Enter/Space (og klikk) aktiverer
 *    den fokuserte fanen.
 * 4. Kun én fane er valgt om gangen. Ved aktivering flyttes aria-selected +
 *    tabindex til ny fane, tilhørende panel vises, øvrige skjules ([hidden] +
 *    aria-hidden). Panelet gjøres ikke fokuserbart — det er ikke en egen
 *    tab-stopp; innholdet i panelet bærer sin egen fokusrekkefølge.
 *    Fane→panel-kobling skjer via delt data-value (ellers aria-controls,
 *    ellers posisjon) — se _getPanel.
 * 5. Minst én fane er valgt ved mount — enten den som har aria-selected="true"
 *    i markup, ellers den første fanen.
 * 6. Ved aktivering (klikk/tastatur) sendes et bubbling CustomEvent('change')
 *    på <ix-tabs> slik at en React-wrapper kan lese aria-selected og kalle
 *    onChange. Programmatisk init og ekstern (kontrollert) synk sender IKKE
 *    change — kun ekte brukerinteraksjon.
 * 7. En MutationObserver re-wirer når faner/paneler legges til eller fjernes
 *    (typisk React conditional rendering), og reagerer på ekstern endring av
 *    aria-selected (kontrollert React-modus) ved å reconcile-e resten.
 *
 * ## Ingen Shadow DOM
 *
 * Light DOM slik at CSS fra @sb1/indeks-css treffer .ix-tabs__* og tag-
 * selektorene direkte, og ARIA-relasjonene fungerer på tvers av elementene.
 *
 * @example
 * <ix-tabs class="ix-tabs">
 *   <ix-tab-list class="ix-tabs__list">
 *     <ix-tab class="ix-tabs__tab">Oversikt</ix-tab>
 *     <ix-tab class="ix-tabs__tab">Detaljer</ix-tab>
 *   </ix-tab-list>
 *   <ix-tab-panel class="ix-tabs__panel">Oversikt-innhold</ix-tab-panel>
 *   <ix-tab-panel class="ix-tabs__panel">Detaljer-innhold</ix-tab-panel>
 * </ix-tabs>
 */

let tabsCounter = 0;

const ROLE = 'role';
const ARIA_SELECTED = 'aria-selected';
const ARIA_CONTROLS = 'aria-controls';
const ARIA_LABELLEDBY = 'aria-labelledby';
const ARIA_HIDDEN = 'aria-hidden';
const DATA_VALUE = 'data-value';

function isTab(el: Element): el is HTMLElement {
    return el instanceof HTMLElement && (el.tagName === 'IX-TAB' || el.getAttribute(ROLE) === 'tab');
}

function isPanel(el: Element): el is HTMLElement {
    return el instanceof HTMLElement && (el.tagName === 'IX-TAB-PANEL' || el.getAttribute(ROLE) === 'tabpanel');
}

export class IxTabs extends HTMLElement {
    // Én instansvariabel per ressurs som må ryddes i disconnectedCallback.
    private _mutationObserver: MutationObserver | null = null;
    private _clickListener: ((e: MouseEvent) => void) | null = null;
    private _keydownListener: ((e: KeyboardEvent) => void) | null = null;

    private _instanceId = 0;
    // Undertrykker MutationObserver-reaksjon på våre egne DOM-skrivinger, slik at
    // aria-selected/tabindex/hidden-oppdateringer ikke trigger en re-wire-løkke.
    private _internalUpdate = false;

    connectedCallback(): void {
        this._instanceId = ++tabsCounter;

        // Delegerte lyttere på host — klikk/tastatur på faner bobler hit, så vi
        // slipper å re-feste lyttere når tab-lista byttes ut ved re-render.
        this._clickListener = (e: MouseEvent) => this._onClick(e);
        this._keydownListener = (e: KeyboardEvent) => this._onKeydown(e);
        this.addEventListener('click', this._clickListener);
        this.addEventListener('keydown', this._keydownListener);

        this._mutationObserver = new MutationObserver((records) => this._onMutations(records));
        this._mutationObserver.observe(this, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [ARIA_SELECTED],
        });

        this._wire();
    }

    disconnectedCallback(): void {
        this._mutationObserver?.disconnect();
        this._mutationObserver = null;

        if (this._clickListener) this.removeEventListener('click', this._clickListener);
        this._clickListener = null;

        if (this._keydownListener) this.removeEventListener('keydown', this._keydownListener);
        this._keydownListener = null;
    }

    /** Faner i rekkefølge (direkte barn av tab-lista). */
    private _getTabs(): HTMLElement[] {
        const list = this.querySelector<HTMLElement>('ix-tab-list, [role="tablist"]');
        if (!list) return [];
        return Array.from(list.children).filter(isTab);
    }

    /** Paneler i rekkefølge (direkte barn av <ix-tabs>). */
    private _getPanels(): HTMLElement[] {
        return Array.from(this.children).filter(isPanel);
    }

    /**
     * Finn panelet en fane styrer. Prioritet:
     *   1. Eksplisitt `aria-controls` (forfatter- eller WC-satt).
     *   2. Delt `data-value` — kobler fane og panel eksplisitt, uavhengig av
     *      DOM-rekkefølge (React setter dette; ren HTML kan også sette det).
     *   3. Posisjon (fane[i] → panel[i]) som siste utvei for enkel markup.
     */
    private _getPanel(tab: HTMLElement, index: number): HTMLElement | null {
        const controls = tab.getAttribute(ARIA_CONTROLS);
        if (controls) {
            const el = this.ownerDocument.getElementById(controls);
            if (el) return el;
        }

        const value = tab.getAttribute(DATA_VALUE);
        if (value) {
            const match = this._getPanels().find((p) => p.getAttribute(DATA_VALUE) === value);
            if (match) return match;
        }

        return this._getPanels()[index] ?? null;
    }

    /**
     * Kobler roller, IDer og kryssreferanser, og setter initial valgt fane.
     * Idempotent — kan kjøres på nytt når DOM endres.
     */
    private _wire(): void {
        const list = this.querySelector<HTMLElement>('ix-tab-list, [role="tablist"]');
        if (!list) {
            if (import.meta.env.DEV) {
                console.warn(
                    '[ix-tabs] Mangler <ix-tab-list> (role="tablist"). Uten en tab-liste kan ikke fanene kobles.'
                );
            }
            return;
        }
        if (!list.getAttribute(ROLE)) list.setAttribute(ROLE, 'tablist');
        if (!list.getAttribute('aria-orientation')) list.setAttribute('aria-orientation', 'horizontal');

        const tabs = this._getTabs();
        if (tabs.length === 0) {
            if (import.meta.env.DEV) {
                console.warn('[ix-tabs] Fant ingen <ix-tab> (role="tab"). Komponenten er ikke aktiv.');
            }
            return;
        }

        // Roller + ID-er + kryssreferanser. Respekter alt forfatteren har satt.
        tabs.forEach((tab, i) => {
            if (!tab.getAttribute(ROLE)) tab.setAttribute(ROLE, 'tab');
            if (!tab.id) tab.id = `ix-tab-${this._instanceId}-${i}`;

            const panel = this._getPanel(tab, i);
            if (panel) {
                if (!panel.getAttribute(ROLE)) panel.setAttribute(ROLE, 'tabpanel');
                if (!panel.id) panel.id = `ix-tab-panel-${this._instanceId}-${i}`;
                if (!tab.getAttribute(ARIA_CONTROLS)) tab.setAttribute(ARIA_CONTROLS, panel.id);
                if (!panel.getAttribute(ARIA_LABELLEDBY)) panel.setAttribute(ARIA_LABELLEDBY, tab.id);
            }
        });

        // Initial valgt fane: markup-valgt (aria-selected="true"), ellers første
        // fane. Init sender ikke change.
        const selected = tabs.find((t) => t.getAttribute(ARIA_SELECTED) === 'true') ?? tabs[0];
        this.setSelected(selected, false);
    }

    /**
     * Aktiverer en fane: flytter aria-selected + roving tabindex hit, viser dens
     * panel og skjuler de øvrige. Sender kun change ved ekte brukerinteraksjon
     * (dispatch=true) OG når valget faktisk endres.
     */
    setSelected(selected: HTMLElement | null | undefined, dispatch = false): void {
        if (!selected) return;
        const tabs = this._getTabs();
        if (!tabs.includes(selected)) return;

        const changed = selected.getAttribute(ARIA_SELECTED) !== 'true';

        this._internalUpdate = true;
        tabs.forEach((tab, i) => {
            const isSel = tab === selected;
            tab.setAttribute(ARIA_SELECTED, String(isSel));
            tab.tabIndex = isSel ? 0 : -1;
            const panel = this._getPanel(tab, i);
            if (panel) this._syncPanel(panel, isSel);
        });
        this._internalUpdate = false;
        // Forkast records generert av skrivingene over, slik at MutationObserver-
        // callbacken ikke re-wirer på vår egen endring.
        this._mutationObserver?.takeRecords();

        if (dispatch && changed) {
            this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
        }
    }

    /**
     * Vis/skjul et panel. Skjult panel fjernes fra a11y-treet og lesefokus.
     * Panelet gjøres ikke fokuserbart — det inneholder eget innhold (tekst,
     * lenker, felt) og skal ikke være en egen tab-stopp. Har panelet ikke
     * fokuserbart innhold, klarer skjermlesere seg med aria-labelledby-koblingen.
     */
    private _syncPanel(panel: HTMLElement, show: boolean): void {
        panel.setAttribute(ARIA_HIDDEN, String(!show));
        if (show) {
            panel.removeAttribute('hidden');
        } else {
            panel.setAttribute('hidden', '');
        }
    }

    /** Flytt fokus (roving tabindex) til en fane uten å aktivere den. */
    private _moveFocus(tabs: HTMLElement[], target: HTMLElement): void {
        for (const tab of tabs) tab.tabIndex = tab === target ? 0 : -1;
        target.focus();
    }

    /** Neste fane fra `from`, i retning `step`, med loop rundt endene. */
    private _step(tabs: HTMLElement[], from: number, step: number): number {
        const n = tabs.length;
        return (from + step + n) % n;
    }

    private _onClick(e: MouseEvent): void {
        const tabs = this._getTabs();
        const target = e.target as Node | null;
        const tab = target ? tabs.find((t) => t === target || t.contains(target)) : undefined;
        if (tab) this.setSelected(tab, true);
    }

    private _onKeydown(e: KeyboardEvent): void {
        const tabs = this._getTabs();
        const target = e.target as Node | null;
        const current = target ? tabs.findIndex((t) => t === target || t.contains(target)) : -1;
        if (current === -1) return;

        // Manuell aktivering: Enter/Space aktiverer den fokuserte fanen.
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.setSelected(tabs[current], true);
            return;
        }

        // Piltast (horisontal) + Home/End flytter kun fokus.
        let next: number;
        if (e.key === 'ArrowRight') next = this._step(tabs, current, 1);
        else if (e.key === 'ArrowLeft') next = this._step(tabs, current, -1);
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        else return;

        e.preventDefault();
        this._moveFocus(tabs, tabs[next]);
    }

    private _onMutations(records: MutationRecord[]): void {
        if (this._internalUpdate) return;

        let structural = false;
        let externalSelected: HTMLElement | null = null;
        for (const record of records) {
            if (record.type === 'childList') {
                if (
                    Array.from(record.addedNodes).some(nodeAffectsTabs) ||
                    Array.from(record.removedNodes).some(nodeAffectsTabs)
                ) {
                    structural = true;
                }
            } else if (record.type === 'attributes' && record.attributeName === ARIA_SELECTED) {
                const t = record.target;
                if (t instanceof HTMLElement && isTab(t) && t.getAttribute(ARIA_SELECTED) === 'true') {
                    externalSelected = t;
                }
            }
        }

        // Struktur-endring: re-wire alt. Ekstern aria-selected (kontrollert
        // React): reconcile resten uten å sende change (unngår onChange-løkke).
        if (structural) this._wire();
        else if (externalSelected) this.setSelected(externalSelected, false);
    }
}

function nodeAffectsTabs(node: Node): boolean {
    if (node.nodeType !== Node.ELEMENT_NODE) return false;
    const el = node as Element;
    return isTab(el) || isPanel(el) || !!el.querySelector?.('ix-tab, ix-tab-panel, [role="tab"], [role="tabpanel"]');
}

/** role="tablist" + horisontal orientering. Koordineres av <ix-tabs>. */
export class IxTabList extends HTMLElement {
    connectedCallback(): void {
        if (!this.getAttribute(ROLE)) this.setAttribute(ROLE, 'tablist');
        if (!this.getAttribute('aria-orientation')) this.setAttribute('aria-orientation', 'horizontal');
    }
}

/** role="tab". Aktiv-tilstand og tabindex styres av <ix-tabs>. */
export class IxTab extends HTMLElement {
    connectedCallback(): void {
        if (!this.getAttribute(ROLE)) this.setAttribute(ROLE, 'tab');
    }
}

/** role="tabpanel". Vis/skjul styres av <ix-tabs>. */
export class IxTabPanel extends HTMLElement {
    connectedCallback(): void {
        if (!this.getAttribute(ROLE)) this.setAttribute(ROLE, 'tabpanel');
    }
}
