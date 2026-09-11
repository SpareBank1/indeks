# Konvensjoner for GitHub Actions-workflows

Dokumenterer mønstrene som brukes på tvers av alle workflows i dette repoet.

---

## Filnavnkonvensjoner

Filnavn følger mønsteret `<kategori>-<beskrivelse>.yml`:

| Prefiks      | Brukes til                                      | Eksempler                                          |
|--------------|-------------------------------------------------|----------------------------------------------------|
| `pr-`        | Kjøres på pull requests                         | `pr-build-and-preview.yml`, `pr-playwright.yml`    |
| `release-`   | Del av release-prosessen                        | `release-versjons-pr.yml`, `release-publiser.yml`  |
| `deploy-`    | Utrullinger til hosting/infrastruktur           | `deploy-docs.yml`                                  |
| `security-`  | Sikkerhetsskanning og -vedlikehold              | `security-codeql.yml`, `security-zizmor.yml`, `security-npm-deprecate.yml` |

## Workflow-navn (name-feltet)

Format: `<Kategori> - <Beskrivelse>` (norsk, tittelform)

Alle workflowene i repoet:
- `PR - Bygg, test og forhåndsvisning`
- `PR - Playwright-tester`
- `PR - Eksempel e2e`
- `PR - Rydd opp forhåndsvisning`
- `Release - Opprett versjons-PR`
- `Release - Publiser til npm`
- `Deploy - Dokumentasjon`
- `Sikkerhet - CodeQL-skanning`
- `Sikkerhet - Zizmor workflow-skanning`
- `Sikkerhet - Deprecate npm-pakke`

Workflow-navnet vises i Actions-menyen. Statussjekkene rulesettet krever kommer derimot fra
**jobbene** (`name:` på jobben, ellers jobb-ID-en), så det er de navnene som må stå urørt — se
[README.md](./README.md).

---

## Standard triggers

### PR-workflows
```yaml
on:
    pull_request:
        branches: [main]
```

Noen PR-workflows filtrerer på `paths` for å unngå unødvendige kjøringer.

### Push til main
```yaml
on:
    push:
        branches:
            - main
```

### Kombinert push + PR (vanligst for sikkerhet/deploy)
```yaml
on:
    push:
        branches:
            - main
    pull_request:
        branches: [main]
    workflow_dispatch:
```

### Schedule

Cron brukes til to ulike formål, med ulike konvensjoner.

**Periodisk vedlikehold** — sjelden, utenfor arbeidstid:
```yaml
schedule:
    - cron: '25 6 * * 2' # tirsdager 06:25 UTC
```

**Release-kjeden** — hver time i kjernetid, med fast rekkefølge innenfor timen:
```yaml
schedule:
    # Hver time 07–14 UTC på hverdager = 08–15 Oslo (vinter) / 09–16 (sommer).
    - cron: '5 7-14 * * 1-5'
```

Minuttet er stegets plass i kjeden: `:05` npm, `:20` CDN (i `sb1-indeks`), `:40` docs. Fire regler
gjelder for alt som legges inn i den kjeden:

1. **Steget må oppdage tilstand, ikke anta den.** GitHub kan forsinke en cron-kjøring 5–30 minutter
   eller droppe den helt, så et steg kan aldri stole på at det forrige er ferdig. Publiseringen
   spør npm, docs-deployen spør CDN-en. En kjøring som er for tidlig skal gjøre ingenting og
   avslutte med kode 0 — den prøver igjen neste time.
2. **`cancel-in-progress: false`.** Se concurrency-mønsteret under.
3. **Behold `workflow_dispatch`** med de inputene som trengs for å kjøre steget manuelt når det
   haster, typisk en `ref`/`commit` og en `dry_run`.
4. **Cron kjører kun fra default branch**, med default branch' kopi av fila. Ingenting fyrer før det
   er merget, og en helt ny workflow-fil kan heller ikke dispatches før den ligger på `main`.

> 60 dager uten aktivitet i repoet deaktiverer alle schedules automatisk.

---

## Permissions-mønster

Prinsipp: minimal tilgang — gi kun det som trengs, helst på job-nivå.

### Kun lesing (standard)
```yaml
permissions:
    contents: read
```

### Lesetilgang + skriv til PR-kommentarer
```yaml
permissions:
    contents: read
    pull-requests: write
```

### Sikkerhetsskanning
```yaml
permissions:
    contents: read
    security-events: write
```

### Versjons-PR (changesets/action)
```yaml
permissions:
    contents: write # commit av versjonsbump
    pull-requests: write # opprett/oppdater versjons-PR-en
```

### npm-publisering med provenance
```yaml
permissions:
    contents: write # git push --tags + gh release create
    id-token: write # Trusted Publishing (OIDC)
```

Publiseringsjobben har `contents: write` fordi `changeset publish` bare tagger lokalt — tags og
GitHub-releaser må lages av jobben selv. Den skal **ikke** ha `pull-requests: write`.

### Tom permissions (topnivå, overstyres per job)
```yaml
permissions: {}
```

---

## Actions som brukes og versjoner (SHA-pinnet)

Alle actions er pinnet til en spesifikk commit-SHA for sikkerhet, med versjonstag i kommentar.
Tabellen er en kopi og kan bli utdatert — **fasiten er workflowene selv**:

```bash
grep -rhoE 'uses: .+@[0-9a-f]{40} # .*' .github/workflows/*.yml | sort -u
```

| Action                                  | SHA                                          | Versjon | Brukes til                        |
|-----------------------------------------|----------------------------------------------|---------|-----------------------------------|
| `actions/checkout`                      | `3d3c42e5aac5ba805825da76410c181273ba90b1`   | v7.0.1  | Checkout av kode                  |
| `actions/setup-node`                    | `820762786026740c76f36085b0efc47a31fe5020`   | v6      | Node.js-oppsett                   |
| `pnpm/action-setup`                     | `0977fd99725f1db4007ccb2928dbb4e90d06cc86`   | v6.0.10 | pnpm-installasjon                 |
| `actions/upload-artifact`               | `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a`   | v7.0.1  | Last opp testartefakter           |
| `changesets/action`                     | `8488615a623b1b9c987934bb89eae8af6a946ac1`   | v2.1.1  | Opprette/oppdatere versjons-PR-en |
| `Azure/static-web-apps-deploy`          | `1a947af9992250f3bc2e68ad0754c0b0c11566c9`   | v1      | Deploy til Azure Static Web Apps  |
| `github/codeql-action/init`             | `0c0c5dc2f136b98cb0537075ccfa21f94cd9a63e`   | codeql-bundle-v2.24.3 | Initialisere CodeQL   |
| `github/codeql-action/analyze`          | `0c0c5dc2f136b98cb0537075ccfa21f94cd9a63e`   | codeql-bundle-v2.24.3 | Kjøre CodeQL-analyse  |

`changesets/action` brukes **bare** til versjonering, med `version-script` og uten `publish-script`.
Actionen velger alltid versjonering når det finnes changesets, så den kan ikke gjenbrukes til
publisering — en cron-kjøring via actionen ville bare gjenskapt versjons-PR-en.

---

## Stegnavn-konvensjoner

Stegnavn er på norsk der de beskriver domenelogikk, engelsk der de bruker etablerte tekniske termer.

### Standard rekkefølge for bygg-workflows

1. `Checkout code` — alltid første steg
2. `Install pnpm`
3. `Set up Node.js`
4. `Install dependencies`
5. `Build all packages` / `Build tokens`
6. Domene-spesifikke steg (lint, test, etc.)
7. Opplasting av artefakter / deployment

### Eksempel
```yaml
- name: Checkout code
- name: Install pnpm
- name: Set up Node.js
- name: Install dependencies
- name: Build all packages
- name: Lint
- name: Test
```

---

## timeout-minutes

Alle jobs har eksplisitt `timeout-minutes`. Standardverdier etter kompleksitet:

| Tid   | Brukes til                                                        |
|-------|-------------------------------------------------------------------|
| 5     | Enkle sjekker uten bygg (npm deprecate, opprydding av preview)     |
| 10    | Skanning og gate-jobber (zizmor, `sjekk` i docs-deployen)          |
| 20    | Eksempel-e2e                                                       |
| 30    | Bygg, test, deploy, playwright, CodeQL, versjonering, publisering   |

---

## concurrency-mønster

Brukes for å unngå parallelle kjøringer som kan krasje eller gi race conditions.

### PR-workflows (avbryt eldre kjøring)
```yaml
concurrency:
    group: pr-${{ github.head_ref || github.ref }}
    cancel-in-progress: true
```

### Release og deploy (IKKE avbryt — må fullføres)
```yaml
concurrency:
    group: release
    cancel-in-progress: false
```

`release-versjons-pr.yml` og `release-publiser.yml` deler gruppa `release`, så en cron-publisering
køer bak en pågående versjonering i stedet for å race den.

Docs-deployen (`group: deploy-docs`) har også `cancel-in-progress: false`, i motsetning til
PR-mønsteret over. Grunnen er cron: en avbrutt kjøring kan rekke å laste opp til Azure uten å få
pushet `docs/<versjon>`-taggen, og da tror neste kjøring at versjonen ikke er deployet. Siden
kjøringene er timesvis fra hverandre og gaten hopper over det som allerede er ute, koster det
ingenting å la den pågående fullføre.

### Sikkerhet (avbryt eldre skanning)
```yaml
concurrency:
    group: codeql-${{ github.ref }}
    cancel-in-progress: true
```

---

## pnpm/Node.js setup-mønster

Standard trifecta som brukes i alle bygg-workflows:

```yaml
- name: Install pnpm
  uses: pnpm/action-setup@0977fd99725f1db4007ccb2928dbb4e90d06cc86 # v6.0.10

- name: Set up Node.js
  uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v6
  with:
      node-version: '24'
      cache: 'pnpm'

- name: Install dependencies
  run: pnpm install --frozen-lockfile --ignore-scripts
```

For npm-publisering legges `registry-url` til på `setup-node`:
```yaml
  with:
      node-version: '24'
      cache: 'pnpm'
      registry-url: 'https://registry.npmjs.org'
```

`--ignore-scripts` brukes konsekvent for å hindre at postinstall-scripts kjøres i CI.

---

## checkout-mønster

Standard (de fleste workflows):
```yaml
- name: Checkout code
  uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
  with:
      persist-credentials: false
```

Unntak — når git-operasjoner (push av branch/tags) er nødvendig, brukes `persist-credentials: true` (default) med zizmor-kommentar:
```yaml
- name: Checkout code
  # zizmor: ignore[artipacked] - persist-credentials trengs for git push av tags
  uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
  with:
      fetch-depth: 0
```

---

## Verdier fra `${{ }}` inn i `run:`

Interpoler aldri et `${{ }}`-uttrykk direkte i et `run:`-skript — verdien limes inn som tekst før
shellet kjører, og innhold noen andre kontrollerer kan da bli kode (zizmor: `template-injection`).
Send den gjennom `env:` og les den som en shell-variabel i stedet:

```yaml
- name: Sjekk ut versjons-commit
  env:
      SHA: ${{ steps.finn.outputs.sha }}
  run: git checkout --detach "$SHA"
```

## Skallsemantikk i `run:`

GitHub kjører `run:`-blokker med `bash -e`. En frittstående AND-liste der venstresiden feiler
avbryter derfor hele jobben:

```bash
git rev-parse -q --verify "refs/tags/$TAG" >/dev/null && hopp_over   # ← avbryter jobben
```

Skal en feilende sjekk bare bety «nei», bruk `if`/`fi`. Det gjelder særlig gate-jobber, der «nei» er
normaltilfellet.
