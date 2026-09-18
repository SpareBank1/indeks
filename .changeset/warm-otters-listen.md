---
'@sb1/indeks-react': patch
---

Fikser manglende prop/rest-videresending i flere skjemakomponenter.

- **Checkbox:** `className` forsvant stille når komponenten rendres uten field-wrapper (ingen `description`/`errorMessage`/`tooltip`). Legges nå på `.ix-checkbox`-wrapperen i det tilfellet.
- **Combobox, DateField, PhoneNumberField:** hadde ingen rest-props-spredning i det hele tatt — vilkårlige native/aria/data-attributter (f.eks. `data-testid`, ekstra `aria-*`) forsvant. Spres nå på host-elementet (`<ix-combobox>`, `<ix-date-field>`, `<ix-phone-number-field>`), som eier ARIA/tastatur/state for disse web component-baserte feltene.
- **Field:** typen tillot ikke ekstra HTML-attributter selv om implementasjonen allerede videresendte dem i praksis. `FieldProps` utvider nå riktig type slik at TypeScript ikke lenger avviser gyldige rest-props.

Dokumentasjonen for Checkbox, Combobox, DateField og PhoneNumberField er oppdatert til å beskrive den faktiske (nå rettede) oppførselen.
