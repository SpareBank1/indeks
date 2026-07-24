---
"@sb1/indeks-css": patch
"@sb1/indeks-web": patch
"@sb1/indeks-react": patch
---

Tabs — justert understrek-indikator og fjernet deaktivert-tilstand (basert på design-tilbakemelding).

- **@sb1/indeks-css**: understreken tegnes nå med inset `box-shadow` i stedet for `border-bottom`, så den ikke tar layout-plass — etiketten står helt stille når linja endrer tykkelse. Passiv er 1 px, hover og aktiv/valgt er 3 px (tydeligere enn før). Padding-kompensasjonen og disabled-stilene (`opacity`/`cursor`/`pointer-events`) er fjernet. Fokusringen tegnes nå utover fanen (system-standard) i stedet for innover og avrundet — den doble linja mot understreken på en valgt+fokusert fane er borte; tablisten reserverer vertikal plass så ringen ikke klippes.
- **@sb1/indeks-web**: `<ix-tab>` støtter ikke lenger `disabled`/`aria-disabled` — speiling, hopp-over ved piltast-navigasjon og aktiverings-guard er fjernet. Piltast/Home/End navigerer over alle faner med loop rundt endene.
- **@sb1/indeks-react**: `Tabs.Tab` har ikke lenger `disabled`-prop.
