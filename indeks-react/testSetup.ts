import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import {
    IxCheckboxGroup,
    IxCombobox,
    IxIcon,
    IxProgressBar,
    IxRadioGroup,
    IxTabs,
    IxTabList,
    IxTab,
    IxTabPanel,
} from '@sb1/indeks-web';

// React-laget er tynt — flere komponenter avhenger av at WC-en kjører sin
// connectedCallback for å sette ARIA-koblinger, generere IDer og synkronisere
// name/disabled/required. Registrer WC-er som testene bruker her.
if (!customElements.get('ix-radio-group')) {
    customElements.define('ix-radio-group', IxRadioGroup);
}
if (!customElements.get('ix-checkbox-group')) {
    customElements.define('ix-checkbox-group', IxCheckboxGroup);
}
if (!customElements.get('ix-combobox')) {
    customElements.define('ix-combobox', IxCombobox);
}
if (!customElements.get('ix-icon')) {
    customElements.define('ix-icon', IxIcon);
}
if (!customElements.get('ix-progress-bar')) {
    customElements.define('ix-progress-bar', IxProgressBar);
}
if (!customElements.get('ix-tabs')) {
    customElements.define('ix-tabs', IxTabs);
    customElements.define('ix-tab-list', IxTabList);
    customElements.define('ix-tab', IxTab);
    customElements.define('ix-tab-panel', IxTabPanel);
}

afterEach(() => {
    cleanup(); //Så domen blir renset hver gang, unngår at rendret tester piler up
});
