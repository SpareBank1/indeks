import React from 'react';
import styles from './AdrMeta.module.css';

type AdrStatus = 'Utkast' | 'Forslag' | 'Besluttet' | 'Foreldet' | 'Erstattet';

interface StatusEntry {
    status: AdrStatus;
    dato: string;
}

interface AdrStatusLoggProps {
    historikk: StatusEntry[];
}

const statusColor: Record<AdrStatus, string> = {
    Utkast: 'utkast',
    Forslag: 'forslag',
    Besluttet: 'besluttet',
    Foreldet: 'foreldet',
    Erstattet: 'erstattet',
};

export default function AdrStatusLogg({ historikk }: AdrStatusLoggProps) {
    const gjeldende = historikk[historikk.length - 1];

    return (
        <div className={styles.meta}>
            <div className={styles.statusRad}>
                <span className={styles.label}>Status</span>
                <span className={`${styles.badge} ${styles[statusColor[gjeldende.status]]}`}>
                    {gjeldende.status}
                </span>
            </div>
            {historikk.length > 1 && (
                <table className={styles.tabell}>
                    <thead>
                        <tr>
                            <th colSpan={2}>Statuslogg</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...historikk].reverse().map((entry, i) => (
                            <tr key={i} className={i === 0 ? styles.gjeldende : ''}>
                                <td className={styles.datoKolonne}>{entry.dato}</td>
                                <td>
                                    <span className={`${styles.badge} ${styles[statusColor[entry.status]]}`}>
                                        {entry.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
