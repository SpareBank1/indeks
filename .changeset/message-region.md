---
'@sb1/indeks-react': minor
---

Ny `MessageRegion`-wrapper for pålitelig skjermleser-annonsering av `Message`. `Message` setter ikke lenger `role`/`aria-live` på det synlige elementet — i stedet annonseres meldingsteksten gjennom én stabil, alltid-tilstedeværende `polite` live-region som `MessageRegion` eier. Hver melding legges til som en egen node (`aria-atomic="false"`), slik at flere meldinger som dukker opp tett etter hverandre alle leses opp fortløpende i tur i stedet for at den siste overskriver de andre. Dynamisk innsatte meldinger annonseres automatisk; meldinger til stede ved sidelast er stille med mindre den nye `announceOnPageLoad`-propen er satt. Ny `announceText`-prop overstyrer den opplest teksten.
