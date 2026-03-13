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
        <main className={clsx('hero hero--primary ix-flex ix-flex-grow ix-justify-center ix-items-center', styles.heroBanner)}>
            <div className="container">
                <Heading as="h1" className="hero__title">
                    {siteConfig.title}
                </Heading>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Button as="a" size="lg" variant="primary" href={docsHref}>
                        Dokumentasjon
                    </Button>
                    <Button as="a" size="lg" variant="primary" href={storybookHref}>
                        Storybook
                    </Button>
                    <Button as="a" size="lg" variant="primary" href={eksempelHref}>
                        Eksempel App
                    </Button>
                </div>
            </div>
        </main>
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
        </Layout>
    );
}
