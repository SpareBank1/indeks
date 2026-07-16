import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { IxCheckboxGroup, IxCombobox, IxPhoneNumberField, IxRadioGroup } from '@sb1/indeks-web';

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
if (!customElements.get('ix-phone-number-field')) {
    customElements.define('ix-phone-number-field', IxPhoneNumberField);
}

afterEach(() => {
    cleanup(); //Så domen blir renset hver gang, unngår at rendret tester piler up
});
