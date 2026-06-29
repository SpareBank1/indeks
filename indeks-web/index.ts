import { IxCheckboxGroup } from './lib/components/checkbox-group/IxCheckboxGroup.js';
import { IxField } from './lib/components/field/IxField.js';
import { IxIcon } from './lib/components/icon/IxIcon.js';
import type { IconName } from './lib/components/icon/IxIcon.js';
import { IxRadioGroup } from './lib/components/radio-group/IxRadioGroup.js';
import './lib/tooltip/tooltip.js';

customElements.define('ix-field', IxField);
customElements.define('ix-icon', IxIcon);
customElements.define('ix-radio-group', IxRadioGroup);
customElements.define('ix-checkbox-group', IxCheckboxGroup);

export { IxField };
export { IxIcon };
export { IxRadioGroup };
export { IxCheckboxGroup };
export { COMMON_ICON_NAMES } from './lib/components/icon/IxIcon.js';
export type { IconName, CommonIconName } from './lib/components/icon/IxIcon.js';

declare global {
    interface HTMLElementTagNameMap {
        'ix-field': IxField;
        'ix-icon': IxIcon;
        'ix-radio-group': IxRadioGroup;
        'ix-checkbox-group': IxCheckboxGroup;
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
            'ix-checkbox-group': {
                name?: string;
                disabled?: boolean | '';
                readonly?: boolean | '';
                'data-state'?: 'error' | 'readonly' | 'disabled';
                class?: string;
                children?: unknown;
            };
            'ix-icon': {
                name?: IconName;
                'data-size'?: 'sm' | 'md' | 'lg' | 'xl';
                'aria-label'?: string;
                'aria-labelledby'?: string;
                class?: string;
                style?: string | Record<string, string>;
            };
        }
    }
}
