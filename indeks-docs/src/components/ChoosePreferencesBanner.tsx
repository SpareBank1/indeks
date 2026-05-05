import { useLocation } from '@docusaurus/router';
import { Button, Text } from '@sb1/indeks-react';
import { usePreferences } from '@site/src/preferences/PreferencesContext';
import { OPEN_PREFERENCES_EVENT } from './PreferencesButton';
import styles from './ChoosePreferencesBanner.module.css';

// Vises kun på komponentsider når brukeren ikke har valgt teknologi ennå.
// Åpner preferanse-popoveren via tannhjulet i navbaren (custom event) slik
// at brukeren ser hvor innstillingene ligger for senere bruk.
export default function ChoosePreferencesBanner() {
    const { preferences, hydrated } = usePreferences();
    const { pathname } = useLocation();

    const onComponentPage = pathname.includes('/docs/komponenter/');
    // Vent med å rendre til localStorage er lest — ellers flasher banneret
    // for brukere som allerede har onboardet (SSR/første render viser defaults).
    if (!hydrated || !onComponentPage || preferences.onboarded) return null;

    return (
        <div className={styles.banner} role="region" aria-label="Velg teknologi">
            <Text as="p" size="sm" className={styles.text}>
                Velg teknologi så tilpasser vi eksemplene til stacken din.
            </Text>
            <Button
                variant="primary"
                size="sm"
                onClick={() => window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT))}
            >
                Velg teknologi
            </Button>
        </div>
    );
}
