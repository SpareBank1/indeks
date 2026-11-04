---
"@sb1/indeks-css": minor
"@sb1/indeks-web": minor
"@sb1/indeks-react": minor
---

ValidationMessage har fått en suksessvariant: `data-status="success"` i HTML og `status="success"` i React gir grønn tekst og en sirkel med hake. `<ix-field>`, `<ix-checkbox-group>`, `<ix-radio-group>` og `<ix-phone-number-field>` setter ikke `aria-invalid` for en suksessmelding, og `<ix-phone-number-field>` setter heller ikke `data-state="error"`.

Feilmeldingen i `<ix-phone-number-field>` har nå samme avstand mellom ikon og tekst som i de andre skjemafeltene (`xs` i stedet for `2xs`).
