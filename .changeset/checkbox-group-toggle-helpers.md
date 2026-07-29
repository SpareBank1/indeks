---
"@sb1/indeks-react": minor
---

Nye eksporter for kontrollert `CheckboxGroup` uten React Hook Form: `toggleValue` og `useCheckboxGroup`.

- `toggleValue(prev, event)` — ren funksjon som legger til eller fjerner `event.target.value` i et `string[]` basert på `event.target.checked`. Brukes internt av `CheckboxGroup` som eneste kilde til sannhet, og kan brukes direkte i egne event-handlere.
- `useCheckboxGroup(initial?)` — hook som returnerer `{ value, setValue, onChange }` klart til å spres på `<CheckboxGroup>` i kontrollert modus. Dekker use-caset «skjul/vis seksjoner basert på hvilke checkboxer som er valgt» uten RHF.

Med RHF er `watch('felt')` fortsatt den idiomatiske veien til skjul/vis — hooken er for kontrollert bruk *uten* RHF.
