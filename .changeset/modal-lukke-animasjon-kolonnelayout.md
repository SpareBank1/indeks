---
"@sb1/indeks-css": patch
---

Fiks visuelt hopp i modalens lukke-animasjon. `flex-direction: column` lå på `.ix-modal[open]`, mens `display: flex` holdes gjennom hele fade-en via den diskrete `display`-transisjonen (`allow-discrete`). Ved lukking ble `[open]` fjernet momentant, slik at kolonneretningen falt bort mens boksen fortsatt var flex — seksjonene reflowet da som en rad, innholdet kollapset og knapperaden hoppet opp i høyre hjørne i et kort øyeblikk. `flex-direction: column` er flyttet til basisregelen så retningen overlever exit-transisjonen; `[open]` styrer nå kun `display`.
