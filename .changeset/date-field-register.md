---
"@sb1/indeks-react": minor
---

`DateField` fungerer nå med React Hook Form `register()`, ikke bare `<Controller>`.

ISO-verdien eies av web-komponenten (den synlige `dd.mm.åååå`-inputen er formatert, og en generert `<input type="date">` bærer ISO), så `register` sin ref-sentriske lesing/skriving kan ikke peke på et enkelt native element. `DateField` videresender derfor en proxy til `ref` — samme grep som `TextField` i formatter-modus: `ref.value` gir ISO (`åååå-mm-dd`), `ref.value = '1990-05-17'` seeder både synlig og native input, og `ref.focus()` fokuserer den synlige inputen. Spre `{...register('felt')}` rett på `<DateField>`.

**Breaking (React):** `onChange` er nå event-basert — den får et syntetisk change-event med ISO-verdien i `event.target.value` (tom streng når datoen er ufullstendig) i stedet for å kalles med ISO-strengen direkte. En ny `onBlur`-prop emitteres når fokus forlater hele feltet (RHF touched-state, `mode: 'onBlur'`), og `ref` gir nå proxy-en, ikke `ix-date-field`-elementet.

- Med `<Controller>` binder du `field.onChange` direkte (uendret — RHF bygger samme event-form).
- Leste du verdien selv, bytt `onChange={(iso) => …}` til `onChange={(e) => { const iso = e.target.value; … }}`.
