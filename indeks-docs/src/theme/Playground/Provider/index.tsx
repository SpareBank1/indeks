import { type ReactNode } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
// ColorModeProvider er kun eksportert fra /internal - ingen offentlig entrypoint.
// OriginalPlaygroundProvider bruker usePrismTheme() som krever ColorModeProvider,
// men BrowserOnly-wrapperen gjør at context ikke er tilgjengelig.
// Pinnet til @docusaurus/theme-common@^3.10.2 — verifiser ved oppgradering.
import { ColorModeProvider } from '@docusaurus/theme-common/internal';
import OriginalPlaygroundProvider from '@theme-original/Playground/Provider';
import type { Props } from '@theme/Playground/Provider';
import { htmlAttrsToJsx } from './htmlToJsx';

export default function PlaygroundProvider(props: Props): ReactNode {
    const transformCode = props.transformCode ?? ((code: string) => `${htmlAttrsToJsx(code)};`);
    return (
        <BrowserOnly fallback={<div>Laster...</div>}>
            {() => (
                <ColorModeProvider>
                    <OriginalPlaygroundProvider {...props} transformCode={transformCode} />
                </ColorModeProvider>
            )}
        </BrowserOnly>
    );
}
