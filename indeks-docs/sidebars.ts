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
                'grunnleggende/native',
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
                                'retningslinjer/farger/fargemodus',
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
            items: [
                'monstre-og-maler/layout',
                'monstre-og-maler/spacing',
                'monstre-og-maler/deaktiverte-tilstander',
            ],
        },
        {
            type: 'category',
            label: 'Utility-klasser',
            collapsed: true,
            items: ['utility-klasser/oversikt', 'utility-klasser/native'],
        },
        {
            type: 'category',
            label: 'Komponenter',
            collapsed: true,
            items: [
                {
                    type: 'category',
                    label: 'Primitiver',
                    collapsed: false,
                    items: [
                        'komponenter/button',
                        {
                            type: 'category',
                            label: 'Icon',
                            link: { type: 'doc', id: 'komponenter/icon' },
                            items: ['komponenter/icon-analyse'],
                        },
                        'komponenter/interactive-icon',
                        'komponenter/progress-bar',
                        'komponenter/spinner',
                        'komponenter/typografi',
                    ],
                },
                {
                    type: 'category',
                    label: 'Layout',
                    collapsed: false,
                    items: [
                        'komponenter/surface',
                        'komponenter/primitives/stack',
                        'komponenter/primitives/grid',
                    ],
                },
                'komponenter/accordion',
                'komponenter/card',
                {
                    type: 'category',
                    label: 'Chip',
                    link: { type: 'doc', id: 'komponenter/chip' },
                    items: [
                        'komponenter/chip/button',
                        'komponenter/chip/removable',
                        'komponenter/chip/radio',
                        'komponenter/chip/checkbox',
                    ],
                },
                'komponenter/message',
                'komponenter/modal',
                'komponenter/read-more',
                {
                    type: 'category',
                    label: 'Skjema',
                    collapsed: false,
                    items: [
                        'komponenter/skjema/checkbox',
                        {
                            type: 'category',
                            label: 'CheckboxGroup',
                            link: { type: 'doc', id: 'komponenter/skjema/checkbox-group' },
                            items: ['komponenter/skjema/checkbox-group-designvalg'],
                        },
                        {
                            type: 'category',
                            label: 'Combobox',
                            link: { type: 'doc', id: 'komponenter/skjema/combobox' },
                            items: ['komponenter/skjema/combobox-html'],
                        },
                        'komponenter/skjema/label',
                        {
                            type: 'category',
                            label: 'RadioGroup',
                            link: { type: 'doc', id: 'komponenter/skjema/radio-group' },
                            items: ['komponenter/skjema/radio-group-designvalg'],
                        },
                        'komponenter/skjema/select',
                        {
                            type: 'category',
                            label: 'TextField',
                            link: { type: 'doc', id: 'komponenter/skjema/textfield' },
                            items: ['komponenter/skjema/textfield-formatering'],
                        },
                        'komponenter/skjema/textarea',
                        'komponenter/skjema/tooltip',
                        'komponenter/skjema/validation-message',
                    ],
                },
            ],
        },
    ],
};

export default sidebars;
