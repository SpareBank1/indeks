---
"@sb1/indeks-react": patch
---

Modal: lukkes nå før den fjernes, så du kan rendre den betinget (`{valgt && <Modal open …>}`) uten egen `useEffect`. Fokus går tilbake til triggeren, og scroll-låsen slippes.
