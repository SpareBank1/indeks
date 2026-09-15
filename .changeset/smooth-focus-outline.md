---
"@sb1/indeks-css": patch
---

Fikser hakkete fokus-outline-animasjon og klipping av outline i visse komponenter.

**Jevnere fokus-outline-transition:**
Flytter `outline` og `outline-offset` til base-elementet med `transparent` farge, slik at `transition: all` kun animerer `outline-color` ved fokus og ikke tegner opp outline på nytt hver gang staten endres. Påvirker: Accordion, Button, Card, Chip, Checkbox, Radio, InteractiveIcon, Modal, Pagination, ReadMore og Tabs.

**Fikser klipping av fokus-outline:**
- **Accordion:** Legger til `border-radius` på første og siste summary slik at innvendig outline følger containerens avrundede hjørner og ikke klippes av `overflow: hidden`.
- **Pagination:** Legger til padding/margin for å gi plass til outline innenfor `overflow-x: auto`.
