---
"@sb1/indeks-web": patch
---

DateField godtar nå 2-sifret år og utvider det til `20xx`: `1.1.26` tolkes som `01.01.2026` (`99` → `2099`, `00` → `2000`). Utvidingen gjelder kun punktum-formen; den tvetydige skilletegnsløse 6-sifrede formen (`112026`) avvises fortsatt. Både den synlige blur-formateringen og den native ISO-verdien går gjennom samme kanoniske `parseDate`, så de holder seg i synk.
