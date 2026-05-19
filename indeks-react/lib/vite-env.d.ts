/// <reference types="vite/client" />

import type { IxField } from '@sb1/indeks-web';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'ix-field': React.DetailedHTMLProps<React.HTMLAttributes<IxField>, IxField> & { class?: string };
            'ix-stack': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                class?: string;
                horizontal?: boolean | 'center' | 'start' | 'end';
                vertical?: 'center' | 'end';
                reverse?: boolean;
                nowrap?: boolean;
                gap?: import('./types/types').GapSize;
            };
        }
    }
}
