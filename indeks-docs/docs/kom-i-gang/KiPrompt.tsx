import { useEffect, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';

// Prompten lenker til siden den står på. SSR bruker siteConfig.url (prod);
// på klienten byttes origin etter hydrering, så preview og localhost viser sin egen URL.
export const KiPromptBlock = () => {
    const { siteConfig } = useDocusaurusContext();
    const { pathname } = useLocation();
    const [url, setUrl] = useState(`${siteConfig.url}${pathname}`.replace(/\/$/, ''));

    useEffect(() => {
        setUrl(`${window.location.origin}${pathname}`.replace(/\/$/, ''));
    }, [pathname]);

    return (
        <CodeBlock language="text">
            {`Sett opp nettleserstøtte i prosjektet etter
${url}.
Flett inn i eksisterende konfigurasjonsfiler, ikke erstatt dem.
Ikke skru av regler eller bruk warn for å få sjekkene grønne.
Kjør lint og typesjekk til slutt, og vis meg resultatet.`}
        </CodeBlock>
    );
};
