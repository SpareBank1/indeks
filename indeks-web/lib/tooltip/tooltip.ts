const TOOLTIP_ID = 'ix-tooltip-singleton';
const ATTR = 'data-tooltip';
const ATTR_PLACEMENT = 'data-tooltip-placement';
const DELAY_HOVER = 300;

let tip: HTMLElement | undefined;
let source: Element | undefined;
let hoverTimer = 0;

function getOrCreateTip(): HTMLElement {
    if (!tip) {
        tip = document.createElement('div');
        tip.id = TOOLTIP_ID;
        tip.className = 'ix-tooltip';
        tip.setAttribute('role', 'tooltip');
        tip.hidden = true;
    }
    if (!tip.isConnected) {
        document.body.appendChild(tip);
    }
    return tip;
}

type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';

function place(trigger: Element, panel: HTMLElement, placement: Placement): void {
    const r = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    panel.hidden = false;
    panel.style.visibility = 'hidden';

    const pw = panel.offsetWidth;
    const ph = panel.offsetHeight;
    const arrowSize = 6;
    const gap = arrowSize + 4;

    const axis = placement.startsWith('top') ? 'top'
        : placement.startsWith('bottom') ? 'bottom'
        : placement;

    // Auto-flip on primary axis
    let resolvedAxis = axis;
    if (axis === 'top' && r.top - ph - gap < 0) resolvedAxis = 'bottom';
    else if (axis === 'bottom' && r.bottom + ph + gap > vh) resolvedAxis = 'top';
    else if (axis === 'left' && r.left - pw - gap < 0) resolvedAxis = 'right';
    else if (axis === 'right' && r.right + pw + gap > vw) resolvedAxis = 'left';

    const align = placement.endsWith('-start') ? 'start'
        : placement.endsWith('-end') ? 'end'
        : 'center';

    const resolved: string = align === 'center' ? resolvedAxis : `${resolvedAxis}-${align}`;
    panel.setAttribute('data-placement', resolved);

    const triggerCenterX = r.left + r.width / 2;
    const triggerCenterY = r.top + r.height / 2;

    let top: number;
    let left: number;

    if (resolvedAxis === 'top' || resolvedAxis === 'bottom') {
        top = resolvedAxis === 'top' ? r.top - ph - gap : r.bottom + gap;
        left = align === 'start' ? r.left
            : align === 'end' ? r.right - pw
            : triggerCenterX - pw / 2;
    } else {
        left = resolvedAxis === 'left' ? r.left - pw - gap : r.right + gap;
        top = triggerCenterY - ph / 2;
    }

    // Clamp to viewport
    const clampedLeft = Math.max(8, Math.min(left, vw - pw - 8));
    const clampedTop = Math.max(8, Math.min(top, vh - ph - 8));

    // Arrow position relative to panel — points at trigger center, clamped to text area for start/end
    if (resolvedAxis === 'top' || resolvedAxis === 'bottom') {
        const padding = parseFloat(getComputedStyle(panel).paddingInlineStart) || 12;
        const half = arrowSize / 2;
        const rawX = triggerCenterX - clampedLeft;
        const arrowX = align === 'start'
            ? Math.max(rawX, padding + half)
            : align === 'end'
            ? Math.min(rawX, pw - padding - half)
            : rawX;
        panel.style.setProperty('--_arrow-x', `${arrowX}px`);
        panel.style.removeProperty('--_arrow-y');
    } else {
        panel.style.setProperty('--_arrow-y', `${triggerCenterY - clampedTop}px`);
        panel.style.removeProperty('--_arrow-x');
    }

    panel.style.top = `${clampedTop}px`;
    panel.style.left = `${clampedLeft}px`;
    panel.style.visibility = '';
}

function show(trigger: Element): void {
    const content = trigger.getAttribute(ATTR);
    if (!content) return;

    const placement = (trigger.getAttribute(ATTR_PLACEMENT) ?? 'top') as Placement;
    const panel = getOrCreateTip();

    if (source && source !== trigger) {
        hide();
    }

    source = trigger;
    panel.textContent = content;
    trigger.setAttribute('aria-describedby', TOOLTIP_ID);

    place(trigger, panel, placement);
    panel.hidden = false;
}

function hide(): void {
    clearTimeout(hoverTimer);
    if (tip) {
        tip.hidden = true;
    }
    if (source) {
        source.removeAttribute('aria-describedby');
        source = undefined;
    }
}

function handleMouseover(e: Event): void {
    const target = (e.target as Element).closest?.(`[${ATTR}]`);
    if (!target) return;
    if (target === source) return;

    clearTimeout(hoverTimer);
    hoverTimer = window.setTimeout(() => show(target), DELAY_HOVER);
}

function handleMouseout(e: Event): void {
    const related = (e as MouseEvent).relatedTarget as Node | null;
    if (tip && related && tip.contains(related)) return; // mouse moved onto tooltip panel
    clearTimeout(hoverTimer);
    if (source && !(source as Element).contains(related)) {
        hide();
    }
}

function handleFocusin(e: Event): void {
    const target = (e.target as Element).closest?.(`[${ATTR}]`);
    if (!target) return;
    clearTimeout(hoverTimer);
    show(target);
}

function handleFocusout(e: Event): void {
    const related = (e as FocusEvent).relatedTarget as Node | null;
    if (source && !source.contains(related)) {
        hide();
    }
}

function handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && source) {
        hide();
    }
}

document.addEventListener('mouseover', handleMouseover);
document.addEventListener('mouseout', handleMouseout);
document.addEventListener('focusin', handleFocusin);
document.addEventListener('focusout', handleFocusout);
document.addEventListener('keydown', handleKeydown);
