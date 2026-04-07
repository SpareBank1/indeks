import React from 'react';

// ── Datatyper ─────────────────────────────────────────────────────────────

interface ConsumerResponsibility {
    summary: string;
    details: string;
    wcag: string[];
}

interface Issue {
    summary: string;
    details: string;
    wcag: string[];
}

interface HandledCriterion {
    id: string;
    level: 'A' | 'AA' | 'AAA';
    title: string;
    notes: string;
}

interface NotRelevantCriterion {
    id: string;
    title: string;
    reason: string;
}

interface KeyboardEntry {
    key: string;
    action: string;
}

interface AccessibilityData {
    component: string;
    lastReviewed: string;
    consumerResponsibilities: ConsumerResponsibility[];
    issues: Issue[];
    handled: HandledCriterion[];
    notRelevant: NotRelevantCriterion[];
    keyboard?: KeyboardEntry[];
    screenReader?: string[];
}

interface AccessibilityTableProps {
    data: AccessibilityData;
}

// ── Styling ───────────────────────────────────────────────────────────────

const sectionStyles: React.CSSProperties = {
    border: '1px solid var(--ix-color-border-main-default)',
    borderRadius: 'var(--ix-border-radius-sm)',
    padding: 'var(--ix-spacing-md)',
    marginBottom: 'var(--ix-spacing-md)',
};

const dangerSectionStyles: React.CSSProperties = {
    ...sectionStyles,
    borderColor: 'var(--ix-color-border-danger-default)',
};

const summaryStyles: React.CSSProperties = {
    cursor: 'pointer',
    fontWeight: 'var(--ix-font-weight-medium)' as string,
};

const wcagTagStyles: React.CSSProperties = {
    fontSize: 'var(--ix-font-size-sm)',
    color: 'var(--ix-color-foreground-main-subtle)',
};

const countBadgeStyles: React.CSSProperties = {
    fontSize: 'var(--ix-font-size-sm)',
    color: 'var(--ix-color-foreground-main-subtle)',
    fontWeight: 'normal',
};

// ── Komponent ─────────────────────────────────────────────────────────────

export default function AccessibilityTable({ data }: AccessibilityTableProps) {
    const hasIssues = data.issues.length > 0;
    const hasConsumer = data.consumerResponsibilities.length > 0;

    const totalCriteria =
        data.consumerResponsibilities.reduce((sum, item) => sum + item.wcag.length, 0) +
        data.issues.reduce((sum, item) => sum + item.wcag.length, 0) +
        data.handled.length +
        data.notRelevant.length;

    return (
        <div className="ix-flex ix-flex-col ix-gap-md">
            <p style={{ color: 'var(--ix-color-foreground-main-subtle)', margin: 0 }}>
                Sist gjennomgått: {data.lastReviewed} — {totalCriteria} av 56 WCAG 2.2-kriterier vurdert
            </p>

            {/* Ditt ansvar — alltid synlig */}
            {hasConsumer && (
                <div style={sectionStyles}>
                    <h4 style={{ marginTop: 0 }}>Ditt ansvar</h4>
                    <p style={{ color: 'var(--ix-color-foreground-main-subtle)', marginTop: 0 }}>
                        Disse tingene må teamet selv sørge for.
                    </p>
                    {data.consumerResponsibilities.map((item, i) => (
                        <details key={i} style={{ marginBottom: 'var(--ix-spacing-sm)' }}>
                            <summary style={summaryStyles}>
                                {item.summary}
                                <span style={wcagTagStyles}> — WCAG {item.wcag.join(', ')}</span>
                            </summary>
                            <p style={{ marginTop: 'var(--ix-spacing-xs)', paddingLeft: 'var(--ix-spacing-md)' }}>
                                {item.details}
                            </p>
                        </details>
                    ))}
                </div>
            )}

            {/* Ikke på plass — alltid synlig, danger-styling */}
            {hasIssues && (
                <div style={dangerSectionStyles}>
                    <h4 style={{ marginTop: 0, color: 'var(--ix-color-foreground-danger-default)' }}>
                        Ikke på plass
                    </h4>
                    {data.issues.map((item, i) => (
                        <details key={i} style={{ marginBottom: 'var(--ix-spacing-sm)' }}>
                            <summary style={summaryStyles}>
                                {item.summary}
                                <span style={wcagTagStyles}> — WCAG {item.wcag.join(', ')}</span>
                            </summary>
                            <p style={{ marginTop: 'var(--ix-spacing-xs)', paddingLeft: 'var(--ix-spacing-md)' }}>
                                {item.details}
                            </p>
                        </details>
                    ))}
                </div>
            )}

            {/* Håndtert av komponenten — collapsed */}
            {data.handled.length > 0 && (
                <details style={sectionStyles}>
                    <summary style={summaryStyles}>
                        Håndtert av komponenten{' '}
                        <span style={countBadgeStyles}>({data.handled.length} kriterier bestått)</span>
                    </summary>
                    <table style={{ marginTop: 'var(--ix-spacing-sm)' }}>
                        <thead>
                            <tr>
                                <th>Kriterium</th>
                                <th>Nivå</th>
                                <th>Hva komponenten gjør</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.handled.map((c) => (
                                <tr key={c.id}>
                                    <td>
                                        <strong>{c.id}</strong> {c.title}
                                    </td>
                                    <td>{c.level}</td>
                                    <td>{c.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </details>
            )}

            {/* Ikke relevant — collapsed */}
            {data.notRelevant.length > 0 && (
                <details style={sectionStyles}>
                    <summary style={summaryStyles}>
                        Ikke relevant for denne komponenten{' '}
                        <span style={countBadgeStyles}>({data.notRelevant.length} kriterier)</span>
                    </summary>
                    <table style={{ marginTop: 'var(--ix-spacing-sm)' }}>
                        <thead>
                            <tr>
                                <th>Kriterium</th>
                                <th>Hvorfor ikke relevant</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.notRelevant.map((c) => (
                                <tr key={c.id}>
                                    <td>
                                        <strong>{c.id}</strong> {c.title}
                                    </td>
                                    <td>{c.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </details>
            )}

            {/* Tastatur */}
            {data.keyboard && data.keyboard.length > 0 && (
                <div>
                    <h4>Tastaturnavigasjon</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Tast</th>
                                <th>Handling</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.keyboard.map((entry) => (
                                <tr key={entry.key}>
                                    <td>
                                        <kbd>{entry.key}</kbd>
                                    </td>
                                    <td>{entry.action}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Skjermleser */}
            {data.screenReader && data.screenReader.length > 0 && (
                <div>
                    <h4>Skjermleser</h4>
                    <ul>
                        {data.screenReader.map((announcement, index) => (
                            <li key={index}>{announcement}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
