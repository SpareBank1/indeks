---
'@sb1/indeks-react': minor
---

Ny `MessageRegion`-wrapper for pålitelig skjermleser-annonsering av `Message`. `Message` setter ikke lenger `role`/`aria-live` på det synlige elementet — i stedet annonseres meldingsteksten gjennom stabile, alltid-tilstedeværende live-regioner som `MessageRegion` eier (polite for `info`/`success`, assertive for `warning`/`danger`). Dynamisk innsatte meldinger annonseres automatisk; meldinger til stede ved sidelast er stille med mindre den nye `announceOnPageLoad`-propen er satt. Ny `announceText`-prop overstyrer den opplest teksten.
