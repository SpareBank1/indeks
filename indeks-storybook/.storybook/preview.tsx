import '@sb1/indeks-css';
import '@sb1/indeks-web';
import type { Preview } from '@storybook/react-vite';
import './preview.css'; // Import the main CSS file for styling

import { INITIAL_VIEWPORTS } from 'storybook/viewport';

// Hver scheme-kopi pakkes i sin egen form owner — se kommentaren over decorator-en.
const schemeScopeStyle = { display: 'contents' } as const;

const preview: Preview = {
    initialGlobals: {
        viewport: { value: 'iphone14', isRotated: false },
    },
    parameters: {
        viewport: {
            options: INITIAL_VIEWPORTS,
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        docs: {
            source: {
                type: 'dynamic',
            },
        },
        a11y: {
            // Axe kjøres av Playwright-testene — deaktiver automatisk kjøring her for å unngå "Axe is already running"-feil.
            disable: true,
        },
    },
    decorators: [
        // Lys og mørk modus rendres side om side i SAMME dokument. Nettleseren grupperer
        // <input type="radio"> på kombinasjonen (form owner + name + tree), så to kopier
        // av samme story med samme `name` blir ÉN radiogruppe: den siste kopien (mørk)
        // vinner, og lys modus mister markeringen. Samme problem oppstår på autodocs-sider,
        // der alle stories for en komponent rendres i samme dokument.
        //
        // Derfor pakkes hver kopi i sitt eget <form>, som gir kopien en egen form owner.
        // Det er den eneste måten å skope en radiogruppe på uten shadow DOM eller iframe,
        // og det virker uansett hvilken `name` storyen bruker — også i nye stories.
        //
        // - `display: contents` holder formen helt utenfor layout, så skjermbildene er
        //   pikselidentiske (verifisert i chromium og firefox).
        // - `noValidate` + `preventDefault` nøytraliserer utilsiktet submit fra en <button>
        //   uten `type` som nå havner inni en form.
        (Story, context) => {
            const { scheme, device } = context.globals;

            const classname = `${device === 'mobile' ? 'indeks-mobile' : 'indeks-desktop'}`;

            return (
                <div id="stories-container">
                    {(scheme === 'both' || scheme === 'light') && (
                        <div className={`storybook-docs-content-container ${classname}`}>
                            <h3>Light mode</h3>
                            <form style={schemeScopeStyle} noValidate onSubmit={(event) => event.preventDefault()}>
                                <Story />
                            </form>
                        </div>
                    )}
                    {(scheme === 'both' || scheme === 'dark') && (
                        <div className={`storybook-docs-content-container ix-dark-mode ${classname}`}>
                            <h3>Dark mode</h3>
                            <form style={schemeScopeStyle} noValidate onSubmit={(event) => event.preventDefault()}>
                                <Story />
                            </form>
                        </div>
                    )}
                </div>
            );
        },
    ],
    globalTypes: {
        scheme: {
            name: 'Scheme',
            description: 'Select light or dark theme',
            table: {
                defaultValue: {
                    detail: 'light',
                },
            },
            defaultValue: 'light',
            toolbar: {
                items: [
                    { icon: 'sun', value: 'light', title: 'Lys' },
                    { icon: 'moon', value: 'dark', title: 'Mørk' },
                    { icon: 'stacked', value: 'both', title: 'Begge moduser' },
                ],
                dynamicTitle: true,
            },
        },
        context: {
            name: 'Context',
            description: 'Select context [WIP]',
            defaultValue: 'hybrid',
            toolbar: {
                items: [
                    {
                        icon: 'circlehollow',
                        value: 'html',
                        title: 'HTML',
                    },
                    { icon: 'circle', value: 'web', title: 'Web' },
                    {
                        icon: 'mirror',
                        value: 'hybrid',
                        title: 'Hybrid',
                    },
                ],
                dynamicTitle: true,
            },
        },
    },
};

export default preview;
