import { Heading, Text } from '@sb1/indeks-react';

/*
 * Viser samme markup med flere CSS-strategier side om side.
 *
 * Hvert alternativ rendres i sin egen iframe. Spesifisitet og lag kan bare vises
 * ærlig når CSS-en er global: scoper vi vertsreglene til en container, får de
 * høyere spesifisitet, og demonstrasjonen viser noe annet enn virkeligheten.
 */

export interface Alternativ {
    /** Stabil nøkkel, brukes i data-testid. */
    nokkel: string;
    navn: string;
    /** CSS-en indeks leverer i dette alternativet. */
    indeksCss: string;
    /** Det man ser i iframen, kort. */
    resultat: string;
    /** Overstyrer `markup` fra sammenligningen. */
    markup?: string;
    /** Overstyrer `konsumentCss` fra sammenligningen. */
    konsumentCss?: string;
    /** Konsumentens CSS lastes før indeks. Standard er etter. */
    konsumentForst?: boolean;
    /** Lastes aller først, før verten. Brukes for `@layer`-rekkefølge. */
    oppsett?: string;
}

interface Props {
    id: string;
    alternativer: Alternativ[];
    markup: string;
    vertCss?: string;
    vertNavn?: string;
    konsumentCss?: string;
    hoyde?: number;
}

const RAMME = `body { margin: 12px; font: 16px/1.4 system-ui, sans-serif; color: #1c1e21; }
body > * + * { margin-top: 12px; }`;

function byggDokument(alt: Alternativ, props: Props) {
    const konsument = alt.konsumentCss ?? props.konsumentCss ?? '';
    const deler = [
        alt.oppsett ?? '',
        RAMME,
        props.vertCss ?? '',
        alt.konsumentForst ? konsument : '',
        alt.indeksCss,
        alt.konsumentForst ? '' : konsument,
    ];
    const css = deler.filter(Boolean).join('\n');
    return `<!doctype html><html lang="nb"><head><style>${css}</style></head><body>${alt.markup ?? props.markup}</body></html>`;
}

function Kode({ tittel, css }: { tittel: string; css: string }) {
    return (
        <div>
            <Text size="xs">
                <strong>{tittel}</strong>
            </Text>
            <pre className="spesifisitet-kode">
                <code>{css.trim()}</code>
            </pre>
        </div>
    );
}

export function Sammenligning(props: Props) {
    const { id, alternativer, vertCss, vertNavn = 'Verten', hoyde = 110 } = props;

    return (
        <div className="spesifisitet-sammenligning">
            {alternativer.map((alt) => {
                const konsument = alt.konsumentCss ?? props.konsumentCss;
                return (
                    <figure key={alt.nokkel} className="spesifisitet-alternativ">
                        <Heading as="h4" size="xs">
                            {alt.navn}
                        </Heading>
                        <iframe
                            data-testid={`${id}-${alt.nokkel}`}
                            title={`${alt.navn}: levende eksempel`}
                            srcDoc={byggDokument(alt, props)}
                            style={{ height: hoyde }}
                        />
                        <figcaption>
                            <Text size="sm">{alt.resultat}</Text>
                        </figcaption>
                        <details>
                            <summary>Vis CSS</summary>
                            {alt.oppsett && <Kode tittel="Oppsett (lastes først)" css={alt.oppsett} />}
                            {vertCss && <Kode tittel={vertNavn} css={vertCss} />}
                            {konsument && alt.konsumentForst && (
                                <Kode tittel="Konsumenten (lastes før indeks)" css={konsument} />
                            )}
                            <Kode tittel="Indeks" css={alt.indeksCss} />
                            {konsument && !alt.konsumentForst && (
                                <Kode tittel="Konsumenten (lastes etter indeks)" css={konsument} />
                            )}
                        </details>
                    </figure>
                );
            })}
        </div>
    );
}
