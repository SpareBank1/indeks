---
"@sb1/indeks-css": patch
---

InteractiveIcon arver nå status-farge fra nærmeste `data-status`-forelder når `status` ikke er satt på knappen selv. En ikon-knapp inne i en status-kontekst (f.eks. en `Message`) får dermed hover/trykk-farge fra konteksten automatisk. Et frittstående ikon uten status-forelder er uendret (nøytral farge), og en eksplisitt `status` på knappen overstyrer arven.
