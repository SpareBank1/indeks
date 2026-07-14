---
"@sb1/indeks-tokens": minor
"@sb1/indeks-utils": minor
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

Forenklet spacing- og font-systemet betraktelig. Spacing bruker nå faste px-verdier på tre mobile-first breakpoints (mobil, tablet fra `768px`, desktop fra `1024px`) i stedet for kontinuerlig fluid `clamp()`-skalering. De minste verdiene (`2xs`–`lg`) er like på alle breakpoints; kun `xl`–`5xl` øker på tablet og desktop. Ny `5xl`-spacing-token med tilhørende utility-klasser (`.ix-{m,p,gap}-5xl` + responsive varianter og `ix-stack`/`ix-grid` `gap="5xl"`), og `GapSize`-typen i React inkluderer nå `5xl`.

Fontstørrelsen er nå fast 16px (`1rem`) og skalerer ikke lenger opp til 18px med skjermbredden. Overskriftsstørrelsene beholder samme modulære skala, men er nå faste rem-verdier. Alle spacing- og fontstørrelser er dermed endret — dobbeltsjekk flater på flere skjermstørrelser og density-moduser.
