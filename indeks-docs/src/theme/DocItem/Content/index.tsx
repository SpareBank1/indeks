import { type ReactNode } from 'react';
import clsx from 'clsx';
import MDXContent from '@theme/MDXContent';
import type { Props } from '@theme/DocItem/Content';
import ChoosePreferencesBanner from '@site/src/components/ChoosePreferencesBanner';

// Klassenavn fra @docusaurus/theme-common ThemeClassNames.docs.docMarkdown.
// Hardkodes her for å unngå å legge til theme-common som eksplisitt dependency.
const DOC_MARKDOWN_CLASS = 'theme-doc-markdown';

// Swizzle av DocItem/Content — alle docs i dette repoet har H1 i markdown,
// så vi dropper Docusaurus' "syntetiske tittel"-logikk (som trengte useDoc).
// Legger inn ChoosePreferencesBanner rett før innholdet; komponenten
// rendrer kun seg selv på komponentsider når preferences ikke er satt.
export default function DocItemContent({ children }: Props): ReactNode {
    return (
        <div className={clsx(DOC_MARKDOWN_CLASS, 'markdown')}>
            <ChoosePreferencesBanner />
            <MDXContent>{children}</MDXContent>
        </div>
    );
}
