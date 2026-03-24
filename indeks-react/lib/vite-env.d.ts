/// <reference types="vite/client" />

import type { IxField } from '@sb1/indeks-web';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'ix-field': React.DetailedHTMLProps<React.HTMLAttributes<IxField>, IxField>;
        }
    }
}
