import React from 'react';
import { wcagCriteria } from '../data/wcag';

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
    notes: string;
}

interface NotRelevantCriterion {
    id: string;
    reason?: string;
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

const outerSectionStyles: React.CSSProperties = {
    border: '1px solid var(--ix-color-border-main-default)',
    borderRadius: 'var(--ix-border-radius-sm)',
    padding: 'var(--ix-spacing-md)',
};

const innerDetailsStyles: React.CSSProperties = {
    marginTop: 'var(--ix-spacing-sm)',
    paddingLeft: 'var(--ix-spacing-sm)',
    borderLeft: '2px solid var(--ix-color-border-main-default)',
};

const dangerInnerDetailsStyles: React.CSSProperties = {
    ...innerDetailsStyles,
    borderLeftColor: 'var(--ix-color-border-danger-default)',
};

const summaryStyles: React.CSSProperties = {
    cursor: 'pointer',
    fontWeight: 'var(--ix-font-weight-medium)' as string,
};

const summaryMetaStyles: React.CSSProperties = {
    fontSize: 'var(--ix-font-size-sm)',
    color: 'var(--ix-color-foreground-main-subtle)',
    fontWeight: 'normal',
};

const tableStyles: React.CSSProperties = {
    marginTop: 'var(--ix-spacing-sm)',
};

// ── Hjelpere ──────────────────────────────────────────────────────────────

interface ConsumerRow {
    id: string;
    summary: string;
    details: string;
}

function flattenConsumer(items: ConsumerResponsibility[]): ConsumerRow[] {
    return items.flatMap((item) =>
        item.wcag.map((id) => ({ id, summary: item.summary, details: item.details })),
    );
}

interface IssueRow {
    id: string;
    summary: string;
    details: string;
}

function flattenIssues(items: Issue[]): IssueRow[] {
    return items.flatMap((item) =>
        item.wcag.map((id) => ({ id, summary: item.summary, details: item.details })),
    );
}

// ── Komponent ─────────────────────────────────────────────────────────────

export default function AccessibilityTable({ data }: AccessibilityTableProps) {
    const consumerRows = flattenConsumer(data.consumerResponsibilities);
    const issueRows = flattenIssues(data.issues);
    const consumerCount = consumerRows.length;
    const handledCount = data.handled.length;
    const notRelevantCount = data.notRelevant.length;
    const issuesCount = issueRows.length;

    return (
        <div className="ix-flex ix-flex-col ix-gap-md">
            <p style={{ color: 'var(--ix-color-foreground-main-subtle)', margin: 0 }}>
                Sist gjennomgått: {data.lastReviewed} — alle 56 WCAG 2.2-kriterier vurdert
            </p>

            <details style={outerSectionStyles}>
                <summary style={summaryStyles}>
                    WCAG-kriterier
                    <span style={{ ...summaryMetaStyles, display: 'block', marginTop: 'var(--ix-spacing-xs)' }}>
                        {consumerCount} ditt ansvar · {handledCount} håndtert ·{' '}
                        {notRelevantCount} ikke relevant · {issuesCount} ikke på plass
                    </span>
                </summary>

                {/* Ditt ansvar */}
                {consumerCount > 0 && (
                    <details style={innerDetailsStyles}>
                        <summary style={summaryStyles}>
                            Ditt ansvar <span style={summaryMetaStyles}>({consumerCount})</span>
                        </summary>
                        <table style={tableStyles}>
                            <thead>
                                <tr>
                                    <th>Kriterium</th>
                                    <th>Nivå</th>
                                    <th>Hva du må gjøre</th>
                                </tr>
                            </thead>
                            <tbody>
                                {consumerRows.map((row, i) => {
                                    const criterion = wcagCriteria[row.id];
                                    return (
                                        <tr key={`${row.id}-${i}`}>
                                            <td>
                                                <strong>{row.id}</strong> {criterion?.title ?? row.id}
                                            </td>
                                            <td>{criterion?.level ?? '?'}</td>
                                            <td>
                                                <strong>{row.summary}.</strong> {row.details}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </details>
                )}

                {/* Håndtert av komponenten */}
                {handledCount > 0 && (
                    <details style={innerDetailsStyles}>
                        <summary style={summaryStyles}>
                            Håndtert av komponenten{' '}
                            <span style={summaryMetaStyles}>({handledCount})</span>
                        </summary>
                        <table style={tableStyles}>
                            <thead>
                                <tr>
                                    <th>Kriterium</th>
                                    <th>Nivå</th>
                                    <th>Hva komponenten gjør</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.handled.map((c) => {
                                    const criterion = wcagCriteria[c.id];
                                    return (
                                        <tr key={c.id}>
                                            <td>
                                                <strong>{c.id}</strong> {criterion?.title ?? c.id}
                                            </td>
                                            <td>{criterion?.level ?? '?'}</td>
                                            <td>{c.notes}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </details>
                )}

                {/* Ikke relevant */}
                {notRelevantCount > 0 && (
                    <details style={innerDetailsStyles}>
                        <summary style={summaryStyles}>
                            Ikke relevant <span style={summaryMetaStyles}>({notRelevantCount})</span>
                        </summary>
                        <table style={tableStyles}>
                            <thead>
                                <tr>
                                    <th>Kriterium</th>
                                    <th>Nivå</th>
                                    <th>Hvorfor ikke relevant</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.notRelevant.map((c) => {
                                    const criterion = wcagCriteria[c.id];
                                    return (
                                        <tr key={c.id}>
                                            <td>
                                                <strong>{c.id}</strong> {criterion?.title ?? c.id}
                                            </td>
                                            <td>{criterion?.level ?? '?'}</td>
                                            <td>{c.reason ?? criterion?.defaultReason ?? ''}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </details>
                )}

                {/* Ikke på plass */}
                {issuesCount > 0 && (
                    <details style={dangerInnerDetailsStyles}>
                        <summary
                            style={{
                                ...summaryStyles,
                                color: 'var(--ix-color-foreground-danger-default)',
                            }}
                        >
                            Ikke på plass <span style={summaryMetaStyles}>({issuesCount})</span>
                        </summary>
                        <table style={tableStyles}>
                            <thead>
                                <tr>
                                    <th>Kriterium</th>
                                    <th>Nivå</th>
                                    <th>Hva som mangler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issueRows.map((row, i) => {
                                    const criterion = wcagCriteria[row.id];
                                    return (
                                        <tr key={`${row.id}-${i}`}>
                                            <td>
                                                <strong>{row.id}</strong> {criterion?.title ?? row.id}
                                            </td>
                                            <td>{criterion?.level ?? '?'}</td>
                                            <td>
                                                <strong>{row.summary}.</strong> {row.details}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </details>
                )}
            </details>
        </div>
    );
}

// ── Tastatur og skjermleser ───────────────────────────────────────────────

interface KeyboardAndScreenReaderProps {
    data: Pick<AccessibilityData, 'keyboard' | 'screenReader'>;
}

export function KeyboardAndScreenReader({ data }: KeyboardAndScreenReaderProps) {
    const hasKeyboard = data.keyboard && data.keyboard.length > 0;
    const hasScreenReader = data.screenReader && data.screenReader.length > 0;

    if (!hasKeyboard && !hasScreenReader) return null;

    return (
        <div className="ix-flex ix-flex-col ix-gap-md">
            {hasKeyboard && (
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
                            {data.keyboard!.map((entry) => (
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

            {hasScreenReader && (
                <div>
                    <h4>Skjermleser</h4>
                    <ul>
                        {data.screenReader!.map((announcement, index) => (
                            <li key={index}>{announcement}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
