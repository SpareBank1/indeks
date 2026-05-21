import { IxField } from './lib/components/field/IxField.js';
import './lib/tooltip/tooltip.js';

customElements.define('ix-field', IxField);

export { IxField };

declare global {
    interface HTMLElementTagNameMap {
        'ix-field': HTMLElement;
    }

    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            'ix-field': { [key: string]: unknown; class?: string; children?: unknown };
        }
    }
}
