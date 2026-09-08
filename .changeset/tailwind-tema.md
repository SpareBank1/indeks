---
'@sb1/indeks-tokens': minor
'@sb1/indeks-utils': minor
'@sb1/indeks-css': minor
---

Generer Tailwind 4-tema fra tokens. Ny fil `tailwind.css` i hver pakke kobler Tailwinds navnerom til `--ix-`-variablene, slik at `bg-fill-main-default`, `p-md`, `rounded-md` og `text-lg` gir Indeks-verdier. Importer `@sb1/indeks-css/tailwind.css` for hele settet. Temaet legger seg oppå Tailwinds egne skalaer, men overstyrer breakpointene: `sm:` blir 768px, ikke 640px.
