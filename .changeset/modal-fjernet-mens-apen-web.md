---
"@sb1/indeks-web": patch
---

Modal: scroll-låsen på `<body>` slippes nå også når en åpen modal fjernes fra DOM-en, for eksempel når forelderen fjerner den i `onOpenChange` eller ved ruteskifte. Før ble siden stående uten scroll.
