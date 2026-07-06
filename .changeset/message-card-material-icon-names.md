---
"@sb1/indeks-react": patch
---

Message og Card brukte fortsatt semantiske ikonnavn etter overgangen til Material Design-navn, noe som ga 403 på ikonet i runtime. Message-lukkeknappen bruker nå `close` (var `lukk`), og Card-chevronen defaulter til `chevron_right` (var `pil-hoyre`). Dokumentasjon og eksempler er oppdatert tilsvarende (`open_in_new` i stedet for `apne-ekstern`).
