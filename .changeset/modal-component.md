---
"@sb1/indeks-css": minor
"@sb1/indeks-web": minor
"@sb1/indeks-react": minor
---

Ny Modal-komponent — et dialogvindu som krever brukerens oppmerksomhet. Bygger på native `<dialog>` åpnet med `showModal()`, som gir fokus-trap, Escape-lukking, top-layer-rendering, fokus-retur til trigger og inert bakgrunn gratis.

- **CSS** (`@sb1/indeks-css`): `.ix-modal` med sub-regioner (`__header`, `__title`, `__close`, `__body`, `__footer`, `__button-group`), størrelser via `data-size` (`small`/`medium`/`large`/`full`), dempet `::backdrop`, mobile-first (nær full bredde på mobil, `max-width` fra 768px), og fade/scale-inn som progressiv forbedring som respekterer `prefers-reduced-motion`.
- **Web** (`@sb1/indeks-web`): atferds-modul (ikke en web component) som gir ren-HTML-brukere deklarativ åpning/lukking via `data-modal-open`/`data-modal-close`, bakgrunnslukking som standard (slå av med `data-no-close-on-backdrop`), og scroll-lås på `<body>`.
- **React** (`@sb1/indeks-react`): `Modal` i Radix-stil med underkomponentene `Modal.Header`, `Modal.Title`, `Modal.Description`, `Modal.Body`, `Modal.Footer`, `Modal.ButtonGroup` og `Modal.CloseButton`. Kan brukes både kontrollert (`open`/`onOpenChange`) og ukontrollert (`defaultOpen` — komponenten eier tilstanden selv), med `size` og `closeOnBackdropClick` (på som standard). `Modal.Title` kobles automatisk til dialogen via `aria-labelledby`, og valgfri `Modal.Description` via `aria-describedby`.
- **Åpningsfokus** (React + Web): ved åpning settes fokus på selve dialogen, ikke på lukk-knappen (som ellers ville fått `showModal()`-auto-fokuset). Sett `autofocus` på et element inni modalen for å fokusere det i stedet.
