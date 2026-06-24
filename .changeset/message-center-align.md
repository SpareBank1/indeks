---
'@sb1/indeks-css': patch
---

Sentrer Message-innhold vertikalt mot statusikonet

`.ix-message` brukte `align-items: flex-start`, så en kort melding (kun tittel
eller én linje) ble toppjustert mens det 32px høye statusikonet stakk ut under.
Roten sentrerer nå innholdet vertikalt (`align-items: center`), mens statusikonet
og lukkeknappen selv-justerer til toppen (`align-self: flex-start`) slik at de
fortsatt flukter med tittelen når meldingen går over flere linjer.
