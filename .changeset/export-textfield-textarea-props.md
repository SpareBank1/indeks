---
"@sb1/indeks-react": minor
---

Eksporterer nå `TextFieldProps` og `TextAreaProps` fra pakkeroten, på linje med de øvrige skjemakomponentene (`CheckboxProps`, `SelectProps`, `RadioGroupProps` osv.). Typene fantes allerede internt, men var ikke re-eksportert — konsumenter måtte inline-type props eller importere fra interne stier. Nyttig bl.a. for typede feltwrappere over React Hook Form.
