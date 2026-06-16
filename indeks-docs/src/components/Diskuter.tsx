import Admonition from '@theme/Admonition';
import { type ReactNode } from 'react';

type DiskuterProps = {
    title: string;
    children: ReactNode;
};

// Markerer en åpen avveiing som teamet skal stoppe og diskutere ved gjennomgang.
// Sammendrag (title) vises alltid; detaljer er kollapset bak <details>. Bruker
// Docusaurus warning-admonition for gul farge — signaliserer "ikke ferdig" uten
// å se ut som en feil. Søk etter <Diskuter for å finne åpne TODO-er.
export function Diskuter({ title, children }: DiskuterProps) {
    return (
        <Admonition type="warning" title="TODO – diskuter">
            <details>
                <summary>{title}</summary>
                <div style={{ marginTop: 'var(--ix-spacing-sm, 0.5rem)' }}>
                    {children}
                </div>
            </details>
        </Admonition>
    );
}

export default Diskuter;
