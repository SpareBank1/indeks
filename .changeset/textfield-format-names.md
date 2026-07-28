---
"@sb1/indeks-react": minor
"@sb1/indeks-web": minor
---

`TextField`-propen `format` er nå typet med navnene på de innebygde variantene (`"phone"`, `"amount"`, `"account"`, `"orgnr"`, `"ssn"`, `"date"`) i stedet for bare `string`. Du får autocomplete på dem, men kan fortsatt sende egne navn registrert via `registerFormat` (typen er `BuiltInFormatName | (string & {})`, så vilkårlige strenger godtas uten runtime-validering).

`indeks-web` eksporterer nå `BUILTIN_FORMAT_NAMES` (og typen `BuiltInFormatName`) som registreringene drives fra, slik at React-lagets dupliserte liste holdes i synk via en sync-test.
