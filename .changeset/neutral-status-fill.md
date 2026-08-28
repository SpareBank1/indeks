---
"@sb1/indeks-utils": minor
"@sb1/indeks-css": patch
"@sb1/indeks-react": patch
---

Nøytral status-fyll går fra brand-blå til grå. `--ix-color-status-fill*` i nøytral/default-gruppen hentes nå fra `neutral`-tieren i stedet for `main`-tieren, som er brand-blå. Dette gjør en nøytral flate faktisk nøytral — mest synlig i Tag, der `neutral` er standardverdien.

`--ix-color-status-surface*` og `--ix-color-status-border` er uendret; de peker fortsatt på `main`-tieren, som allerede er nøytral i verdi (hvit flate, grå kantlinje), og det finnes ingen `surface-neutral-*`/`border-neutral-*` å bytte til.

Endringen er WCAG-nøytral: nøytral Tag går fra 5.09:1 til 5.05:1 for emphasis-tekst og fra 13.14:1 til 13.18:1 for subtle-tekst, godt innenfor 1.4.3 (4.5:1). Emphasis-flaten holder 5.32:1 mot hvit side (1.4.11, 3:1).

I tillegg er `data-status="neutral"` nå unntatt i InteractiveIcon på samme måte som `default`, slik at de tre nøytrale tilfellene (ingen status, `default`, `neutral`) ser like ut.
