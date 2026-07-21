import { IxCheckboxGroup } from './lib/components/checkbox-group/IxCheckboxGroup.js';
import { IxCombobox } from './lib/components/combobox/IxCombobox.js';
import { IxField } from './lib/components/field/IxField.js';
import { IxIcon } from './lib/components/icon/IxIcon.js';
import type { IconName } from './lib/components/icon/IxIcon.js';
import { IxProgressBar } from './lib/components/progress-bar/IxProgressBar.js';
import { IxRadioGroup } from './lib/components/radio-group/IxRadioGroup.js';
import { IxTabs, IxTabList, IxTab, IxTabPanel } from './lib/components/tabs/IxTabs.js';
import './lib/modal/modal.js';
import './lib/tooltip/tooltip.js';

customElements.define('ix-field', IxField);
customElements.define('ix-icon', IxIcon);
customElements.define('ix-radio-group', IxRadioGroup);
customElements.define('ix-checkbox-group', IxCheckboxGroup);
customElements.define('ix-combobox', IxCombobox);
customElements.define('ix-progress-bar', IxProgressBar);
customElements.define('ix-tabs', IxTabs);
customElements.define('ix-tab-list', IxTabList);
customElements.define('ix-tab', IxTab);
customElements.define('ix-tab-panel', IxTabPanel);

export { IxField };
export { IxIcon };
export { IxRadioGroup };
export { IxCheckboxGroup };
export { IxCombobox };
export { IxProgressBar };
export { IxTabs, IxTabList, IxTab, IxTabPanel };
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
        'ix-progress-bar': IxProgressBar;
        'ix-tabs': IxTabs;
        'ix-tab-list': IxTabList;
        'ix-tab': IxTab;
        'ix-tab-panel': IxTabPanel;
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
            'ix-icon': {
                name?: IconName;
                'data-size'?: 'sm' | 'md' | 'lg' | 'xl';
                'aria-label'?: string;
                'aria-labelledby'?: string;
                class?: string;
                style?: string | Record<string, string>;
            };
            'ix-progress-bar': {
                value?: number | string;
                'data-state'?: 'active' | 'success' | 'error';
                label?: string;
                'data-support-text'?: string;
                'data-show-value'?: boolean | '';
                'data-value-text'?: string;
                class?: string;
                style?: string | Record<string, string>;
            };
            'ix-tabs': { [key: string]: unknown; class?: string; children?: unknown };
            'ix-tab-list': { [key: string]: unknown; class?: string; children?: unknown };
            'ix-tab': {
                [key: string]: unknown;
                id?: string;
                'aria-selected'?: 'true' | 'false';
                'aria-controls'?: string;
                'aria-disabled'?: 'true' | 'false';
                'aria-label'?: string;
                class?: string;
                children?: unknown;
            };
            'ix-tab-panel': {
                [key: string]: unknown;
                id?: string;
                hidden?: boolean;
                'aria-labelledby'?: string;
                class?: string;
                children?: unknown;
            };
        }
    }
}
