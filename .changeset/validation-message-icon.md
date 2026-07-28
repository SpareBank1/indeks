---
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

ValidationMessage viser nå et dekorativt feilikon (badge — hvit glyf på rød sirkel) foran teksten, i tråd med designet. Ny `showIcon`-prop (standard `true`) lar deg skjule ikonet. Feilmeldings-CSS-en (`[data-field="error"]`) er samlet i en ny delt fil `form/validation-message.css` — tidligere lå den spredt i `field.css`, `radio-group.css` og `checkbox-group.css`. `Field` (og dermed `TextField`, `TextArea`, `Select`) rendrer nå feilmeldingen via `<ValidationMessage>` slik at ikonet blir konsistent på tvers av alle feltkomponenter.
