import { IxField } from './lib/components/field/IxField.js';
import { IxIcon } from './lib/components/icon/IxIcon.js';
import type { IconName } from './lib/components/icon/IxIcon.js';
import { IxRadioGroup } from './lib/components/radio-group/IxRadioGroup.js';
import './lib/tooltip/tooltip.js';

customElements.define('ix-field', IxField);
customElements.define('ix-icon', IxIcon);
customElements.define('ix-radio-group', IxRadioGroup);

export { IxField };
export { IxIcon };
export { IxRadioGroup };
export { ICON_NAMES } from './lib/components/icon/IxIcon.js';
export type { IconName, IconValue } from './lib/components/icon/IxIcon.js';

declare global {
    interface HTMLElementTagNameMap {
        'ix-field': IxField;
        'ix-icon': IxIcon;
        'ix-radio-group': IxRadioGroup;
    }

    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            'ix-field': { [key: string]: unknown; class?: string; children?: unknown };
            'ix-radio-group': {
                name?: string;
                disabled?: boolean | '';
                readonly?: boolean | '';
                required?: boolean | '';
                'data-orientation'?: 'vertical' | 'horizontal';
                'data-state'?: 'error' | 'readonly' | 'disabled';
                class?: string;
                children?: unknown;
            };
            'ix-icon': {
                name?: IconName;
                materialdesignname?: string;
                'data-size'?: 'sm' | 'md' | 'lg' | 'xl';
                'aria-label'?: string;
                'aria-labelledby'?: string;
                class?: string;
                style?: string | Record<string, string>;
            };
        }
    }
}
