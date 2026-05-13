import Footer from '@theme-original/DocItem/Footer';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { WrapperProps } from '@docusaurus/types';
import type FooterType from '@theme/DocItem/Footer';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): JSX.Element {
    const { metadata } = useDoc();
    const { siteConfig } = useDocusaurusContext();

    const title = encodeURIComponent(`Dokumentasjonsfeil: ${metadata.title}`);
    const body = encodeURIComponent(
        `**Side:** ${siteConfig.url}${metadata.permalink}\n\n**Beskrivelse av feilen:**\n\n`,
    );
    const issueUrl = `https://github.com/SpareBank1/indeks/issues/new?template=dokumentasjonsfeil.yml&title=${title}&body=${body}`;

    return (
        <>
            <Footer {...props} />
            <div className="theme-doc-footer-rapporter">
                <a href={issueUrl} target="_blank" rel="noopener noreferrer">
                    Rapporter feil på denne siden
                </a>
            </div>
        </>
    );
}
