---
"@sb1/indeks-react": minor
---

`CheckboxGroup` fungerer nå med React Hook Form `register()`, ikke bare `<Controller>`.

CheckboxGroup rendrer ekte native `<input type="checkbox">` (alle med samme `name`), så `register`-objektet (`ref`/`onChange`/`onBlur`) rutes rett ned på hver input — akkurat slik `register()` er bygget for checkbox-grupper. RHF akkumulerer refene, eier `checked` via dem, og samler de avmerkede verdiene til et `string[]` ved å lese `checked`+`value` fra alle inputs som deler `name` (og skriver `defaultValues` inn ved mount, så du trenger ingen egen `defaultValue` i register-modus). Spre `{...register('felt')}` rett på `<CheckboxGroup>`. Etter dette er hele form-settet på `register()`; ingen komponent krever `<Controller>`.

**Breaking (React):** `onChange` er nå event-basert (`ChangeEventHandler<HTMLInputElement>`) — den får det native change-eventet (toggl-verdien i `event.target.value`, av/på i `event.target.checked`) i stedet for å kalles med hele det oppdaterte `string[]`-arrayet. En ny `onBlur`-prop videresendes til hver input (RHF touched-state), og komponenten er nå `forwardRef` som ruter `ref` ned på inputene.

- Med `register()` eller `<Controller>` spres/bindes koblingen rett på — RHF bygger `string[]` selv.
- Bygde du selv arrayet i kontrollert modus, bytt `onChange={(values) => setVals(values)}` til `onChange={(e) => setVals((prev) => e.target.checked ? [...prev, e.target.value] : prev.filter((v) => v !== e.target.value))}`.
