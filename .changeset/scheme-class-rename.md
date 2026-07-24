---
"@sb1/indeks-tokens": patch
"@sb1/indeks-utils": patch
"@sb1/indeks-css": patch
---

Renamer fargemodus-klassene til et konsistent `ix-scheme-`-sett som mapper mot CSS-egenskapen `color-scheme` / `prefers-color-scheme`.

**Breaking:** CSS-klassene for fargemodus er byttet ut:

- `.ix-light-mode` → `.ix-scheme-light`
- `.ix-dark-mode` → `.ix-scheme-dark`
- `.regard-color-scheme-preference` → `.ix-scheme-auto`

Light mode er fortsatt default uten klasse. `.regard-color-scheme-preference` manglet `ix-`-prefiks (eneste kollisjonsvern per ADR-DS-009) — de nye navnene retter dette og gir et forutsigbart sett med felles prefiks og varierende suffiks. Konsumenter som setter modus-klasse på `<body>`/wrapper må bytte til de nye navnene.
