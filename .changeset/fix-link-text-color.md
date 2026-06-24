---
'@sb1/indeks-css': patch
---

Fiks lenkefarge i `.ix-link-text`

`.ix-link-text` pekte på et udefinert token (`--ix-color-foreground-interactive-link`) og
arvet derfor brødtekstfargen i stedet for lenkefargen. Bruker nå
`--ix-color-foreground-link-default` (og `--ix-color-foreground-link-active` for `--active`),
og legger til en `:hover`-regel med `--ix-color-foreground-link-hover`.
