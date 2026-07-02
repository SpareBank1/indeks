import React, { useState, useMemo } from 'react';
import { Icon } from '@sb1/indeks-react';
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

function CopyableName({ mdNavn }: { mdNavn: string }) {
    const [copied, setCopied] = useState(false);

    async function copy() {
        if (!navigator.clipboard) return;
        await navigator.clipboard.writeText(mdNavn);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    }

    return (
        <button
            type="button"
            onClick={copy}
            aria-label={`Kopier ${mdNavn}`}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4em',
                border: 'none',
                background: 'none',
                padding: '0.15em 0.3em',
                margin: '-0.15em -0.3em',
                borderRadius: 'var(--ix-border-radius-sm)',
                cursor: 'pointer',
                color: 'inherit',
                font: 'inherit',
            }}
        >
            <code style={{ fontSize: 'var(--ix-font-size-sm)', wordBreak: 'break-all' }}>{mdNavn}</code>
            {copied ? (
                <span style={{ fontSize: 'var(--ix-font-size-xs)', color: 'var(--ix-color-foreground-success-default)' }}>
                    Kopiert!
                </span>
            ) : (
                <Icon name="content_copy" size="sm" aria-hidden style={{ opacity: 0.5 }} />
            )}
        </button>
    );
}

function IconRow({ entry }: { entry: IconEntry }) {
    return (
        <tr>
            <td style={{ width: '2.5rem', textAlign: 'center' }}>
                <Icon name={entry.mdNavn} />
            </td>
            <td>
                <CopyableName mdNavn={entry.mdNavn} />
            </td>
            <td style={{ textAlign: 'center' }}>
                <span style={{ color: tierColor[entry.tier], fontSize: 'var(--ix-font-size-sm)' }}>
                    {entry.appAntall}
                </span>
            </td>
        </tr>
    );
}

export default function IconAnalyseTable() {
    const [sok, setSok] = useState('');
    const [visTier, setVisTier] = useState<Set<number>>(new Set([1, 2, 3]));

    const filtrerte = useMemo(() => {
        const q = sok.toLowerCase().trim();
        return ikoner.filter((e) => {
            if (!visTier.has(e.tier)) return false;
            if (!q) return true;
            return e.mdNavn.includes(q);
        });
    }, [sok, visTier]);

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
                    placeholder="Søk på Material Design-navn…"
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
                </div>
            </div>

            <p style={{ margin: 0, fontSize: 'var(--ix-font-size-sm)', color: 'var(--ix-color-foreground-main-subtle)' }}>
                Viser {filtrerte.length} av {ikoner.length} ikoner. Klikk på et navn for å kopiere det.
            </p>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ix-font-size-sm)' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--ix-color-border-main-default)' }}>
                            <th style={{ padding: '0.5em', width: '2.5rem' }}></th>
                            <th style={{ padding: '0.5em', textAlign: 'left' }}>Material Design-navn</th>
                            <th style={{ padding: '0.5em', textAlign: 'center', width: '5rem' }}>Apper</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrerte.map((entry) => (
                            <IconRow key={entry.mdNavn} entry={entry} />
                        ))}
                        {filtrerte.length === 0 && (
                            <tr>
                                <td
                                    colSpan={3}
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
