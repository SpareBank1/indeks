/**
 * IxDropdown — ARIA-lim for en nedtrekksmeny med handlinger eller navigasjon.
 *
 * ## Designfilosofi
 *
 * Komponenten kobler en trigger-knapp med en meny. Forfatteren skriver en
 * <button> (trigger) og en .ix-dropdown__menu med .ix-dropdown__item-elementer
 * i light DOM. Komponentens jobb er å sette opp ARIA-attributter, håndtere
 * tastaturnavigasjon, posisjonere menyen, og styre åpen/lukket-tilstand.
 *
 * ## Roving tabindex
 *
 * Alle items har tabindex="-1" unntatt det aktive (fokuserte). Piltaster
 * flytter fokus mellom items. Dette følger APG Menu Button-mønsteret.
 *
 * ## Submenyer
 *
 * En submenu er en nøstet <ix-dropdown data-submenu> inne i parent-menyen.
 * ArrowRight på en submenu-trigger åpner submenyen, ArrowLeft lukker den.
 * Submenyen posisjoneres til høyre for parent-item (flipper ved plassmangel).
 *
 * ## Posisjonering
 *
 * Menyen posisjoneres manuelt med getBoundingClientRect + viewport-clamp
 * (samme grep som tooltip og combobox) — position: fixed, JS setter top/left.
 *
 * @example
 * <ix-dropdown>
 *   <button class="ix-button" data-variant="secondary">Handlinger</button>
 *   <div class="ix-dropdown__menu">
 *     <button class="ix-dropdown__item">Rediger</button>
 *     <button class="ix-dropdown__item">Dupliser</button>
 *     <hr class="ix-dropdown__divider" />
 *     <button class="ix-dropdown__item" data-danger>Slett</button>
 *   </div>
 * </ix-dropdown>
 */

let dropdownCounter = 0;

export class IxDropdown extends HTMLElement {
    private _instanceId = 0;

    private _trigger: HTMLElement | null = null;
    private _menu: HTMLElement | null = null;
    private _items: HTMLElement[] = [];
    private _activeIndex = -1;

    private _onTriggerClick: ((e: MouseEvent) => void) | null = null;
    private _onTriggerKeydown: ((e: KeyboardEvent) => void) | null = null;
    private _onMenuKeydown: ((e: KeyboardEvent) => void) | null = null;
    private _onMenuClick: ((e: MouseEvent) => void) | null = null;
    private _onMenuPointerenter: ((e: PointerEvent) => void) | null = null;
    private _onDocPointer: ((e: Event) => void) | null = null;
    private _onFocusout: ((e: FocusEvent) => void) | null = null;
    private _onReposition: (() => void) | null = null;
    private _itemObserver: MutationObserver | null = null;

    private _typeaheadBuffer = '';
    private _typeaheadTimer: ReturnType<typeof setTimeout> | null = null;

    private _openedWithKeyboard = false;

    static get observedAttributes(): string[] {
        return ['open', 'placement', 'data-controlled'];
    }

    /**
     * Kontrollert modus: når `data-controlled` er satt, endrer ikke komponenten
     * egen åpen-tilstand. Den dispatcher kun `open-request` / `close-request`,
     * og foreldren må sette `open`-attributtet for å faktisk åpne/lukke.
     */
    private get _isControlled(): boolean {
        return this.hasAttribute('data-controlled');
    }

    connectedCallback(): void {
        this._instanceId = ++dropdownCounter;
        this._wire();
    }

    disconnectedCallback(): void {
        if (this._trigger) {
            if (this._onTriggerClick) this._trigger.removeEventListener('click', this._onTriggerClick);
            if (this._onTriggerKeydown) this._trigger.removeEventListener('keydown', this._onTriggerKeydown);
        }
        if (this._menu) {
            if (this._onMenuKeydown) this._menu.removeEventListener('keydown', this._onMenuKeydown);
            if (this._onMenuClick) this._menu.removeEventListener('click', this._onMenuClick);
            if (this._onMenuPointerenter) this._menu.removeEventListener('pointerenter', this._onMenuPointerenter, true);
        }
        if (this._onDocPointer) {
            document.removeEventListener('pointerdown', this._onDocPointer, true);
        }
        if (this._onFocusout) {
            this.removeEventListener('focusout', this._onFocusout);
        }
        this._removeRepositionListeners();
        this._itemObserver?.disconnect();

        if (this._typeaheadTimer) {
            clearTimeout(this._typeaheadTimer);
            this._typeaheadTimer = null;
        }

        this._onTriggerClick = null;
        this._onTriggerKeydown = null;
        this._onMenuKeydown = null;
        this._onMenuClick = null;
        this._onMenuPointerenter = null;
        this._onDocPointer = null;
        this._onFocusout = null;
        this._onReposition = null;
        this._itemObserver = null;
        this._trigger = null;
        this._menu = null;
        this._items = [];
    }

    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
        if (!this.isConnected) return;
        if (name === 'open') {
            const shouldBeOpen = newValue !== null && newValue !== 'false';
            if (shouldBeOpen && !this._isOpen) this._doOpen();
            else if (!shouldBeOpen && this._isOpen) this._doClose();
        } else if (name === 'placement' && this._isOpen) {
            this._position();
        }
    }

    get open(): boolean {
        const attr = this.getAttribute('open');
        return attr !== null && attr !== 'false';
    }

    set open(value: boolean) {
        this.toggleAttribute('open', value);
    }

    private get _isOpen(): boolean {
        return this.hasAttribute('data-open');
    }

    private get _isSubmenu(): boolean {
        return this.hasAttribute('data-submenu');
    }

    private get _placement(): string {
        return this.getAttribute('placement') ?? 'bottom-start';
    }

    private _wire(): void {
        this._menu = this.querySelector<HTMLElement>(':scope > .ix-dropdown__menu');

        if (this._isSubmenu) {
            this._trigger = this.querySelector<HTMLElement>(':scope > .ix-dropdown__item');
        } else {
            this._trigger = Array.from(this.children).find(
                (child): child is HTMLElement =>
                    child instanceof HTMLElement &&
                    !child.classList.contains('ix-dropdown__menu')
            ) ?? null;
        }

        if (!this._trigger || !this._menu) {
            if (import.meta.env.DEV) {
                console.warn('[ix-dropdown] Mangler trigger eller .ix-dropdown__menu. Komponenten er ikke aktiv.');
            }
            return;
        }

        if (!this._menu.id) this._menu.id = `ix-dropdown-menu-${this._instanceId}`;
        if (!this._menu.getAttribute('role')) this._menu.setAttribute('role', 'menu');
        this._menu.hidden = true;

        this._trigger.setAttribute('aria-haspopup', 'menu');
        this._trigger.setAttribute('aria-expanded', 'false');
        this._trigger.setAttribute('aria-controls', this._menu.id);

        this._wireItems();

        this._onTriggerClick = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            this._openedWithKeyboard = false;
            this._toggleOpen();
        };
        this._trigger.addEventListener('click', this._onTriggerClick);

        this._onTriggerKeydown = (e: KeyboardEvent) => this._handleTriggerKeydown(e);
        this._trigger.addEventListener('keydown', this._onTriggerKeydown);

        this._onMenuKeydown = (e: KeyboardEvent) => this._handleMenuKeydown(e);
        this._menu.addEventListener('keydown', this._onMenuKeydown);

        this._onMenuClick = (e: MouseEvent) => {
            const item = (e.target as HTMLElement).closest<HTMLElement>('.ix-dropdown__item');
            if (item && this._menu?.contains(item)) this._handleItemClick(e, item);
        };
        this._menu.addEventListener('click', this._onMenuClick);

        this._onMenuPointerenter = (e: PointerEvent) => {
            const item = (e.target as HTMLElement).closest<HTMLElement>('.ix-dropdown__item');
            if (item && this._menu?.contains(item)) {
                const idx = this._items.indexOf(item);
                if (idx !== -1) this._handleItemPointerEnter(idx);
            }
        };
        this._menu.addEventListener('pointerenter', this._onMenuPointerenter, true);

        this._onDocPointer = (e: Event) => {
            if (!this._isOpen) return;
            const target = e.target as Node;
            if (!this.contains(target)) {
                this._close();
            }
        };
        document.addEventListener('pointerdown', this._onDocPointer, true);

        this._onFocusout = (e: FocusEvent) => {
            if (!this._isOpen) return;
            const relatedTarget = e.relatedTarget as Node | null;
            if (relatedTarget && this.contains(relatedTarget)) return;
            // For submenyer: ikke lukk parent hvis fokus går til submenu-trigger
            const rootDropdown = this.closest('ix-dropdown:not([data-submenu])') ?? this;
            if (relatedTarget && rootDropdown.contains(relatedTarget)) return;
            this._close();
        };
        this.addEventListener('focusout', this._onFocusout);

        this._itemObserver = new MutationObserver(() => this._rewireItems());
        this._itemObserver.observe(this._menu, { childList: true, subtree: true });

        if (this.open) this._doOpen();
    }

    private _wireItems(): void {
        this._rewireItems();
    }

    private _rewireItems(): void {
        if (!this._menu) return;

        // Finn kun direkte child-items i denne menyens panel, ikke items i nøstede submenyer.
        // Submenu-triggere ligger som direkte children av ix-dropdown[data-submenu], ikke i __menu.
        const items: HTMLElement[] = Array.from(this._menu.children).filter(
            (child): child is HTMLElement =>
                child instanceof HTMLElement && child.classList.contains('ix-dropdown__item')
        );

        // Legg også til submenu-triggere (de ligger som children av nøstede ix-dropdown)
        const submenus = Array.from(this._menu.querySelectorAll<HTMLElement>(':scope > ix-dropdown[data-submenu]'));
        submenus.forEach((submenu) => {
            const submenuTrigger = submenu.querySelector<HTMLElement>(':scope > .ix-dropdown__item');
            if (submenuTrigger) {
                items.push(submenuTrigger);
                submenuTrigger.setAttribute('aria-haspopup', 'menu');
                submenuTrigger.setAttribute('aria-expanded', 'false');
            }
        });

        // Sorter items etter DOM-rekkefølge
        items.sort((a, b) => {
            const position = a.compareDocumentPosition(b);
            if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
            if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
            return 0;
        });

        items.forEach((item) => {
            if (!item.getAttribute('role')) item.setAttribute('role', 'menuitem');
            item.setAttribute('tabindex', '-1');
        });

        this._menu.querySelectorAll<HTMLElement>(':scope > .ix-dropdown__divider').forEach((divider) => {
            if (!divider.getAttribute('role')) divider.setAttribute('role', 'separator');
        });

        this._items = items;
    }

    private _handleTriggerKeydown(e: KeyboardEvent): void {
        // For submenyer: ikke håndter ArrowDown/ArrowUp her — la parent-menyen navigere.
        // Submenyer åpnes kun med ArrowRight (håndtert i parent's _handleMenuKeydown).
        if (this._isSubmenu) {
            return;
        }

        // For rot-menyer: ArrowDown/ArrowUp/Enter/Space åpner menyen
        switch (e.key) {
            case 'Enter':
            case ' ':
            case 'ArrowDown':
                e.preventDefault();
                this._openedWithKeyboard = true;
                this._open();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this._openedWithKeyboard = true;
                this._open();
                this._focusItem(this._items.length - 1);
                break;
        }
    }

    private _handleMenuKeydown(e: KeyboardEvent): void {
        const target = e.target as HTMLElement;

        if (!this._menu?.contains(target)) return;

        // Ikke håndter hendelser som kommer fra en nøstet submeny sin meny.
        // Submenu-triggere ligger i *vår* meny, så de skal håndteres av oss.
        // Men items inne i en *nøstet* submeny skal håndteres av den submenyen.
        const closestSubmenuMenu = target.closest('ix-dropdown[data-submenu] > .ix-dropdown__menu');
        if (closestSubmenuMenu && closestSubmenuMenu !== this._menu && this._menu.contains(closestSubmenuMenu)) {
            return;
        }

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                e.stopPropagation();
                this._close();
                this._trigger?.focus();
                break;

            case 'ArrowDown':
                e.preventDefault();
                this._focusNextItem(1);
                break;

            case 'ArrowUp':
                e.preventDefault();
                this._focusNextItem(-1);
                break;

            case 'Home':
                e.preventDefault();
                this._focusItem(0);
                break;

            case 'End':
                e.preventDefault();
                this._focusItem(this._items.length - 1);
                break;

            case 'ArrowRight': {
                const submenu = target.closest('ix-dropdown[data-submenu]') as IxDropdown | null;
                if (submenu && submenu !== this && target === submenu._trigger) {
                    e.preventDefault();
                    submenu._openedWithKeyboard = true;
                    submenu._open();
                }
                break;
            }

            case 'ArrowLeft':
                if (this._isSubmenu) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Fokuser triggeren FØR lukking — ellers trigger focusout med null relatedTarget
                    const parentDropdown = this.parentElement?.closest('ix-dropdown') as IxDropdown | null;
                    if (this._trigger) {
                        this._trigger.focus();
                        if (parentDropdown) {
                            const triggerIndex = parentDropdown._items.indexOf(this._trigger);
                            if (triggerIndex !== -1) {
                                parentDropdown._focusItem(triggerIndex);
                            }
                        }
                    }
                    this._close();
                }
                break;

            case 'Enter':
            case ' ':
                if (target.classList.contains('ix-dropdown__item')) {
                    e.preventDefault();
                    const submenu = target.parentElement as IxDropdown | null;
                    if (submenu?.hasAttribute('data-submenu') && target === submenu._trigger) {
                        submenu._openedWithKeyboard = true;
                        submenu._open();
                    } else {
                        target.click();
                    }
                }
                break;

            case 'Tab':
                e.preventDefault();
                this._closeAll();
                break;

            default:
                if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                    this._handleTypeahead(e.key);
                }
        }
    }

    private _handleItemPointerEnter(index: number): void {
        this._activeIndex = index;
        // Hvis fokus allerede er i menyen (tastatur), synk fokus/roving-tabindex til hoveret item.
        if (this._menu?.contains(document.activeElement)) this._focusItem(index);
    }

    private _handleItemClick(e: MouseEvent, item: HTMLElement): void {
        if (item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true') {
            e.preventDefault();
            return;
        }

        const submenu = item.parentElement as IxDropdown | null;
        if (submenu?.hasAttribute('data-submenu') && item === submenu._trigger) {
            e.stopPropagation();
            return;
        }

        this._activeIndex = this._items.indexOf(item);
        this._closeAll();
    }

    private _handleTypeahead(char: string): void {
        this._typeaheadBuffer += char.toLowerCase();

        if (this._typeaheadTimer) clearTimeout(this._typeaheadTimer);
        this._typeaheadTimer = setTimeout(() => {
            this._typeaheadBuffer = '';
        }, 500);

        const match = this._items.findIndex((item) => {
            if (item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true') return false;
            const text = (item.textContent ?? '').trim().toLowerCase();
            return text.startsWith(this._typeaheadBuffer);
        });

        if (match !== -1) {
            this._focusItem(match);
        }
    }

    private _focusItem(index: number): void {
        const enabledItems = this._items.filter(
            (item) => !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true'
        );
        if (enabledItems.length === 0) return;

        const clampedIndex = Math.max(0, Math.min(index, this._items.length - 1));
        const item = this._items[clampedIndex];

        if (item?.hasAttribute('disabled') || item?.getAttribute('aria-disabled') === 'true') {
            this._focusNextItem(1);
            return;
        }

        this._items.forEach((i, idx) => {
            i.setAttribute('tabindex', idx === clampedIndex ? '0' : '-1');
            i.removeAttribute('data-active');
        });

        if (item) {
            item.setAttribute('data-active', '');
            item.focus();
            this._activeIndex = clampedIndex;
        }
    }

    private _focusNextItem(delta: number): void {
        const enabledItems = this._items.filter(
            (item) => !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true'
        );
        if (enabledItems.length === 0) return;

        let currentIdx = this._activeIndex;
        if (currentIdx === -1) {
            currentIdx = delta > 0 ? -1 : this._items.length;
        }

        let nextIdx = currentIdx;
        let iterations = 0;
        do {
            nextIdx = nextIdx + delta;
            if (nextIdx < 0) nextIdx = this._items.length - 1;
            if (nextIdx >= this._items.length) nextIdx = 0;
            iterations++;
        } while (
            iterations < this._items.length &&
            (this._items[nextIdx]?.hasAttribute('disabled') ||
                this._items[nextIdx]?.getAttribute('aria-disabled') === 'true')
        );

        this._focusItem(nextIdx);
    }

    private _open(): void {
        if (this._isOpen || !this._menu || !this._trigger) return;

        if (this._isControlled) {
            this.dispatchEvent(new CustomEvent('open-request', { bubbles: true }));
            return;
        }

        this._doOpen();
    }

    private _doOpen(): void {
        if (this._isOpen || !this._menu || !this._trigger) return;

        this.setAttribute('data-open', '');
        this.setAttribute('open', '');
        this._menu.hidden = false;
        this._trigger.setAttribute('aria-expanded', 'true');

        this._position();
        this._addRepositionListeners();

        if (this._openedWithKeyboard) {
            this._focusItem(0);
        }

        this.dispatchEvent(new CustomEvent('open', { bubbles: true }));
    }

    private _close(): void {
        if (!this._isOpen || !this._menu || !this._trigger) return;

        if (this._isControlled) {
            this.dispatchEvent(new CustomEvent('close-request', { bubbles: true }));
            return;
        }

        this._doClose();
    }

    private _doClose(): void {
        if (!this._isOpen || !this._menu || !this._trigger) return;

        this._closeAllSubmenus();

        this.removeAttribute('data-open');
        this.removeAttribute('open');
        this._menu.hidden = true;
        this._trigger.setAttribute('aria-expanded', 'false');

        this._items.forEach((item) => {
            item.setAttribute('tabindex', '-1');
            item.removeAttribute('data-active');
        });
        this._activeIndex = -1;

        this._removeRepositionListeners();

        this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
    }

    private _toggleOpen(): void {
        if (this._isOpen) this._close();
        else this._open();
    }

    private _closeAll(): void {
        let root = this.parentElement?.closest<IxDropdown>('ix-dropdown');
        if (!root) {
            this._close();
            this._trigger?.focus();
            return;
        }
        while (root.parentElement?.closest('ix-dropdown')) {
            root = root.parentElement.closest('ix-dropdown') as IxDropdown;
        }
        root._close();
        root._trigger?.focus();
    }

    private _closeAllSubmenus(): void {
        const submenus = this._menu?.querySelectorAll<IxDropdown>('ix-dropdown[data-submenu]');
        submenus?.forEach((submenu) => {
            if (submenu._isOpen) submenu._close();
        });
    }

    private _position(): void {
        if (!this._menu || !this._trigger) return;

        const triggerRect = this._trigger.getBoundingClientRect();
        const menuRect = this._menu.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const gap = 2;

        let top: number;
        let left: number;

        if (this._isSubmenu) {
            // Bruk parent-menyens ytterkant for å unngå overlapping
            const parentMenu = this.parentElement;
            const parentMenuRect = parentMenu?.getBoundingClientRect();
            const anchorRight = parentMenuRect?.right ?? triggerRect.right;
            const anchorLeft = parentMenuRect?.left ?? triggerRect.left;

            const spaceRight = vw - anchorRight;
            const spaceLeft = anchorLeft;

            if (spaceRight >= menuRect.width || spaceRight >= spaceLeft) {
                left = anchorRight + gap;
            } else {
                left = anchorLeft - menuRect.width - gap;
            }

            top = triggerRect.top;

            if (top + menuRect.height > vh - gap) {
                top = Math.max(gap, vh - menuRect.height - gap);
            }
        } else {
            const placement = this._placement;
            const [vertical, horizontal] = placement.split('-');

            const spaceBelow = vh - triggerRect.bottom;
            const spaceAbove = triggerRect.top;

            if (vertical === 'bottom' && spaceBelow >= menuRect.height + gap) {
                top = triggerRect.bottom + gap;
            } else if (vertical === 'top' && spaceAbove >= menuRect.height + gap) {
                top = triggerRect.top - menuRect.height - gap;
            } else if (spaceBelow >= spaceAbove) {
                top = triggerRect.bottom + gap;
            } else {
                top = triggerRect.top - menuRect.height - gap;
            }

            if (horizontal === 'end') {
                left = triggerRect.right - menuRect.width;
            } else {
                left = triggerRect.left;
            }

            if (left + menuRect.width > vw - gap) {
                left = vw - menuRect.width - gap;
            }
            if (left < gap) {
                left = gap;
            }
        }

        if (top + menuRect.height > vh - gap) {
            top = Math.max(gap, vh - menuRect.height - gap);
        }
        if (top < gap) {
            top = gap;
        }

        this._menu.style.top = `${top}px`;
        this._menu.style.left = `${left}px`;
    }

    private _addRepositionListeners(): void {
        if (this._onReposition) return;
        this._onReposition = () => {
            if (this._isOpen) this._position();
        };
        window.addEventListener('scroll', this._onReposition, true);
        window.addEventListener('resize', this._onReposition);
    }

    private _removeRepositionListeners(): void {
        if (this._onReposition) {
            window.removeEventListener('scroll', this._onReposition, true);
            window.removeEventListener('resize', this._onReposition);
            this._onReposition = null;
        }
    }
}
