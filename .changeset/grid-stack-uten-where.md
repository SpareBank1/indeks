---
"@sb1/indeks-css": minor
---

Ingen `:where()` i Grid og Stack (ADR-DS-009). Utility-klasser på containeren vinner fortsatt over attributtene, også responsive som `ix-md-grid-cols-3`. Det samme gjelder `ix-col-span-*` og `ix-row-span-*` mot `colspan` og `rowspan`.

Breaking: retnings- og modifierklassene i Stack (`ix-stack-horizontal`, `ix-stack-reverse` osv.) virker bare sammen med `ix-stack`.
