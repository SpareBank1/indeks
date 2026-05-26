import React, { useState, useMemo } from 'react';
import { Icon, type MaterialDesignIconName } from '@sb1/indeks-react';
import { ikoner, type IconEntry } from '../data/iconAnalyseData';

const tierLabel: Record<number, string> = {
    1: 'Tier 1 — 3+ apper',
    2: 'Tier 2 — 2 apper',
    3: 'Tier 3 — 1 app',
};

const tierColor: Record<number, string> = {
    1: 'var(--ix-color-foreground-success-default)',
    2: 'var(--ix-color-foreground-warning-default)',
    3: 'var(--ix-color-foreground-main-subtle)',
};

function IconPreview({ mdNavn }: { mdNavn: string }) {
    return <Icon materialDesignName={mdNavn as MaterialDesignIconName} />;
}

function MergeTag({ mergeMed }: { mergeMed: string }) {
    return (
        <span
            style={{
                display: 'inline-block',
                fontSize: 'var(--ix-font-size-xs)',
                padding: '0 0.35em',
                borderRadius: '3px',
                background: 'var(--ix-color-background-warning-subtle)',
                color: 'var(--ix-color-foreground-warning-default)',
                border: '1px solid var(--ix-color-border-warning-default)',
                whiteSpace: 'nowrap',
            }}
        >
            slå sammen → {mergeMed}
        </span>
    );
}

function IconRow({ entry }: { entry: IconEntry }) {
    return (
        <tr>
            <td style={{ width: '2.5rem', textAlign: 'center' }}>
                <IconPreview mdNavn={entry.mdNavn} />
            </td>
            <td>
                <code style={{ fontSize: 'var(--ix-font-size-sm)', wordBreak: 'break-all' }}>{entry.mdNavn}</code>
            </td>
            <td>
                {entry.norskNavn ? (
                    <code style={{ fontSize: 'var(--ix-font-size-sm)', fontWeight: 'bold' }}>{entry.norskNavn}</code>
                ) : (
                    <span style={{ color: 'var(--ix-color-foreground-main-subtle)', fontSize: 'var(--ix-font-size-sm)' }}>
                        —
                    </span>
                )}
            </td>
            <td style={{ fontSize: 'var(--ix-font-size-sm)' }}>
                {entry.aliaser?.map((a) => (
                    <code
                        key={a}
                        style={{
                            display: 'inline-block',
                            marginRight: '0.3em',
                            marginBottom: '0.2em',
                            padding: '0 0.3em',
                            background: 'var(--ix-color-background-neutral-subtle)',
                            borderRadius: '3px',
                            wordBreak: 'break-all',
                        }}
                    >
                        {a}
                    </code>
                ))}
            </td>
            <td style={{ textAlign: 'center' }}>
                <span style={{ color: tierColor[entry.tier], fontSize: 'var(--ix-font-size-sm)' }}>
                    {entry.appAntall}
                </span>
            </td>
            <td style={{ fontSize: 'var(--ix-font-size-sm)', color: 'var(--ix-color-foreground-main-subtle)' }}>
                {entry.kontekstbruk?.map((k, i) => (
                    <span key={i} style={{ display: 'block' }}>{k}</span>
                ))}
            </td>
            <td style={{ fontSize: 'var(--ix-font-size-sm)' }}>
                {entry.mergeMed && <MergeTag mergeMed={entry.mergeMed} />}
                {entry.notat && (
                    <span style={{ color: 'var(--ix-color-foreground-main-subtle)', display: entry.mergeMed ? 'block' : 'inline', marginTop: entry.mergeMed ? '0.3em' : undefined }}>{entry.notat}</span>
                )}
            </td>
        </tr>
    );
}

export default function IconAnalyseTable() {
    const [sok, setSok] = useState('');
    const [visTier, setVisTier] = useState<Set<number>>(new Set([1, 2, 3]));
    const [visBareFletting, setVisBareFletting] = useState(false);

    const filtrerte = useMemo(() => {
        const q = sok.toLowerCase().trim();
        return ikoner.filter((e) => {
            if (!visTier.has(e.tier)) return false;
            if (visBareFletting && !e.mergeMed) return false;
            if (!q) return true;
            return (
                e.mdNavn.includes(q) ||
                (e.norskNavn?.includes(q) ?? false) ||
                (e.aliaser?.some((a) => a.includes(q)) ?? false)
            );
        });
    }, [sok, visTier, visBareFletting]);

    function toggleTier(t: number) {
        setVisTier((prev) => {
            const next = new Set(prev);
            if (next.has(t)) {
                next.delete(t);
            } else {
                next.add(t);
            }
            return next;
        });
    }

    const antallMedFletting = ikoner.filter((e) => e.mergeMed).length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ix-spacing-md)' }}>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--ix-spacing-sm)',
                    alignItems: 'center',
                }}
            >
                <input
                    type="search"
                    placeholder="Søk på MD-navn, norsk navn eller alias…"
                    value={sok}
                    onChange={(e) => setSok(e.target.value)}
                    style={{
                        flex: '1 1 260px',
                        padding: '0.4em 0.7em',
                        border: '1px solid var(--ix-color-border-main-default)',
                        borderRadius: 'var(--ix-border-radius-sm)',
                        fontSize: 'var(--ix-font-size-sm)',
                        background: 'var(--ix-color-background-main-default)',
                        color: 'var(--ix-color-foreground-main-default)',
                    }}
                />
                <div style={{ display: 'flex', gap: 'var(--ix-spacing-xs)', flexWrap: 'wrap' }}>
                    {[1, 2, 3].map((t) => (
                        <label
                            key={t}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3em',
                                cursor: 'pointer',
                                fontSize: 'var(--ix-font-size-sm)',
                                color: visTier.has(t) ? tierColor[t] : 'var(--ix-color-foreground-main-subtle)',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={visTier.has(t)}
                                onChange={() => toggleTier(t)}
                            />
                            {tierLabel[t]}
                        </label>
                    ))}
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3em',
                            cursor: 'pointer',
                            fontSize: 'var(--ix-font-size-sm)',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={visBareFletting}
                            onChange={() => setVisBareFletting((p) => !p)}
                        />
                        Bare kandidater for sammenslåing ({antallMedFletting})
                    </label>
                </div>
            </div>

            <p style={{ margin: 0, fontSize: 'var(--ix-font-size-sm)', color: 'var(--ix-color-foreground-main-subtle)' }}>
                Viser {filtrerte.length} av {ikoner.length} ikoner
            </p>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ix-font-size-sm)' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--ix-color-border-main-default)' }}>
                            <th style={{ padding: '0.5em', width: '2.5rem' }}></th>
                            <th style={{ padding: '0.5em', textAlign: 'left', width: '8rem' }}>MD-navn</th>
                            <th style={{ padding: '0.5em', textAlign: 'left', width: '7rem' }}>Norsk navn</th>
                            <th style={{ padding: '0.5em', textAlign: 'left', width: '7rem' }}>Aliaser</th>
                            <th style={{ padding: '0.5em', textAlign: 'center' }}>Apper</th>
                            <th style={{ padding: '0.5em', textAlign: 'left' }}>Faktisk bruk i kildekoden</th>
                            <th style={{ padding: '0.5em', textAlign: 'left' }}>Notat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrerte.map((entry) => (
                            <IconRow key={entry.mdNavn} entry={entry} />
                        ))}
                        {filtrerte.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    style={{
                                        padding: 'var(--ix-spacing-lg)',
                                        textAlign: 'center',
                                        color: 'var(--ix-color-foreground-main-subtle)',
                                    }}
                                >
                                    Ingen ikoner matcher søket
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
