import React from 'react';

interface TokenValue {
    value: string | number;
    description?: string;
}

interface TokenGroup {
    [key: string]: TokenValue;
}

interface UtilsTableProps {
    tokens: TokenGroup;
    prefix: string;
}

export default function UtilsTable({ tokens, prefix }: UtilsTableProps) {
    // Filter out properties starting with underscore
    const filteredTokens = Object.entries(tokens).filter(([key]) => !key.startsWith('_'));

    return (
        <table>
            <thead>
                <tr>
                    <th>CSS klasse</th>
                    <th>Verdi</th>
                    <th>Beskrivelse</th>
                </tr>
            </thead>
            <tbody>
                {filteredTokens.map(([key, { value, description }]) => (
                    <tr key={key}>
                        <td>
                            <code>
                                .ix-{prefix}-{key}
                            </code>
                        </td>
                        <td>{value}</td>
                        <td>{description || ''}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
