import { type ReactNode } from 'react';
import PlaygroundPreview from '@theme/Playground/Preview';
import PlaygroundEditor from '@theme/Playground/Editor';
import type { Props } from '@theme/Playground/Layout';
import { usePreferences } from '@site/src/preferences/PreferencesContext';
import styles from './styles.module.css';

// Preview alltid først, kode i en kollapset/åpen details under.
// Ignorerer position fra theme-config her — for designsystem-eksempler gir
// det mer mening å alltid se resultatet øverst.
export default function PlaygroundLayout(_props: Props): ReactNode {
    const { preferences } = usePreferences();
    return (
        <>
            <PlaygroundPreview />
            <details className={styles.editorDetails} open={preferences.showCodeByDefault}>
                <summary className={styles.editorSummary}>Kode</summary>
                <PlaygroundEditor />
            </details>
        </>
    );
}
