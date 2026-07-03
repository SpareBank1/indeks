# Plan: Flytt dev-advarsler fra web components til React-laget

## Kontekst

Flere komponenter har `if (import.meta.env.DEV) { console.warn(...) }`-blokker med
a11y-/bruksadvarsler (manglende label, `type="number"`, manglende `tooltip-label`,
manglende legend osv.). Spørsmålet var om de blir strippet fra publiserte pakker.

**Empirisk funn:** Ja — de strippes allerede i dag. `indeks-web/dist/npm/index.js`
har 0 `console.warn` og 0 `import.meta.env`, selv om npm-bygget *ikke* minifiseres
(`indeks-web/vite.config.ts:29`, `minify: isCdn` → `false`). Vite evaluerer
`import.meta.env.DEV` til `false` ved Indeks' egen build og tree-shaker bort `if (false)`.

**Men det avslører det egentlige problemet:** fordi `import.meta.env.DEV` bakes ved
*Indeks'* build, blir advarslene borte for **alle** konsumenter — også de som selv
kjører i dev. Advarslene lever i praksis kun når man kjører kildekoden internt
(Storybook / eksempel-app). Ønsket er at advarslene skal nå konsumenter i *deres*
dev-modus og forsvinne i *deres* prod-build.

**Hvorfor ikke bare bytte til `process.env.NODE_ENV` i web components:** Web
components er dokumentert lastet som rå ESM rett fra CDN (`indeks-docs/.../utvikler.mdx`),
uten byggesteg hos konsument. Da finnes ikke `process` i nettleseren
(`ReferenceError: process is not defined`), og det finnes ikke noe konsument-byggesteg
som kan utsette dev/prod-valget. CDN er nettopp den primære måten web components brukes
på. Derfor er konsument-styrte advarsler **fysisk umulig** for CDN-kanalen.

**Valgt strategi:** Flytt advarslene til `@sb1/indeks-react`. React-pakken
distribueres **kun via npm** (`indeks-react/package.json` — ingen CDN-build), så den
bundles alltid av konsumenten. Da kan vi bruke rammeverk-økosystemets standard-
mønster `process.env.NODE_ENV !== 'production'`, som konsumentens bundler (Vite/webpack/
Next) bytter ut → advarsler følger med i konsumentens dev og strippes i deres prod.
`@types/node` ligger allerede i `indeks-react` (`package.json:65`), så det opprinnelige
TypeScript-bruddet (commit `278544a`) er ikke lenger relevant.

## Mål

1. React-konsumenter får a11y-/bruksadvarsler i sin dev-build, automatisk strippet i prod.
2. Web components beholder ikke dupliserte advarsler som likevel er døde i publisert kode.
3. SSR-trygt (Next.js o.l.): ingen krasj på server eller i nettleser.

## Steg

### 1. Dev-warn-helper i indeks-react
Opprett `indeks-react/lib/ui/utils/devWarn.ts` (eller tilsvarende eksisterende
utils-mappe — sjekk `indeks-react/lib/ui/` for konvensjon):

```ts
// SSR-trygt: process kan mangle i enkelte runtimes; NODE_ENV kan være undefined.
export function devWarn(message: string): void {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
        console.warn(message);
    }
}
```

Begrunnelse for `typeof process`-guarden: ekstra robusthet hvis pakken havner i en
runtime uten `process` (edge/worker). Konsumentens bundler erstatter
`process.env.NODE_ENV` med en streng-literal, så `if (... !== 'production')` blir
`if (true/false)` og strippes i prod.

### 2. Legg advarsler i React-komponentene som eier de relevante propene
React-laget mottar verdiene som props, så sjekkene blir enklere og mer presise enn
DOM-inspeksjonen web component gjør i dag:

- **Manglende tilgjengelig navn** → `TextField.tsx`, `TextArea.tsx`
  (`indeks-react/lib/ui/components/form/text-field|text-area/`): advar når verken
  `label` eller `ariaLabel` er satt. Dette gjenoppretter advarselen som ble fjernet i
  commit `278544a`, nå via `devWarn`.
- **`tooltip` uten `tooltipLabel`** → `Field.tsx`
  (`indeks-react/lib/ui/components/form/field/`): advar når `tooltip` er satt men
  `tooltipLabel` mangler.
- **Message uten MessageRegion** → `Message.tsx` (`.../message/Message.tsx:83`):
  bytt `import.meta.env.DEV` → `devWarn(...)`. Dette er allerede i React-laget.
- **RadioGroup** (`.../radio-group/`): vurder advarsel for manglende legend dersom
  React-laget har tilstrekkelig informasjon via props; hvis sjekken krever DOM-/children-
  inspeksjon som bare web component har, hopp over (se "Avgrensning").

Bruk samme ordlyd som dagens web-advarsler der det er overlapp (i18n-vennlig:
meldingene er utvikler-rettede konsoll-tekster, ikke bruker-tekst).

### 3. Rydd i web components
`import.meta.env.DEV`-advarslene i `IxField.ts` (linjene 158, 185, 345) og
`IxRadioGroup.ts` (linjene 121, 225) er døde i publisert kode. Anbefaling:
- **Behold** dem som er ene og alene mulige i DOM-laget (f.eks. "fant ingen
  `<input type="radio">`", "fant ingen `<input>/<select>/<textarea>`") — de hjelper
  intern utvikling og vanilla/CDN-brukere som kjører kildenært, og er gratis i prod.
- **Fjern** de som nå dekkes ekvivalent i React (label/tooltip-label) for å unngå at
  to lag hevder å eie samme advarsel. Endelig fjern/behold avklares i implementasjon.

### 4. Tester
- `indeks-react` bruker vitest (`indeks-react/package.json`). Legg til/gjenopprett
  tester som verifiserer at `devWarn` kalles ved manglende label (jf. testene som ble
  fjernet i `278544a`: `TextField.test.tsx`, `TextArea.test.tsx`).
- Mock `console.warn` og sett `process.env.NODE_ENV` i testen.

## Kritiske filer

- `indeks-react/lib/ui/utils/devWarn.ts` (ny)
- `indeks-react/lib/ui/components/form/text-field/TextField.tsx`
- `indeks-react/lib/ui/components/form/text-area/TextArea.tsx`
- `indeks-react/lib/ui/components/form/field/Field.tsx`
- `indeks-react/lib/ui/components/message/Message.tsx`
- (web, opprydding) `indeks-web/lib/components/field/IxField.ts`,
  `indeks-web/lib/components/radio-group/IxRadioGroup.ts`

## Verifisering (lynchpin — må gjøres empirisk)

Det avgjørende ukjente er om **Vite lib-build beholder `process.env.NODE_ENV`** for
konsumenten, eller baker det til `"production"` ved Indeks' build (Vite bygger i
production mode). Verifiser:

1. Bygg React-pakken: `pnpm --filter @sb1/indeks-react build`
2. Grep output: `grep -c "process.env.NODE_ENV" indeks-react/dist/main.js`
   - **>0** → riktig: literalen står igjen, konsumentens bundler styrer dev/prod. ✅
   - **0 / erstattet med `"production"`** → Vite bakte det. Fallback:
     - Legg til i `indeks-react/vite.config.ts` en `define` som hindrer erstatning, f.eks.
       `define: { 'process.env.NODE_ENV': 'process.env.NODE_ENV' }`, eller bruk
       `globalThis.process?.env?.NODE_ENV` i helperen. Re-grep til literalen overlever.
3. Røyktest dev: i `indeks-eksempel` (Vite dev), rendre en `<TextField>` uten label →
   se advarsel i konsollen. Bygg eksempel for prod → bekreft at advarselen er borte.
4. SSR-røyktest (om praktisk): bekreft ingen `process is not defined` ved import i en
   server-runtime; helperens `typeof process`-guard dekker dette.
5. Kjør `pnpm --filter @sb1/indeks-react test`.

## Versjonering

Legg til changeset (ikke bump `package.json` manuelt) for `@sb1/indeks-react`
(minor — gjenoppretter/utvider dev-advarsler) og evt. `@sb1/indeks-web` (patch — fjernet
død kode). Se prosjektets changeset-konvensjon.

## Avgrensning

Advarsler som krever DOM-/children-inspeksjon som bare web component har tilgang til,
flyttes ikke til React hvis React-propene ikke gir nok informasjon. CDN-brukere av rene
web components får fortsatt ingen dev-advarsler — det er en akseptert konsekvens av at
CDN-kanalen ikke har et konsument-byggesteg.
