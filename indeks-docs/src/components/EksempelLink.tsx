import React from 'react';

// Eksempelappen kjører som en separat hash-rutet SPA. Lokalt bor den på Vite sin
// dev-server (:5173); i bygget docs-nettsted deployes den som underkatalog (./eksempel).
// Vi kan ikke bruke en enkel relativ lenke fordi de to tilfellene har ulik origin —
// derfor denne klientside-deteksjonen, samlet ett sted (brukes av landingssiden og docs).
export function eksempelHref(hashPath: string): string {
    const path = hashPath.replace(/^#?\/?/, '');
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    // Absolutt sti i bygget nettsted (eksempel deployes på /eksempel/), ikke relativ —
    // en relativ ./eksempel/ resolves feil fra docs-undersider (og Docusaurus flagger den).
    return isLocalhost ? `http://localhost:5173/eksempel/#/${path}` : `/eksempel/#/${path}`;
}

interface EksempelLinkProps {
    /** Hash-rute i eksempelappen, f.eks. `internTesting/form-validering`. */
    to: string;
    children: React.ReactNode;
}

/**
 * Lenke til en side i eksempelappen som virker både lokalt og i bygget docs.
 * Ren `<a>` (ikke Docusaurus `<Link>`): eksempelappen er et separat SPA, ikke en
 * docs-rute, så den skal ikke gjennom rute-oppslag/brutt-lenke-sjekk.
 */
export default function EksempelLink({ to, children }: EksempelLinkProps) {
    return <a href={eksempelHref(to)}>{children}</a>;
}
