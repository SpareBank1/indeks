---
'@sb1/indeks-web': minor
'@sb1/indeks-react': minor
'@sb1/indeks-css': patch
---

**Breaking:** PhoneNumberField har et tekstfelt for landkoden i stedet for en landvelger. Feltet har «+» foran, starter på `47` og tar bare sifre, maks tre.

- Nye props: `countryCodeReadOnly` låser landkoden, og `hideCountryCode` skjuler den.
- Gruppen har én feilmelding, `errorMessage`. Med to RHF-felt velger du den viktigste: `errors.landkode?.message ?? errors.tlf?.message`.
- Fjernet: `countryErrorMessage`, `countries`, `locale`, `noHitsText`, `toggleLabel`, `resultsText`, typene `CountryOption` og `CountryLocale`, og attributtene `data-locale`, `data-countries`, `data-country-code` og `data-default-country-code`.
- HTML: landkoden er nå et `<ix-field data-field="country">` med `.ix-text-field` og `<div data-field="prefix">+</div>`, ikke et `<ix-combobox>`.
