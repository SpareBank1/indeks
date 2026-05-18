/// <reference types="vite/client" />

import type { IxField, IxIcon } from '@sb1/indeks-web';
import type { IconName } from './ui/icons/icon-types';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'ix-field': React.DetailedHTMLProps<React.HTMLAttributes<IxField>, IxField> & { class?: string };
            'ix-icon': React.DetailedHTMLProps<React.HTMLAttributes<IxIcon>, IxIcon> & {
                name?: IconName;
                materialdesignname?: string;
                size?: 'sm' | 'md' | 'lg' | 'xl';
                class?: string;
            };
        }
    }
}
