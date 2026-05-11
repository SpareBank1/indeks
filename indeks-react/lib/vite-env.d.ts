/// <reference types="vite/client" />

import type { IxField } from '@sb1/indeks-web';
import type { IxProgressBar } from '@sb1/indeks-web';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'ix-field': React.DetailedHTMLProps<React.HTMLAttributes<IxField>, IxField> & { class?: string };
            'ix-progress-bar': React.DetailedHTMLProps<React.HTMLAttributes<IxProgressBar>, IxProgressBar> & { class?: string; state?: string; children?: React.ReactNode };
        }
    }
}
