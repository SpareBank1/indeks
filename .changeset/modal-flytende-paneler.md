---
"@sb1/indeks-css": patch
---

Fiks: flytende paneler ble feilplassert inne i en modal

Combobox-lista og dropdown-menyen la seg forskjøvet ned og til høyre når de ble åpnet inne i en `Modal`, og ble i tillegg klippet av modalens `overflow: hidden`.

Årsaken var at `.ix-modal[open]` beholdt `transform: scale(1)` som hvileverdi etter åpne-animasjonen. En transform som ikke er `none` gjør elementet til containing block for `position: fixed`-etterkommere, og panelene posisjoneres med viewport-koordinater — som nettleseren da tolket relativt til modalen. Hvileverdien er nå `transform: none`. Animasjonen er uendret: `none` interpolerer mot identitetsmatrisen, så både inn- og ut-toningen ser likt ut.
