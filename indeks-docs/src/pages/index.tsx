import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Button } from '@sb1/indeks-react';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './index.module.css';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    // Detect localhost for Storybook and Eksempel links
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    const storybookHref = isLocalhost ? 'http://localhost:6006' : './storybook/';
    const eksempelHref = isLocalhost
        ? 'http://localhost:5173/eksempel/#/eksempelsider/oversikt'
        : './eksempel/#/eksempelsider/oversikt';
    const docsHref = isLocalhost ? 'http://localhost:3000/docs/hjem/' : './docs/hjem';
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <Heading as="h1" className="hero__title">
                    {siteConfig.title}
                </Heading>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Button as="a" className="button button--secondary button--lg" href={docsHref}>
                        Dokumentasjon
                    </Button>
                    <a className="button button--outline button--lg" href={storybookHref}>
                        Storybook
                    </a>
                    <a className="button button--outline button--lg" href={eksempelHref}>
                        Eksempel App
                    </a>
                </div>
            </div>
        </header>
    );
}

export default function Home(): ReactNode {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`${siteConfig.title} - SpareBank 1 sitt designsystem`}
            description="Felles retningslinjer og komponenter som hjelper oss med å lage helhetlige, brukervennlige, inkluderende løsninger for kundene våre"
            wrapperClassName="ix-body"
        >
            <HomepageHeader />
            <main>
                <h2>Mer enn bare et komponentbibliotek</h2>
                Indeks er en helhetlig tilnærming til design og utvikling som:
                <ul className="ix-list-disc ix-pl-md">
                    <li className="ix-py-2xs">**Sikrer konsistens** på tvers av alle våre digitale tjenester</li>
                    <li className="ix-py-2xs">**Øker hastigheten** på design- og utviklingsprosessen</li>
                    <li className="ix-py-2xs">**Forbedrer tilgjengeligheten** for alle brukere</li>
                    <li className="ix-py-2xs">**Reduserer vedlikeholdskostnader** gjennom gjenbruk av komponenter</li>
                </ul>
                Det er utviklet for designere, utviklere og andre som har interesse av å lage gode brukeropplevelser på
                tvers av SpareBank 1 sine digitale flater.{' '}
            </main>
        </Layout>
    );
}
