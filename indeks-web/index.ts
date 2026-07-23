import { IxCheckboxGroup } from './lib/components/checkbox-group/IxCheckboxGroup.js';
import { IxCombobox } from './lib/components/combobox/IxCombobox.js';
import { IxDateField } from './lib/components/date-field/IxDateField.js';
import { IxField } from './lib/components/field/IxField.js';
import { IxIcon } from './lib/components/icon/IxIcon.js';
import type { IconName } from './lib/components/icon/IxIcon.js';
import { IxRadioGroup } from './lib/components/radio-group/IxRadioGroup.js';
import './lib/modal/modal.js';
import './lib/tooltip/tooltip.js';

customElements.define('ix-field', IxField);
customElements.define('ix-icon', IxIcon);
customElements.define('ix-radio-group', IxRadioGroup);
customElements.define('ix-checkbox-group', IxCheckboxGroup);
customElements.define('ix-combobox', IxCombobox);
customElements.define('ix-date-field', IxDateField);

export { IxField };
export { IxIcon };
export { IxRadioGroup };
export { IxCheckboxGroup };
export { IxCombobox };
export { IxDateField };
export { COMMON_ICON_NAMES } from './lib/components/icon/IxIcon.js';
export type { IconName, CommonIconName } from './lib/components/icon/IxIcon.js';

export { createPatternFormatter, createAmountFormatter, amountFormatterForLocale, registerFormat, resolveFormat } from './lib/components/field/formats.js';
export type { FieldFormatter } from './lib/components/field/formats.js';

declare global {
    interface HTMLElementTagNameMap {
        'ix-field': IxField;
        'ix-icon': IxIcon;
        'ix-radio-group': IxRadioGroup;
        'ix-checkbox-group': IxCheckboxGroup;
        'ix-combobox': IxCombobox;
        'ix-date-field': IxDateField;
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
            'ix-combobox': {
                name?: string;
                multiple?: boolean | '';
                disabled?: boolean | '';
                readonly?: boolean | '';
                'data-no-hits-text'?: string;
                'data-arrow-hint-text'?: string;
                'data-remove-chip-label'?: string;
                'data-chips-label'?: string;
                'data-results-text'?: string;
                class?: string;
                children?: unknown;
            };
            'ix-date-field': {
                name?: string;
                min?: string;
                max?: string;
                value?: string;
                disabled?: boolean | '';
                readonly?: boolean | '';
                'data-open-label'?: string;
                'data-native-picker-mobile'?: boolean | '';
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
