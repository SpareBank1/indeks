import { IxField } from './lib/components/field/IxField.js';
import { IxIcon } from './lib/components/icon/IxIcon.js';
import type { IconName } from './lib/components/icon/IxIcon.js';

customElements.define('ix-field', IxField);
customElements.define('ix-icon', IxIcon);

export { IxField };
export { IxIcon };
export { ICON_NAMES } from './lib/components/icon/IxIcon.js';
export type { IconName, IconValue } from './lib/components/icon/IxIcon.js';

declare global {
    interface HTMLElementTagNameMap {
        'ix-field': IxField;
        'ix-icon': IxIcon;
    }

    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            'ix-field': { [key: string]: unknown; class?: string; children?: unknown };
            'ix-icon': {
                name?: IconName;
                materialdesignname?: string;
                size?: 'sm' | 'md' | 'lg' | 'xl';
                'aria-label'?: string;
                class?: string;
                style?: string | Record<string, string>;
            };
        }
    }
}
