import { useState, type ReactNode } from 'react';
import PlaygroundPreview from '@theme/Playground/Preview';
import PlaygroundEditor from '@theme/Playground/Editor';
import { usePreferences } from '@site/src/preferences/PreferencesContext';
import type { Variant } from '@site/src/preferences/storage';
import styles from './styles.module.css';

export default function PlaygroundLayout(): ReactNode {
    const { preferences, setPreference } = usePreferences();
    const [open, setOpen] = useState(preferences.showCodeByDefault);

    return (
        <>
            <PlaygroundPreview />
            <div className={styles.editorWrapper}>
                {open && (
                    <div className={styles.variantToggle}>
                        {(['react', 'html'] as Variant[]).map((v) => (
                            <button
                                key={v}
                                className={`${styles.variantBtn} ${preferences.variant === v ? styles.variantBtnActive : ''}`}
                                onClick={() => setPreference('variant', v)}
                            >
                                {v === 'react' ? 'React' : 'HTML'}
                            </button>
                        ))}
                    </div>
                )}
                <details
                    className={styles.editorDetails}
                    open={preferences.showCodeByDefault}
                    onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
                >
                    <summary className={styles.editorSummary}>Kode</summary>
                    <PlaygroundEditor />
                </details>
            </div>
        </>
    );
}
