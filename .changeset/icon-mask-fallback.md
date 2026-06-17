---
"@sb1/indeks-css": patch
---

`ix-icon` viser ikke lenger en farget boks før web-componenten laster. Masken har nå en gjennomsiktig fallback (`--ii-icon-url` ikke satt), så ikonet er usynlig til `<ix-icon>` oppgraderes og setter ikon-URL-en.
