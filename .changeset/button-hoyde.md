---
'@sb1/indeks-css': patch
---

Button: høyden er nå 36 / 26 og lik chip

Knappen satte ingen `line-height` og arvet 1,2 fra `.ix-body`. Høyden var derfor ikke bare feil, den var ustabil: 39,19px inne i `.ix-body`, 44px utenfor, 58,39px i en container som setter 2,4. Design-spec sier 36 / 26.

To endringer:

- `line-height: 1.125` i base-regelen, samme forholdstall som chip
- Kanten flyttes fra layout til maling. `border-width` går fra `bold` (2px) til `default` (1px), og de manglende pikslene males som `inset box-shadow` i samme farge. Kanten ser fortsatt 2px tykk ut, men tar bare 1px i høyden. Samme oppskrift som chip, TextField og Select

Kantfargen leses nå av begge halvdelene fra `--ii-button-border-color`, satt i base og overstyrt per variant og tilstand, slik at border og skygge ikke kan komme i utakt. Tertiær reserverer plassen fra base i stedet for å sette en gjennomsiktig kant selv, så alle variantene har samme kantbredde og dermed samme høyde.

Målt: 36 / 25,98 ved standard tetthet, 28 / 21,98 i compact, 44 / 33,98 i comfortable — likt chip på pikselen i alle tre. Ikon-knapper er fortsatt 38 / 28, fordi `ix-icon` er 20/18px og gulver linjeboksen. Det er et eget designvalg.
