export type GlossaryEntry = {
    short: string; // brukes i tooltip
    long: string; // brukes på ordboksiden
    links?: { label: string; href: string }[];
};

export const glossary = {
    'axe-core': {
        short: 'Bibliotek fra Deque for automatisk tilgjengelighets-testing mot WCAG-regler.',
        long: 'axe-core er et open source-bibliotek fra Deque Systems som analyserer DOM-en og rapporterer brudd på tilgjengelighetsregler (WCAG). I Indeks kjøres axe-core via Playwright mot WCAG 2.2 A og AA — violations blokkerer merge.',
        links: [{ label: 'axe-core på GitHub', href: 'https://github.com/dequelabs/axe-core' }],
    },
    CDN: {
        short: 'Content Delivery Network — distribuerer filer geografisk nær brukeren for rask lasting.',
        long: 'Content Delivery Network. Et nettverk av servere plassert geografisk nær brukeren som leverer statiske filer (CSS, JS, bilder) raskere enn en sentralisert server. Indeks publiserer CSS og Web Components til CDN med versjonerte URLer — f.eks. `cdn.sparebank1.no/indeks/css/1.2.3/index.css`. Versjonerte URLer kan caches "for alltid" i nettleseren.',
    },
    Changesets: {
        short: 'Verktøy for å dokumentere endringer i en monorepo og generere versjoner.',
        long: 'Changesets er et verktøy for monorepoer der bidragsytere beskriver endringer i egne filer (`.changeset/`). Disse filene akkumuleres til en release-PR automatisk konfigurerer versjonsnumre og endringslogg. I Indeks erstatter Changesets det eldre Lerna + Conventional Commits-opplegget — og krever ikke spesifikt commit-format.',
        links: [{ label: 'Changesets på GitHub', href: 'https://github.com/changesets/changesets' }],
    },
    CMS: {
        short: 'Content Management System — system for å administrere innhold uten å redigere kode.',
        long: 'Content Management System. Et system som lar redaktører og innholdsprodusenter publisere og redigere innhold uten å gå direkte i kode. Indeks-dokumentasjonen bruker foreløpig Docusaurus (markdown/MDX) i stedet for CMS — migrering til CMS venter på avklaringer med merkevare og redaktørene.',
    },
    'CSS custom properties': {
        short: 'CSS-variabler definert med `--`-prefiks som kan brukes og overskrives i runtime.',
        long: 'CSS custom properties (også kalt CSS-variabler) er verdier definert med `--`-prefiks, f.eks. `--ix-spacing-md` eller `--ix-color-fill-main-default`. De kan settes og overskrives i runtime med JavaScript eller ved å legge CSS-klasser på et container-element. I Indeks er alle design tokens eksponert som CSS custom properties.',
    },
    'CSS Modules': {
        short: 'Build-mekanisme som scoper CSS-klassenavn automatisk per fil.',
        long: 'CSS Modules er en build-mekanisme der klassenavn automatisk gjøres unike per fil — f.eks. blir `.button` til `.button_a3f2c_1`. Det løser navnekollisjoner, men genererer hash-baserte klassenavn som er vanskelige å dokumentere og bruke fra utsiden. Indeks bruker `ix-`-prefiks i stedet for CSS Modules for å unngå dette.',
    },
    'CSS-in-JS': {
        short: 'Styling definert i JavaScript/TypeScript, f.eks. med styled-components eller Emotion.',
        long: 'CSS-in-JS er en tilnærming der styling defineres i JavaScript eller TypeScript, typisk med biblioteker som styled-components, Emotion eller vanilla-extract. Fordelen er tett kobling mellom komponent og stil. Ulempene er runtime-overhead (for de fleste bibliotekene), binding til React, og at CSS-only-bruk blir umulig. Indeks bruker ren CSS.',
    },
    'Custom Elements API': {
        short: 'Webstandard-API for å definere egne HTML-elementer med tilhørende logikk.',
        long: 'Custom Elements API er en del av Web Components-standarden. Det lar utviklere registrere egne HTML-elementer (`customElements.define(\'ix-field\', IxField)`) med tilhørende klasse og livssyklus-metoder. Elementene fungerer i alle moderne nettlesere uten ekstra rammeverk.',
        links: [
            {
                label: 'Custom Elements på MDN',
                href: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements',
            },
        ],
    },
    'density-system': {
        short: 'System for å velge ulike tettheter (Compact/Default/Comfortable) for spacing.',
        long: 'Density-systemet lar konsumenter velge mellom tre tettheter: Compact (nettbank/bedrift), Default og Comfortable (salgssider/markedsføring). Det styres med CSS-klasser på et container-element (`.ix-density--compact` osv.) og er implementert som et fast skift på ±2 trinn i spacing-skalaen. Alle komponenter inni container-elementet arver valgt density.',
    },
    'design tokens': {
        short: 'Navngitte verdier for farger, spacing og typografi som deles på tvers av plattformer.',
        long: 'Design tokens er navngitte designbeslutninger — farger, spacing, typografi, border-radius osv. — lagret som data (JSON i Indeks) og distribuert til web (CSS custom properties), iOS (Swift) og Android (XML). Tokens har to nivåer: primitive tokens (f.eks. `brand-550`) og semantiske tokens (f.eks. `color-fill-main-default`) som peker på primitiver.',
    },
    Docusaurus: {
        short: 'Statisk nettstedsrammeverk for dokumentasjon bygget på React, fra Meta.',
        long: 'Docusaurus er et open source-rammeverk fra Meta for å bygge dokumentasjonssider. Det er Markdown/MDX-basert, støtter versjonert dokumentasjon og er enkelt å komme i gang med. Indeks bruker Docusaurus som midlertidig dokumentasjonsplattform inntil en CMS-løsning er på plass.',
        links: [{ label: 'docusaurus.io', href: 'https://docusaurus.io' }],
    },
    Docker: {
        short: 'Plattform for containerisering — pakker applikasjoner for reproduserbare kjøremiljøer.',
        long: 'Docker er en plattform for containerisering. En container pakker applikasjonen med alle avhengigheter slik at den kjører likt uavhengig av operativsystem. I Indeks brukes Docker for Playwright-tester fordi screenshot-resultater varierer mellom macOS og Linux — Docker sikrer at CI og lokal utvikling bruker identisk miljø.',
        links: [{ label: 'docker.com', href: 'https://www.docker.com' }],
    },
    ESM: {
        short: 'ES Modules — moderne JavaScript-modulsystem basert på `import`/`export`.',
        long: 'ES Modules (ESM) er det moderne JavaScript-modulsystemet, introdusert i ES2015. Moduler eksporteres med `export` og importeres med `import`. ESM er nødvendig for tree-shaking og støttes nativt i alle moderne nettlesere og Node.js. Indeks distribuerer kun ESM — ikke det eldre CommonJS-formatet.',
    },
    'fluid skalering': {
        short: 'Responsiv størrelsesstrategi der verdier skalerer jevnt med viewport via `clamp()`.',
        long: 'Fluid skalering betyr at verdier (spacing, typografi) skalerer kontinuerlig med viewport-bredden via CSS `clamp()` — i stedet for å "hoppe" ved faste breakpoints. I Indeks skalerer basen fra 16px (375px viewport) til 18px (1024px+), og alle tokens beregnes fra denne basen med en geometrisk skala.',
    },
    HSL: {
        short: 'Fargerom basert på Hue, Saturation og Lightness. Ikke perseptuelt uniform.',
        long: 'HSL er et fargerom der farger beskrives med fargetone (Hue), metning (Saturation) og lysstyrke (Lightness). Det er intuitivt for mennesker, men ikke perseptuelt uniform — blå og gul med identiske L-verdier oppleves som ulike lysheter. Dette gjør det vanskelig å generere konsistente fargeskalaer. Indeks bruker OKLCH i stedet.',
    },
    MDX: {
        short: 'Markdown-format som tillater React-komponenter inline i teksten.',
        long: 'MDX er en utvidelse av Markdown som lar deg bruke React-komponenter direkte i teksten. I Indeks-dokumentasjonen brukes MDX bl.a. til å vise `AdrStatusLogg`, `AdrDeltakere` og interaktive komponenteksempler. MDX-filer kompileres av Docusaurus og kan importere komponenter som vanlige React-filer.',
        links: [{ label: 'mdxjs.com', href: 'https://mdxjs.com' }],
    },
    Monorepo: {
        short: 'Enkelt git-repository som inneholder flere relaterte pakker.',
        long: 'Et monorepo er ett git-repository som inneholder flere pakker eller prosjekter. Det gjør det enkelt å koordinere endringer på tvers av pakker og sikrer at interne avhengigheter alltid er i sync. Indeks er et monorepo med pnpm workspaces og Turborepo for build-orkestrering.',
    },
    'npm provenance': {
        short: 'Kryptografisk kobling mellom en npm-pakke og GitHub Actions-kjøringen som produserte den.',
        long: 'npm provenance er en mekanisme der publiserte pakker signeres med kryptografisk bevis på at de ble bygget av en spesifikk GitHub Actions-kjøring fra en spesifikk commit i et spesifikk repo. Konsumenter kan verifisere at pakken faktisk kommer fra kildekoden og ikke er manipulert. Indeks publiserer alle pakker med provenance.',
        links: [{ label: 'npm provenance-dokumentasjon', href: 'https://docs.npmjs.com/generating-provenance-statements' }],
    },
    OKLCH: {
        short: 'Perseptuelt uniformt fargerom der lik lightness-verdi gir lik opplevd lysstyrke.',
        long: 'OKLCH er et moderne fargerom der farger beskrives med Lightness (L), Chroma (C) og Hue (H). Det er perseptuelt uniformt — lik L-verdi gir lik opplevd lysstyrke uavhengig av fargetone. Dette gjør det mulig å generere hele fargeskalaer fra én nøkkelfarge og få forutsigbare kontraster. Indeks genererer alle fargeskalaer med OKLCH ved build.',
        links: [
            {
                label: 'OKLCH Color Picker',
                href: 'https://oklch.com',
            },
        ],
    },
    'peer dependency': {
        short: 'Avhengighet som forventes installert av konsumenten, ikke bundlet inn i pakken.',
        long: 'En peer dependency er en avhengighet som pakken trenger for å fungere, men som ikke er bundlet inn i pakken selv — konsumenten forventes å ha den installert. F.eks. deklarerer `@sb1/indeks-react` React som peer dependency (`"react": "^19.0.0"`). Det sikrer at konsumenten bruker sin egen React-instans og ikke får duplisert React i bunten.',
    },
    'perseptuelt uniform': {
        short: 'Egenskap ved et fargerom der lik numerisk avstand tilsvarer lik opplevd visuell avstand.',
        long: 'Et fargerom er perseptuelt uniformt når lik numerisk avstand mellom verdier tilsvarer lik opplevd visuell forskjell for menneskeøyet. HSL er ikke perseptuelt uniform — blå og gul med identiske S/L-verdier oppleves ulikt. OKLCH er designet for å være perseptuelt uniform og gir dermed mer forutsigbare og konsistente fargeskalaer.',
    },
    Playwright: {
        short: 'Rammeverk for end-to-end og visuell regresjonstesting av nettapplikasjoner, fra Microsoft.',
        long: 'Playwright er et testrammeverk fra Microsoft for end-to-end og visuell regresjonstesting. Det støtter Chromium, Firefox og WebKit. I Indeks kjøres Playwright i Docker mot Storybook for å ta og sammenligne screenshots — og for å kjøre axe-core-basert tilgjengelighets-testing mot WCAG 2.2.',
        links: [{ label: 'playwright.dev', href: 'https://playwright.dev' }],
    },
    pnpm: {
        short: 'Pakkebehandler for Node.js med strengere sikkerhetsisolasjon enn npm.',
        long: 'pnpm er en pakkebehandler for Node.js. Den skiller seg fra npm ved at pakker lagres i et content-addressable globalt lager og lenkes inn per prosjekt — det sparer diskplass og gir raskere installasjon. I tillegg håndhever pnpm streng isolasjon (`shamefully-hoist=false`) slik at pakker bare kan bruke avhengigheter de eksplisitt har deklarert.',
        links: [{ label: 'pnpm.io', href: 'https://pnpm.io' }],
    },
    PostCSS: {
        short: 'Verktøy for transformasjon av CSS via plugins.',
        long: 'PostCSS er et verktøy som transformerer CSS via plugins. Det brukes bl.a. til å kompilere moderne CSS-syntaks (f.eks. nesting, `color-mix()`) for eldre nettlesere, legge til vendor-prefikser med autoprefixer, og erstatte imports med absolutte URL-er for CDN-bygg. Indeks leverer ferdig PostCSS-kompilert CSS — konsumenter trenger ikke kjøre PostCSS selv.',
        links: [{ label: 'postcss.org', href: 'https://postcss.org' }],
    },
    'semantisk mapping': {
        short: 'Kobling fra primitive designverdier til semantiske navn basert på bruksområde.',
        long: 'Semantisk mapping er koblingen fra primitive tokens (f.eks. `brand-550`) til semantiske tokens som beskriver bruksområde (f.eks. `color-fill-main-default`). De semantiske tokenene varierer mellom light og dark mode — i light mode peker `color-fill-main-default` på `brand-550`, i dark mode på `brand-450`. Designerne eier den semantiske mappingen i Figma.',
    },
    'Shadow DOM': {
        short: 'Del av Web Components-standarden som isolerer markup og CSS fra resten av dokumentet.',
        long: 'Shadow DOM er en del av Web Components-standarden som lar en komponent ha sin egen isolerte DOM-tre og CSS — atskilt fra resten av dokumentet. Det gir sterk innkapsling, men gjør tilgjengelighetsarbeid vanskeligere fordi ARIA-relasjoner ikke kan krysse shadow boundaries. Indeks unngår Shadow DOM som hovedregel av denne grunn.',
        links: [
            {
                label: 'Shadow DOM på MDN',
                href: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM',
            },
        ],
    },
    SSR: {
        short: 'Server-Side Rendering — rendering av komponenter på serveren før HTML sendes til klienten.',
        long: 'Server-Side Rendering betyr at HTML genereres på serveren (f.eks. i Node.js) og sendes ferdig rendret til klienten. Det gir raskere første rendering og bedre SEO. Web Components bruker `customElements.define()` som er en nettleser-API og ikke finnes i Node.js — SSR-støtte for Indeks Web Components er derfor et åpent spørsmål som adresseres per komponent.',
    },
    Storybook: {
        short: 'Isolert utviklingsmiljø for UI-komponenter.',
        long: 'Storybook er et open source-verktøy for isolert komponentutvikling. Komponenter bygges og demonstreres i "stories" uten å måtte kjøre hele applikasjonen. Indeks bruker Storybook 9 med a11y- og docs-addons, og publiserer det til design.sparebank1.no/storybook. Playwright-tester kjøres mot Storybook.',
        links: [{ label: 'storybook.js.org', href: 'https://storybook.js.org' }],
    },
    theming: {
        short: 'Evne til å bytte ut primitive farger og få komplette fargeskalaer regenerert automatisk.',
        long: 'Theming i Indeks betyr at konsumenter (f.eks. Kredittbanken eller Spleis) kan definere egne nøkkelfarger og få komplette OKLCH-fargeskalaer og semantiske tokens generert for sitt tema. Fordi OKLCH er perseptuelt uniformt, fungerer de semantiske mappingene (f.eks. hvilke trinn som brukes for tekst og bakgrunn) likt for alle fargetoner.',
    },
    'tree-shaking': {
        short: 'Mekanisme i bundlere for å fjerne ubrukt kode fra finalpakken.',
        long: 'Tree-shaking er en optimaliseringsteknikk i moderne bundlere (Vite, webpack, Rollup) der ubrukt kode fjernes fra finalpakken. Det krever ESM-format (ikke CommonJS) fordi ESM har statisk analyserbar import/export-struktur. Indeks distribueres som ESM-only nettopp for å muliggjøre effektiv tree-shaking hos konsumenter.',
    },
    Turborepo: {
        short: 'Build-orkestrator for monorepoer med intelligent caching.',
        long: 'Turborepo er et build-system for monorepoer som bygger pakker i riktig rekkefølge basert på dependency-grafen og cacher resultater basert på innholdshasher av kildefiler. Hvis ingenting har endret seg siden forrige bygg, hoppes pakken over. Det gjør CI raskere og unngår unødvendige rebuilds under lokal utvikling.',
        links: [{ label: 'turbo.build', href: 'https://turbo.build' }],
    },
    'utility-klasser': {
        short: 'Små, gjenbrukbare CSS-klasser med ett ansvarsområde, brukt som Tailwind.',
        long: 'Utility-klasser er CSS-klasser med ett ansvarsområde — f.eks. `ix-flex` for `display: flex` eller `ix-m-md` for `margin: var(--ix-spacing-md)`. De brukes direkte i HTML og dekker de fleste layoutbehov. For avanserte behov (egne komponenter, theming) brukes CSS custom properties direkte. Tilnærmingen ligner Tailwind, men er basert på Indeks sine egne tokens og `ix-`-prefix.',
    },
    Vite: {
        short: 'Moderne frontend-bundler med rask dev server og library mode.',
        long: 'Vite er et moderne build-verktøy for frontend med en rask dev server basert på native ESM og Rollup for produksjonsbygg. Library mode gjør det enkelt å bygge komponentbiblioteker med TypeScript-declarations. Indeks bruker Vite for alle library-pakker og Storybook bruker Vite som builder.',
        links: [{ label: 'vitejs.dev', href: 'https://vitejs.dev' }],
    },
    WCAG: {
        short: 'Web Content Accessibility Guidelines — internasjonale retningslinjer for tilgjengelighet på web.',
        long: 'WCAG (Web Content Accessibility Guidelines) er internasjonale retningslinjer for tilgjengelighet på web, utgitt av W3C. De er organisert i tre nivåer: A (minimum), AA (anbefalt standard) og AAA (høyeste nivå). Indeks tester automatisk mot WCAG 2.2 A og AA via axe-core i Playwright — violations blokkerer merge.',
        links: [{ label: 'WCAG 2.2 (W3C)', href: 'https://www.w3.org/TR/WCAG22/' }],
    },
    'Web Components': {
        short: 'Webstandard for å bygge gjenbrukbare custom HTML-elementer uten rammeverk.',
        long: 'Web Components er en samling webstandarder (Custom Elements, Shadow DOM, HTML Templates) som lar utviklere lage gjenbrukbare custom HTML-elementer (`<ix-field>`) som fungerer i alle nettlesere uten avhengighet til React eller andre rammeverk. Indeks implementerer komponentlogikk som Web Components i `indeks-web` og eksponerer dem til React via tynne wrappers i `indeks-react`.',
        links: [
            {
                label: 'Web Components på MDN',
                href: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_components',
            },
        ],
    },
} as const;

export type GlossaryTerm = keyof typeof glossary;
