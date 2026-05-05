import { useEffect, useRef, useState } from 'react';
import PreferencesPanel from './PreferencesPanel';
import PreferencesPopover from './PreferencesPopover';
import styles from './PreferencesButton.module.css';

export const OPEN_PREFERENCES_EVENT = 'indeks-docs:open-preferences';

export default function PreferencesButton() {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Lar andre komponenter (f.eks. banneret på komponentsider) åpne
    // popoveren ved å dispatche en custom event — slik at valget vises
    // forankret til tannhjulet i navbaren, ikke som en egen modal.
    useEffect(() => {
        const onOpen = () => setOpen(true);
        window.addEventListener(OPEN_PREFERENCES_EVENT, onOpen);
        return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, onOpen);
    }, []);

    return (
        <div className={styles.wrapper}>
            <button
                ref={triggerRef}
                type="button"
                className={styles.trigger}
                aria-label="Åpne innstillinger"
                aria-expanded={open}
                aria-haspopup="dialog"
                onClick={() => setOpen((o) => !o)}
            >
                <svg
                    aria-hidden="true"
                    focusable="false"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            </button>
            <PreferencesPopover
                open={open}
                onClose={() => setOpen(false)}
                anchorRef={triggerRef}
            >
                <PreferencesPanel showHeading={true} />
            </PreferencesPopover>
        </div>
    );
}
