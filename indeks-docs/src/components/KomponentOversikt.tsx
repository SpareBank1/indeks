import Link from '@docusaurus/Link';
import { Card, RadioGroup } from '@sb1/indeks-react';
import React, { useState } from 'react';
import { kategorier, komponenter, type KomponentOppføring } from '../data/komponenter';
import styles from './KomponentOversikt.module.css';

type Visning = 'alfabetisk' | 'kategori';

const alfabetisk = [...komponenter].sort((a, b) => a.navn.localeCompare(b.navn, 'nb'));

function Kortliste({ oppføringer, titleAs }: { oppføringer: KomponentOppføring[]; titleAs: 'h2' | 'h3' }) {
    return (
        <ul className={styles.liste}>
            {oppføringer.map((k) => (
                <li key={k.href}>
                    <Card
                        variant="large-vertical"
                        linkAs={Link}
                        href={k.href}
                        title={k.navn}
                        titleAs={titleAs}
                        description={k.beskrivelse}
                        mediaType="illustration"
                        className={styles.kort}
                        media={
                            <div className={styles.illustrasjon}>
                                <k.illustrasjon />
                            </div>
                        }
                    />
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
                <Kortliste oppføringer={alfabetisk} titleAs="h2" />
            ) : (
                kategorier.map((kategori) => (
                    <section key={kategori}>
                        <h2>{kategori}</h2>
                        <Kortliste oppføringer={alfabetisk.filter((k) => k.kategori === kategori)} titleAs="h3" />
                    </section>
                ))
            )}
        </div>
    );
}
