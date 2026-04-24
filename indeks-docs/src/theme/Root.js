import { useEffect, useState } from 'react';

// Docusaurus tvinger et valgt tema (data-theme="dark"|"light" på <html>).
// Vi speiler dette ved å sette enten .ix-light-mode eller .ix-dark-mode
// på indeks-roten, slik at eksempler i docs følger Docusaurus-temaet
// i stedet for brukerens OS-preferanse.
export default function Root({ children }) {
    const [mode, setMode] = useState(null);

    useEffect(() => {
        const html = document.documentElement;
        const read = () => (html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
        setMode(read());
        const observer = new MutationObserver(() => setMode(read()));
        observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    const className = mode ? `ix-body ix-${mode}-mode` : 'ix-body';
    return <div className={className}>{children}</div>;
}
