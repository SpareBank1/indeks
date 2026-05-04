import { useId } from 'react';
import { Heading } from '@sb1/indeks-react';
import { usePreferences } from '@site/src/preferences/PreferencesContext';
import styles from './PreferencesPanel.module.css';

type Props = {
    showHeading?: boolean;
};

export function PreferencesPanel({ showHeading = true }: Props) {
    const { preferences, setPreferences } = usePreferences();

    // Enhver endring i panelet markerer brukeren som "onboarded" slik at
    // banneret på komponentsider forsvinner etter første valg.
    const update = <K extends 'variant' | 'showCodeByDefault' | 'mobilbank'>(
        key: K,
        value: (typeof preferences)[K]
    ) => setPreferences({ [key]: value, onboarded: true } as Partial<typeof preferences>);

    return (
        <div className={styles.panel}>
            {showHeading && (
                <Heading as="h2" size="sm" className={styles.heading}>
                    Innstillinger
                </Heading>
            )}

            <ToggleRow
                title="Bruk Indeks med React"
                description="Når av vises HTML og web component-eksempler (<ix-field>)."
                checked={preferences.variant === 'react'}
                onChange={(checked) => update('variant', checked ? 'react' : 'html')}
            />

            <ToggleRow
                title="Vis kodeeksempler"
                description="Når av kollapses koden under live-eksemplet. Du kan alltid åpne 'Kode'."
                checked={preferences.showCodeByDefault}
                onChange={(checked) => update('showCodeByDefault', checked)}
            />

            <ToggleRow
                title="Mobilbank-modus"
                description="Slå på hvis du utvikler for mobilbanken eller andre MBC-apper."
                checked={preferences.mobilbank}
                onChange={(checked) => update('mobilbank', checked)}
            />
        </div>
    );
}

type ToggleRowProps = {
    title: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
};

function ToggleRow({ title, description, checked, onChange }: ToggleRowProps) {
    const id = useId();
    return (
        <label
            htmlFor={id}
            className={`${styles.row} ${checked ? styles.rowChecked : ''}`}
        >
            <span className={styles.text}>
                <span className={styles.title}>{title}</span>
                <span className={styles.description}>{description}</span>
            </span>
            <input
                id={id}
                type="checkbox"
                role="switch"
                className={styles.input}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span className={styles.switch} aria-hidden="true">
                <span className={styles.switchThumb} />
            </span>
        </label>
    );
}

export default PreferencesPanel;
