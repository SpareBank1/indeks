---
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

Legg til Removable chip — en chip som representerer et aktivt valg og kan fjernes. Hele chipen er fjern-knappen (klikk / Enter / Mellomrom fjerner), og krysset er et dekorativt CSS-ikon. CSS via `.ix-chip[data-removable]` (krysset legges til med `::after`, ingen ekstra markup); React via `<RemovableChip removeLabel="..." onRemove={...}>`. Det tilgjengelige navnet komponeres som «[label] [removeLabel]» — `removeLabel` er påkrevd og må sendes inn på brukerens språk (i18n, ingen hardkodet fallback).
