---
"@sb1/indeks-css": minor
"@sb1/indeks-web": minor
"@sb1/indeks-react": minor
---

ValidationMessage har fått en suksessvariant: `data-status="success"` i HTML og `status="success"` i React gir grønn tekst og en sirkel med hake. `<ix-field>`, `<ix-checkbox-group>` og `<ix-radio-group>` setter ikke `aria-invalid` for en suksessmelding. `validation-message.css` bruker ikke lenger `:where()`, så feilmeldingen i PhoneNumberField har nå samme avstand mellom ikon og tekst som de andre skjemafeltene (`xs` i stedet for `2xs`).

ProgressBar viser nå status som i Figma. I `success` og `error` vises støtteteksten som en ValidationMessage under baren, og ikonet til høyre for labelen er fjernet. Feilikonet er `close`, som i ValidationMessage, i stedet for `priority_high`. Uten støttetekst vises ingen melding eller ikon. Har du stylet `.ix-progress-bar__header ix-icon`, ligger ikonet nå i `.ix-progress-bar__support[data-field="error"]`.
