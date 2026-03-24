import { IxField } from './lib/components/field/IxField.js';

customElements.define('ix-field', IxField);

export { IxField };

declare global {
    interface HTMLElementTagNameMap {
        'ix-field': IxField;
    }

    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            'ix-field': { [key: string]: unknown; class?: string; children?: unknown };
        }
    }
}
