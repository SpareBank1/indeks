import { IxField } from './lib/components/field/IxField.js';
import { IxProgressBar } from './lib/components/progress-bar/IxProgressBar.js';

customElements.define('ix-field', IxField);
customElements.define('ix-progress-bar', IxProgressBar);

export { IxField };
export { IxProgressBar };

declare global {
    interface HTMLElementTagNameMap {
        'ix-field': IxField;
        'ix-progress-bar': IxProgressBar;
    }

    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            'ix-field': { [key: string]: unknown; class?: string; children?: unknown };
            'ix-progress-bar': { [key: string]: unknown; class?: string; children?: unknown };
        }
    }
}
