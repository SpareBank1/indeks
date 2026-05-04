import { Button, Heading, Text } from '@sb1/indeks-react';
import { usePreferences } from '@site/src/preferences/PreferencesContext';
import { OPEN_PREFERENCES_EVENT } from './PreferencesButton';
import styles from './PreferencesOnboarding.module.css';

const openPreferences = () =>
    window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT));

export default function PreferencesOnboarding() {
    const { preferences } = usePreferences();

    if (preferences.onboarded) {
        return (
            <div className={styles.summary}>
                <Text as="p" size="sm" className={styles.summaryText}>
                    {describe(preferences)}
                </Text>
                <Button variant="tertiary" size="sm" onClick={openPreferences}>
                    Endre innstillinger
                </Button>
            </div>
        );
    }

    return (
        <section className={styles.card}>
            <Heading as="h2" size="sm">
                Tilpass dokumentasjonen
            </Heading>
            <Text as="p">
                Velg teknologi og andre innstillinger så tilpasser vi eksemplene til stacken din.
            </Text>
            <div className={styles.choices}>
                <Button variant="primary" onClick={openPreferences}>
                    Åpne innstillinger
                </Button>
            </div>
        </section>
    );
}

function describe(prefs: { variant: string; showCodeByDefault: boolean; mobilbank: boolean }): string {
    const bits: string[] = [];
    bits.push(prefs.variant === 'react' ? 'React-eksempler' : 'HTML-eksempler');
    bits.push(prefs.showCodeByDefault ? 'med kode synlig' : 'med kode skjult');
    if (prefs.mobilbank) bits.push('mobilbank-modus på');
    return `Du ser ${bits.join(', ')}.`;
}
