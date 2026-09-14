---
"@sb1/indeks-css": patch
---

Chip har fått eksplisitt `line-height`, slik at alle fire variantene er like høye. Med standard tetthet er en chip nå 36px på `md` og 26px på `sm` — tallene fra design-spec.

Verdien er `1.125`, samme forholdstall som font-skalaen trapper med, og ligger i den interne variabelen `--ii-chip-line-height`. To ting var galt før:

- `.ix-chip` satte ingen `line-height` i det hele tatt, så høyden på en chip avhang av hva konsumentens side arvet ned.
- Checkbox chip arvet `line-height: 1.5` fra `checkbox.css` og ble 42px, mens de tre andre variantene lå på 37px.

Chips i en multiselect-combobox er `.ix-chip[data-removable]` og blir 1px lavere de også.

Merk at Button ikke er 36px i kode, men 39px, fordi Button bruker `--ix-border-width-bold` (2px) mot chipens 1px. Spec-en ber om at chip skal matche Button, men de to tallene kan ikke begge stemme. Chip følger her spec-tallet 36/26.
