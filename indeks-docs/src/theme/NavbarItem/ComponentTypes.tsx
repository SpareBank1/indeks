import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import PreferencesButton from '@site/src/components/PreferencesButton';

// Registrerer en custom navbar-item-type slik at docusaurus.config.ts kan
// bruke { type: 'custom-preferences' } i navbar.items.
export default {
    ...ComponentTypes,
    'custom-preferences': PreferencesButton,
};
