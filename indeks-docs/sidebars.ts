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
        {
            type: 'category',
            label: 'Arkitekturbeslutninger (ADR)',
            collapsed: true,
            items: [
                'adr/retningslinjer',
                'ordbok',
                {
                    type: 'category',
                    label: 'ADR-er',
                    collapsed: false,
                    items: [
                        'adr/ADR-DS-001-monorepo-og-byggverktoy',
                        'adr/ADR-DS-002-versjonering-og-publisering',
                        'adr/ADR-DS-003-ci-cd',
                        'adr/ADR-DS-004-web-components',
                        'adr/ADR-DS-005-react-bibliotek',
                        'adr/ADR-DS-006-tokens-og-farger',
                        'adr/ADR-DS-007-fargesystem',
                        'adr/ADR-DS-008-spacing-system',
                        'adr/ADR-DS-009-css-only-styling',
                        'adr/ADR-DS-010-komponentutvikling-og-testing',
                        'adr/ADR-DS-011-dokumentasjon',
                    ],
                },
            ],
        },
    ],
};

export default sidebars;
