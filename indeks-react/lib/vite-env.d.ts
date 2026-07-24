/// <reference types="vite/client" />

import type {
    IxCheckboxGroup,
    IxCombobox,
    IxField,
    IxIcon,
    IxProgressBar,
    IxRadioGroup,
    IxTabs,
    IxTabList,
    IxTab,
    IxTabPanel,
} from '@sb1/indeks-web';
import type { IconName } from './ui/icons/icon-types';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'ix-field': React.DetailedHTMLProps<React.HTMLAttributes<IxField>, IxField> & {
                class?: string;
                tooltip?: string;
                'tooltip-label'?: string;
                'tooltip-placement'?: string;
            };
            'ix-icon': React.DetailedHTMLProps<React.HTMLAttributes<IxIcon>, IxIcon> & {
                name?: IconName;
                'data-size'?: 'sm' | 'md' | 'lg' | 'xl';
                'aria-label'?: string;
                'aria-labelledby'?: string;
                class?: string;
            };
            'ix-radio-group': React.DetailedHTMLProps<React.HTMLAttributes<IxRadioGroup>, IxRadioGroup> & {
                name?: string;
                class?: string;
                disabled?: boolean | '';
                readonly?: boolean | '';
                required?: boolean | '';
                'data-orientation'?: 'vertical' | 'horizontal';
                'data-state'?: 'error' | 'readonly' | 'disabled';
            };
            'ix-checkbox-group': React.DetailedHTMLProps<React.HTMLAttributes<IxCheckboxGroup>, IxCheckboxGroup> & {
                name?: string;
                class?: string;
                disabled?: boolean | '';
                readonly?: boolean | '';
                'data-state'?: 'error' | 'readonly' | 'disabled';
            };
            'ix-combobox': React.DetailedHTMLProps<React.HTMLAttributes<IxCombobox>, IxCombobox> & {
                name?: string;
                class?: string;
                multiple?: boolean | '';
                disabled?: boolean | '';
                readonly?: boolean | '';
                'data-state'?: 'error' | 'readonly' | 'disabled';
                'data-no-hits-text'?: string;
                'data-arrow-hint-text'?: string;
                'data-remove-chip-label'?: string;
                'data-chips-label'?: string;
                'data-results-text'?: string;
            };
            'ix-progress-bar': React.DetailedHTMLProps<React.HTMLAttributes<IxProgressBar>, IxProgressBar> & {
                value?: number;
                class?: string;
                'data-state'?: 'active' | 'success' | 'error';
                label?: string;
                'data-support-text'?: string;
                'data-show-value'?: boolean | '';
                'data-value-text'?: string;
            };
            'ix-tabs': React.DetailedHTMLProps<React.HTMLAttributes<IxTabs>, IxTabs> & {
                class?: string;
            };
            'ix-tab-list': React.DetailedHTMLProps<React.HTMLAttributes<IxTabList>, IxTabList> & {
                class?: string;
                'aria-label'?: string;
            };
            'ix-tab': React.DetailedHTMLProps<React.HTMLAttributes<IxTab>, IxTab> & {
                class?: string;
                'data-value'?: string;
                'aria-selected'?: 'true' | 'false';
                'aria-disabled'?: 'true' | 'false';
                'aria-label'?: string;
            };
            'ix-tab-panel': React.DetailedHTMLProps<React.HTMLAttributes<IxTabPanel>, IxTabPanel> & {
                class?: string;
                'data-value'?: string;
                hidden?: boolean;
            };
            'ix-stack': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                class?: string;
                horizontal?: boolean | 'center' | 'start' | 'end';
                vertical?: 'center' | 'end';
                reverse?: boolean;
                nowrap?: boolean;
                gap?: import('./types/types').GapSize;
            };
            'ix-grid': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                class?: string;
                cols?: string;
                rows?: string;
                gap?: import('./types/types').GapSize;
                align?: 'start' | 'end' | 'center' | 'stretch';
                justify?: 'start' | 'end' | 'center' | 'stretch';
                inline?: '' | boolean;
            };
        }
    }
}
