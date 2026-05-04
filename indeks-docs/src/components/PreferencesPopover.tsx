import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from '@sb1/indeks-react';
import { usePreferences } from '@site/src/preferences/PreferencesContext';
import styles from './PreferencesPopover.module.css';

type Props = {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    // Anchor-elementet popoveren skal plasseres ved.
    anchorRef: React.RefObject<HTMLElement | null>;
};

export function PreferencesPopover({ open, onClose, children, anchorRef }: Props) {
    const popoverRef = useRef<HTMLDivElement>(null);
    const { resetPreferences } = usePreferences();

    // Lukk på klikk utenfor.
    useEffect(() => {
        if (!open) return;
        const onPointerDown = (e: PointerEvent) => {
            const target = e.target as Node;
            if (popoverRef.current?.contains(target)) return;
            if (anchorRef.current?.contains(target)) return;
            onClose();
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [open, onClose, anchorRef]);

    // Lukk på Escape.
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            ref={popoverRef}
            className={styles.popover}
            role="dialog"
            aria-label="Innstillinger for dokumentasjonen"
        >
            <div className={styles.body}>{children}</div>
            <div className={styles.footer}>
                <Button variant="tertiary" size="sm" onClick={resetPreferences}>
                    Nullstill
                </Button>
                <Button variant="tertiary" size="sm" onClick={onClose}>
                    Lukk
                </Button>
            </div>
        </div>
    );
}

export default PreferencesPopover;
