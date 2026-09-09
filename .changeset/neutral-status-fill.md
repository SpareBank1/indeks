---
"@sb1/indeks-utils": minor
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

Nøytral status-fyll går fra brand-blå til grå, og `default` er fjernet som statusverdi.

**Nøytralt fyll er nå grått.** `--ix-color-status-fill*` i nøytral-gruppen hentes fra `neutral`-tieren i stedet for `main`-tieren, som er brand-blå. Det gjør en nøytral flate faktisk nøytral — mest synlig i Tag, der `neutral` er standardverdien. `--ix-color-status-surface*` og `--ix-color-status-border` er uendret; de peker fortsatt på `main`-tieren, som allerede er nøytral i verdi (hvit flate, grå kantlinje), og det finnes ingen `surface-neutral-*`/`border-neutral-*` å bytte til.

Endringen er WCAG-nøytral: nøytral Tag går fra 5.09:1 til 5.05:1 for emphasis-tekst og fra 13.14:1 til 13.18:1 for subtle-tekst, godt innenfor 1.4.3 (4.5:1). Emphasis-flaten holder 5.32:1 mot hvit side (1.4.11, 3:1).

**Breaking: `default` er borte som statusverdi.** `neutral` er nå det eneste navnet på nøytral status.

- `[data-status="default"]` gir ikke lenger noen `--ix-color-status-*`-verdier. Bytt til `data-status="neutral"`, eller fjern attributtet helt — elementer uten `data-status` faller fortsatt tilbake på de nøytrale verdiene via `:root`.
- `InteractiveIconStatus` er nå `'neutral' | 'info' | 'success' | 'warning' | 'danger'`. `status="default"` blir en typefeil; bruk `status="neutral"`.
- `InteractiveIcon` har ingen standardverdi for `status` lenger. Utelater du propen, arver ikonet status fra nærmeste `data-status`-forelder og er nøytralt uten en slik forelder — akkurat som før, siden `status="default"` også utelot attributtet. Ny mulighet: `status="neutral"` setter `data-status="neutral"` eksplisitt og bryter arven, slik at ikonet kan holdes nøytralt inne i en farget kontekst.
