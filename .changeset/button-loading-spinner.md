---
'@sb1/indeks-css': minor
'@sb1/indeks-react': minor
---

Button viser nå en spinner ved `loading=true`. Spinneren skalerer automatisk
med knappens font-size og erstatter eventuelle ikoner i `children`. Ved bruk
direkte i HTML må konsumenten selv plassere `<span class="ix-spinner" aria-hidden>`
inni knappen og sette `disabled` + `data-loading="true"`.
