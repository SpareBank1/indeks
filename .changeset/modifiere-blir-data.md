---
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

De siste BEM-modifierne i Table, LinkText og Text er byttet ut med dataattributter (ADR-DS-009). React-komponentene setter dem selv.

Breaking for håndskrevet HTML:

| Før | Etter |
|---|---|
| `ix-table--sm`, `ix-table--lg` | `data-size="sm"`, `data-size="lg"` på `.ix-table` |
| `ix-link-text--active` | `data-active` på `.ix-link-text` |
| `ix-link-text--no-underline` | `data-no-underline` på `.ix-link-text` |
| `ix-text--long` | `data-long` på `.ix-text` |

`:where()` er også fjernet fra `text.css`, så `.ix-text` vinner over vertens `p {}`.
