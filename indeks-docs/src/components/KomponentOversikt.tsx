import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import { Icon, RadioGroup } from '@sb1/indeks-react';
import React, { useState } from 'react';
import { kategorier, komponenter, type KomponentOppføring } from '../data/komponenter';
import styles from './KomponentOversikt.module.css';

type Visning = 'alfabetisk' | 'kategori';

const alfabetisk = [...komponenter].sort((a, b) => a.navn.localeCompare(b.navn, 'nb'));

function Kortliste({ oppføringer }: { oppføringer: KomponentOppføring[] }) {
    return (
        <ul className={styles.liste}>
            {oppføringer.map((k) => (
                <li key={k.href} className={`ix-card ${styles.kort}`}>
                    {/* Forhåndsvisningen er et søsken av lenken, ikke inni den: interaktive
                        elementer i <a> er ugyldig HTML selv når de er inerte. Den rendres bare
                        i nettleseren, fordi web componentene bygger om light DOM-en sin før
                        React rekker å hydrere, og da stemmer ikke server-HTML-en. */}
                    <div className={styles.forhåndsvisning} inert aria-hidden="true">
                        <BrowserOnly>{() => k.forhåndsvisning}</BrowserOnly>
                    </div>
                    <div className={styles.tekst}>
                        <Link to={k.href} className={styles.lenke}>
                            {k.navn}
                            <Icon name="chevron_right" aria-hidden />
                        </Link>
                        <p className={styles.beskrivelse}>{k.beskrivelse}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default function KomponentOversikt() {
    const [visning, setVisning] = useState<Visning>('alfabetisk');

    return (
        <div className={styles.oversikt}>
            <RadioGroup
                variant="chip"
                orientation="horizontal"
                legend="Vis komponentene"
                name="komponent-visning"
                value={visning}
                onChange={(e) => setVisning(e.target.value as Visning)}
                options={[
                    { value: 'alfabetisk', label: 'Alfabetisk' },
                    { value: 'kategori', label: 'Etter kategori' },
                ]}
            />

            {visning === 'alfabetisk' ? (
                <Kortliste oppføringer={alfabetisk} />
            ) : (
                kategorier.map((kategori) => (
                    <section key={kategori}>
                        <h2>{kategori}</h2>
                        <Kortliste oppføringer={alfabetisk.filter((k) => k.kategori === kategori)} />
                    </section>
                ))
            )}
        </div>
    );
}
