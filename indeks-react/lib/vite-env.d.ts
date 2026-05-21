/// <reference types="vite/client" />

export {};

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'ix-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: unknown; class?: string };
        }
    }
}
