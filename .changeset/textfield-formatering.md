---
"@sb1/indeks-web": minor
"@sb1/indeks-react": minor
---

Input-formatering på TextField / `ix-field` — formaterer verdien på blur (beløp, telefon, kontonummer, fødselsnummer), viser rå verdi ved fokus.

- **Web component** (`ix-field`): opt-in formatering som kabler focus/blur på child-`<input>` kun når en formatter er satt — uten formatter er `ix-field` uendret. **Format-on-blur, ikke live maskering:** feltet viser rå verdi ved fokus (fri redigering, ingen caret-hopp, ingen stille avvisning av tastetrykk) og formatert verdi ved blur. Kopiering gir automatisk rå verdi (fødselsnummer uten mellomrom). Tre måter å angi formatter, i presedens: `.formatter`-property → `data-format="navn"` (registry) → `data-format-pattern="000 00 000"`. Ny statisk `IxField.register(navn, {format, parse})` for delbare, team-egne varianter. `disconnectedCallback` rydder lytterne.
- **Ny `formats`-modul** (eksportert fra `@sb1/indeks-web`): rene `{format, parse}`-funksjoner, `createPatternFormatter` (`0`=siffer, `a`=bokstav, `*`=hva som helst, resten separatorer), `createAmountFormatter`/`amountFormatterForLocale` (tusenskille via `Intl.NumberFormat`), `registerFormat`/`resolveFormat`. Innebygde varianter: `phone`, `amount`, `account` (kontonummer), `orgnr`, `ssn`, `date`.
- **React** (`TextField`): nye props `format` (variant-navn eller `{format, parse}`-objekt) og `formatPattern` (pattern-streng — påvirker ikke det native `pattern`-valideringsattributtet). Verdien i `onChange` er alltid rå (uten separatorer).
- **A11y:** aldri `type="number"` (gir tom `.value` med separatorer) — bruk `type="text"`/`"tel"` + `inputMode`; format oppgis som tekst i `description`, ikke placeholder; formatering er visuell, ikke validering. Erstatter utdatert Cleave.js / react-number-format for felt-formatering.
