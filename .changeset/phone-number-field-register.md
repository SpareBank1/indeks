---
"@sb1/indeks-react": minor
---

`PhoneNumberField` fungerer nå med React Hook Form `register()` som to uavhengige felt (landkode + nummer), ikke bare `<Controller>`.

Komponenten er to felt i én: en landvelger og et nummerfelt. Begge de indre komponentene (`Combobox` og `TextField`) er allerede register-kompatible, så bindingen skjer via to register-spread-props — `countryField={register('landkode')}` og `numberField={register('tlf')}` — som spres rett på hvert delfelt. `countryField.onChange` får landkoden (uten `+`) i `event.target.value`; `numberField.onChange` får det RÅ nummeret (uten separatorer).

Feilmeldinger er nå per felt: `errorMessage` vises under nummeret, `countryErrorMessage` under landvelgeren, hver med egen `aria-invalid`. En latent feil der den indre landvelgerens `onChange` behandlet event-objektet som en verdi er samtidig rettet.

**Breaking (React):** verdi-baserte props er fjernet til fordel for de to register-gruppene:

- `name` → `numberField={{ name: 'tlf' }}` (eller `register('tlf')`).
- `countryName` → `countryField={{ name: 'landkode' }}`.
- `onChange={(value) => …}` → `numberField={{ onChange: (e) => { const raw = e.target.value; … } }}`.
- `onCountryCodeChange={(code) => …}` → `countryField={{ onChange: (e) => { const code = e.target.value; … } }}`.
- `value` / `countryCode` (kontrollerte verdier) er borte — bruk `<Controller>` for kontrollert bruk, eller `defaultValue` / `defaultCountryCode` for forhåndsvalg.
- `errorMessage` gjelder nå kun nummer-feltet (var felles gruppe-melding); bruk `countryErrorMessage` for landkode.
