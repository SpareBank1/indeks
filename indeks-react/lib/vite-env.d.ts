/// <reference types="vite/client" />

import type { IxField, IxIcon, IxRadioGroup } from '@sb1/indeks-web';
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
                materialdesignname?: string;
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
        }
    }
}
