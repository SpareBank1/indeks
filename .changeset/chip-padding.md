---
'@sb1/indeks-css': patch
---

Chip: horisontal padding ned fra 16px til 12px

Etter design-spec, og likt for alle fire variantene. Siden med ikon er strammere enn den nakne siden, så paddingen er nå to variabler i stedet for én:

| Variabel | md | sm | Brukes av |
|---|---|---|---|
| `--ii-chip-padding-inline` | 12px | 12px | Nakne siden: begge sider på button chip, venstre på removable, høyre på gruppe-armene |
| `--ii-chip-indicator-inset` | 12px | 8px | Ikon-siden: høyre på removable, innrykket til radioringen og checkbox-boksen |

Målt ved standard tetthet: button chip 12/12, removable 12/12 på `md` og 12/8 på `sm`, radio og checkbox 38/12 på `md` og 28/12 på `sm` med indikatoren 12px respektive 8px inn. Høyden er uendret (36 / 25,98), og alt skalerer videre med tetthetstokenene.

Chipene blir 8px smalere på `md`. Korteste realistiske label gir fortsatt rundt 44px bredde, godt over de 24px SC 2.5.8 krever.
