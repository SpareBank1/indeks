import CodeBlock from '@theme/CodeBlock';
import { usePackageVersion } from './PackageVersion';

// Kodeblokker med versjonen injisert inn i selve strengen — slik at
// Docusaurus' <CodeBlock> rendrer dem med syntax-highlight og kopier-knapp.
// MDX ```html-fence kan ikke ta en React-komponent som del av innholdet,
// derfor gjøres interpoleringen her i TSX.

export const CssImportBlock = () => {
    const version = usePackageVersion('css');
    return (
        <CodeBlock language="css">
            {`@import url('https://cdn.sparebank1.no/indeks/css/${version}/index.css');`}
        </CodeBlock>
    );
};

export const WebScriptBlock = () => {
    const version = usePackageVersion('web');
    return (
        <CodeBlock language="html">
            {`<script type="module" src="https://cdn.sparebank1.no/indeks/web/${version}/index.js"></script>`}
        </CodeBlock>
    );
};
