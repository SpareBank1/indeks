---
"@sb1/indeks-web": minor
"@sb1/indeks-react": minor
---

Combobox fungerer nå med React Hook Form `register()`, ikke bare `<Controller>` — og form-innsending blir mer robust for alle rammeverk.

- **indeks-web:** `ix-combobox` fyrer nå et native `change`-event på det skjulte, navngitte `<select>`-feltet (i tillegg til host-eventet), slik at lyttere på form-elementet (ren HTML, Vue, Angular, RHF `register`) hører verdiendringer. `focus()` på elementet delegerer nå til det synlige søkefeltet, så «fokusér første felt med feil» fungerer.
- **indeks-react:** `Combobox` sin `onChange` sender nå et syntetisk change-event på RHF-form (`{ target: { name, value } }`) i stedet for å kalles med verdien direkte, og en ny `onBlur`-prop fyrer når fokus forlater komponenten. Sammen med web-endringene lar dette `{...register('felt')}` binde direkte.

  **Breaking (React):** `onChange` får nå et event, ikke verdien. Med `<Controller>` binder du `field.onChange` direkte (uendret). Leste du verdien selv, bytt `onChange={(value) => …}` til `onChange={(e) => { const value = e.target.value; … }}`.
