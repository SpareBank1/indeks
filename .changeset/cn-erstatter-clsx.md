---
"@sb1/indeks-web": minor
"@sb1/indeks-react": minor
---

Ny intern `cn`-util erstatter den eksterne `clsx`-avhengigheten. `cn` bor i `@sb1/indeks-web` (`lib/utils/cn.ts`), re-eksporteres fra pakken og eksponeres på `globalThis.cn` slik at den er tilgjengelig i web components og for andre konsumenter — også uten import når indeks-web er lastet. `@sb1/indeks-react` får en bevisst duplisert kopi (React runtime-importerer ikke web) som holdes i synk via `cn.sync.test.ts`, re-eksporterer `cn` fra sitt public API, og har fjernet `clsx` som avhengighet. `ProgressBarState` er nå eksportert fra web og synk-testet mot React-kopien.
