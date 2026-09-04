---
'@sb1/indeks-css': patch
---

Radio: prikken står nå midt i ringen i alle motorer

Prikken var `50 %` av ringen. På radio chip `md` ga det 9px i en 18px ring, og et odde tall kan ikke sentreres i et jevnt uten en halv piksel: ringen landet på hele piksler, prikken på halve, i begge akser. Firefox snapper bakgrunner til enhetspiksler og flyttet prikken en halv til én piksel; Chromium kantutjevnet i stedet, så der ble den bare litt uskarp. Samme CSS-feil, to malestrategier.

Prikken avledes nå av et heltalls innrykk i stedet: `--ii-radio-dot-size: calc(var(--ii-radio-size) - 2 * var(--ii-radio-dot-inset))`. Da er avstanden mellom de to boksene et heltall ved konstruksjon, i alle størrelser og alle tettheter.

- Vanlig radio: uendret, 12px prikk i 24px ring
- Radio chip `md`: prikken går fra 9px til **10px**
- Radio chip `sm`: uendret, 8px prikk i 16px ring

Labelen på vanlig radio setter i tillegg `line-height: var(--ii-radio-size)`. Den arvet 1,2 fra `.ix-body`, som ga en linjeboks på 19,2px og en ring på y = −2,4 med kanten på tvers av en enhetspiksel. Linjeboksen er en lengde og ikke et forholdstall, fordi font-skalaen er flytende: `1.5 × 15,6px` er 23,4, og da er brøkdelene tilbake i en annen tetthet. Radiogrupper blir med dette 24px høye per rad der de før var 19,2px. Chip-varianten setter sin egen linjeboks og er upåvirket.
