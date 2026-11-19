---
"@sb1/indeks-web": patch
"@sb1/indeks-react": patch
---

Modal: Escape og klikk utenfor lukker nå via `cancel`-hendelsen. En `setOpen(true)` rett etter Escape eller klikk utenfor holder modalen åpen, og i ren HTML kan `preventDefault()` på `cancel` stoppe lukking ved klikk utenfor. I kontrollert modus lukkes modalen først når `open` settes til `false`. Nestede modaler: `cancel` og `close` fra en indre modal varsler ikke lenger den ytre.
