import '@sb1/indeks-css';
import '@sb1/indeks-web';
import type { Preview } from '@storybook/react-vite';
import './preview.css'; // Import the main CSS file for styling

import { INITIAL_VIEWPORTS } from 'storybook/viewport';

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
            /*
             * Axe's context parameter
             * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#context-parameter
             * to learn more. Typically, this is the CSS selector for the part of the DOM you want to analyze.
             */
            context: 'body',
            /*
             * Axe's configuration
             * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure
             * to learn more about the available properties.
             */
            config: {},
            /*
             * Axe's options parameter
             * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
             * to learn more about the available options.
             */
            options: {},
        },
    },
    decorators: [
        (Story, context) => {
            const { scheme, device } = context.globals;

            const classname = `${device === 'mobile' ? 'indeks-mobile' : 'indeks-desktop'}`;

            return (
                <div id="stories-container">
                    {(scheme === 'both' || scheme === 'light') && (
                        <div className={`storybook-docs-content-container ${classname}`}>
                            <h3>Light mode</h3>
                            <Story />
                        </div>
                    )}
                    {(scheme === 'both' || scheme === 'dark') && (
                        <div className={`storybook-docs-content-container ix-dark-mode ${classname}`}>
                            <h3>Dark mode</h3>
                            <Story />
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
