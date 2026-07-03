---
"@sb1/indeks-css": patch
"@sb1/indeks-react": patch
---

Message: lukkeknappen bruker nå `InteractiveIcon` (`.ix-interactive-icon`) i «sm» i stedet for en egen implementasjon. Krysset rendres via `ix-icon` (`lukk`), og touch-mål, hover og fokusring arves fra InteractiveIcon. Lukkeknappen har litt luft mot meldingens kant, og følger meldingens status i hover (arves via `data-status`). `.ix-message__close` beholdes kun for plassering. Ingen API-endring — `closeLabel` (React) / `aria-label` (HTML) fungerer som før.
