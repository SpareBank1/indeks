/// <reference types="vite/client" />

import type { IxCheckboxGroup, IxCombobox, IxField, IxIcon, IxRadioGroup } from '@sb1/indeks-web';
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
