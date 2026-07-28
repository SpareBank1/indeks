---
"@sb1/indeks-react": minor
---

`RadioGroup` fungerer nå med React Hook Form `register()`, ikke bare `<Controller>`.

RadioGroup rendrer ekte native `<input type="radio">`, så `register`-objektet (`ref`/`onChange`/`onBlur`) rutes rett ned på hver input — akkurat slik `register()` er bygget for radios. RHF akkumulerer refene og eier `checked` via dem, og skriver `defaultValues` inn ved mount (så du trenger ingen egen `defaultValue` i register-modus). Spre `{...register('felt')}` rett på `<RadioGroup>`.

**Breaking (React):** `onChange` er nå event-basert — den får det native change-eventet (verdien ligger i `event.target.value`) i stedet for å kalles med verdien direkte. En ny `onBlur`-prop videresendes til hver input (RHF touched-state), og komponenten er nå `forwardRef` som ruter `ref` ned på inputene.

- Med `<Controller>` binder du `field.onChange` direkte (uendret — RHF bygger samme event-form).
- Leste du verdien selv, bytt `onChange={(value) => …}` til `onChange={(e) => { const value = e.target.value; … }}`.
