---
'@sb1/indeks-web': minor
'@sb1/indeks-react': minor
---

Semantiske navn for `info_i` og `priority_high`

`ICON_NAMES` får to nye semantiske navn slik at statusikonene kan brukes uten å oppgi det rå Material Design-navnet:

- `info` peker nå på `info_i`-glyfen (kanonisk, slått sammen med `info` per ikonbruksanalysen).
- `utropstegn` peker på `priority_high` (slått sammen med `exclamation`).

Message bruker disse semantiske navnene internt (`name` i stedet for `materialdesignname`), og dokumentasjon/eksempler er oppdatert tilsvarende.
