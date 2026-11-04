---
"@sb1/indeks-css": minor
"@sb1/indeks-web": minor
---

ProgressBar viser nå status som i Figma. I `success` og `error` ser støtteteksten under baren ut som en ValidationMessage, med statusikonet foran. Ikonet vises også uten støttetekst.

**Breaking:** Statusikonet er flyttet fra headeren til støtteteksten, og feilikonet heter nå `close` i stedet for `priority_high`. Har du stylet `.ix-progress-bar__header ix-icon`, eller lett etter ikonet med navn, må du bruke `.ix-progress-bar__support ix-icon[data-badge]`. Meldingen bruker ikke `data-field="error"`, så et `<ix-field>` rundt en ProgressBar tar den ikke for sin egen feilmelding.
