import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
    // Design system sidebar
    designSidebar: [
        'hjem',
        {
            type: 'category',
            label: 'Kom i gang',
            collapsed: false,
            items: [
                'kom-i-gang/designer',
                'kom-i-gang/utvikler',
                'kom-i-gang/migrering',
                'kom-i-gang/kontakt',
                'kom-i-gang/bidra',
            ],
        },
        {
            type: 'category',
            label: 'Grunnleggende',
            collapsed: true,
            items: [
                'grunnleggende/typografi',
                ,
                {
                    type: 'category',
                    label: 'Tokens',
                    collapsed: true,
                    items: [
                        'grunnleggende/tokens/introduksjon',
                        {
                            type: 'category',
                            label: 'Farger',
                            items: [
                                'retningslinjer/farger/farger',
                                'grunnleggende/tokens/farger-native',
                            ],
                        },
                        'grunnleggende/tokens/spacing',
                        'grunnleggende/tokens/border',
                        'grunnleggende/tokens/z-index',
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: 'Mønstre og maler',
            collapsed: true,
            items: ['monstre-og-maler/layout', 'monstre-og-maler/spacing', 'monstre-og-maler/deaktiverte-tilstander'],
        },
        {
            type: 'category',
            label: 'Utility-klasser',
            collapsed: true,
            items: ['grunnleggende/tokens/utilities'],
        },
        {
            type: 'category',
            label: 'Komponenter',
            collapsed: true,
            items: ['komponenter/typografi'],
        },
    ],
};

export default sidebars;
