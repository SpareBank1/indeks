---
"@sb1/indeks-react": minor
---

`Message`, `RadioGroup` og `CheckboxGroup` sender nå øvrige HTML-attributter videre til rot-elementet, slik `Card`, `Button`, `Tag` og `Chip` alltid har gjort. Det gir `id`, `tabIndex`, `role`, `aria-*`, `data-*` og øvrige event-handlere, som er det en feiloppsummering trenger for å kunne peke på og flytte fokus til et felt eller en gruppe. `Message` har i tillegg fått `announce={false}` for å slå av opplesningen i live-regionen når noe annet — typisk en fokusflytting — allerede får meldingen lest opp. To attributter kommer bevisst ikke gjennom på gruppene: `aria-describedby` eies av web-komponenten (bruk `description`), og attributtene som utledes av props (`data-state`, `disabled`, `readonly`, `required`) kan ikke overstyres
