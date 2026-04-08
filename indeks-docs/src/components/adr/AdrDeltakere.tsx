import React from 'react';
import styles from './AdrDeltakere.module.css';

interface AdrDeltakereProps {
    utarbeidetAv: string | string[];
    beslutningstaker?: string;
    besluttetAv?: string;
    besluttetDato?: string;
    involvert?: string[];
    informert?: string[];
}

function Felt({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className={styles.felt}>
            <span className={styles.feltLabel}>{label}</span>
            <span className={styles.feltVerdi}>{children}</span>
        </div>
    );
}

function FeltListe({ label, items }: { label: string; items: string[] }) {
    return (
        <div className={styles.felt}>
            <span className={styles.feltLabel}>{label}</span>
            <ul className={styles.liste}>
                {items.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export default function AdrDeltakere({
    utarbeidetAv,
    beslutningstaker,
    besluttetAv,
    besluttetDato,
    involvert,
    informert,
}: AdrDeltakereProps) {
    const utarbeidetAvList = Array.isArray(utarbeidetAv) ? utarbeidetAv : [utarbeidetAv];
    const harBeslutning = beslutningstaker || besluttetAv || besluttetDato;

    return (
        <div className={styles.deltakere}>
            <p className={styles.overskrift}>Deltakere</p>

            <div className={styles.grid}>
                <div className={styles.gruppe}>
                    <Felt label="Utarbeidet av">
                        {utarbeidetAvList.join(', ')}
                    </Felt>
                    {involvert && involvert.length > 0 && (
                        <FeltListe label="Involvert" items={involvert} />
                    )}
                    {informert && informert.length > 0 && (
                        <FeltListe label="Informert" items={informert} />
                    )}
                </div>

                {harBeslutning && (
                    <div className={styles.gruppe}>
                        {beslutningstaker && (
                            <Felt label="Beslutningstaker">{beslutningstaker}</Felt>
                        )}
                        {besluttetAv && (
                            <Felt label="Besluttet av">{besluttetAv}</Felt>
                        )}
                        {besluttetDato && (
                            <Felt label="Besluttet dato">{besluttetDato}</Felt>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
