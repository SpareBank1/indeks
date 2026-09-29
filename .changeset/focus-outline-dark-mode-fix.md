---
"@sb1/indeks-css": patch
"@sb1/indeks-utils": patch
---

Fikser fokus-outline for skjemakomponenter. Komponentene setter nå base outline med transparent farge, og endrer kun `outline-color` på focus. Dette sikrer at fargen oppdateres korrekt i dark mode, og at animasjonen ikke hakker.

**indeks-utils:**
- `--ix-outline-default` er nå base outline med transparent farge
- `.ix-outline-default` utility-klassen setter base + offset, og viser farge på `:focus-visible`

**indeks-css:**
- TextField, TextArea, Select, Combobox, DateField og Field bruker nå `outline-color` på focus i stedet for full outline-shorthand
