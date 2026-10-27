---
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
"@sb1/indeks-web": minor
---

Én hook per del og ingen `:where()` i accordion, read-more og tabs (ADR-DS-009).

Breaking: Accordion styler `<details>` og `<summary>` direkte, og innholdet må ha `ix-accordion__content`. Tabs styler `<ix-tab-list>`, `<ix-tab>` og `<ix-tab-panel>` inni `.ix-tabs`. `ix-accordion__item`, `ix-accordion__header`, `ix-tabs__list`, `ix-tabs__tab` og `ix-tabs__panel` styles ikke lenger, og React setter dem ikke.
