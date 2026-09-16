---
'@sb1/indeks-react': patch
---

`indeks-react sync-cdn --check` fanger nå npm-versjonsavvik i css/web, ikke bare i CDN-URL-er

Versjonen til `@sb1/indeks-css` og `@sb1/indeks-web` «bor» i tre steder: installert `@sb1/indeks-react`, CDN-URL-ene i kildekoden, og den faktiske versjonen i `node_modules/<pkg>` hvis pakken også er npm-installert. `--check` sammenlignet tidligere kun de to første — hvis alle CDN-URL-er allerede pekte på riktig versjon (fordi noen hadde limt dem inn riktig manuelt), meldte kommandoen «alt OK» selv om den npm-installerte web- eller css-pakken sto på en helt annen versjon. I CI ga det et falskt grønt lys.

`--check` sjekker nå også npm-installert versjon og feiler (exit 1) hvis den avviker fra installert `@sb1/indeks-react`, uansett om CDN-URL-ene i seg selv matcher. Er pakken bare deklarert i `package.json` uten å være faktisk installert, er det ikke noe konkret versjonstall å sammenligne mot — det telles ikke som avvik.

Oppslaget følger nå samme oppgang som Node sin egen modulresolusjon, slik at npm/yarn/pnpm-hoisting til et workspace-rot lenger opp enn `--root` ikke lenger skjuler et reelt avvik. Feilmeldingen forklarer hvor pakken ble funnet når det ikke var i `--root` selv, f.eks. `web: npm 0.1.0 installert (funnet i ../../node_modules), forventet 0.4.0 ✗`. Nytt flagg `--node-modules-root <path>` er en unntaksventil for oppsett der selv den oppgangen ikke finner pakken. Npm-avviksrapporten er også tydeligere merket (`FEIL: ...`), så den ikke kan mistolkes som en fortsettelse av en «alt matcher»-linje.
