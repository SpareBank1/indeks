# Konvensjoner for GitHub Actions-workflows

Dokumenterer mønstrene som brukes på tvers av alle workflows i dette repoet.

---

## Filnavnkonvensjoner

Filnavn følger mønsteret `<kategori>-<beskrivelse>.yml`:

| Prefiks      | Brukes til                                      | Eksempler                                          |
|--------------|-------------------------------------------------|----------------------------------------------------|
| `pr-`        | Kjøres på pull requests                         | `pr-build-and-preview.yml`, `pr-playwright.yml`    |
| `release-`   | Del av release-prosessen                        | `release-version-pr.yml`, `release-tag-and-publish.yml`, `release-npm-publish.yml` |
| `deploy-`    | Utrullinger til hosting/infrastruktur           | `deploy-docs.yml`                                  |
| `security-`  | Sikkerhetsskanning og -vedlikehold              | `security-codeql.yml`, `security-zizmor.yml`, `security-npm-deprecate.yml` |

## Workflow-navn (name-feltet)

Format: `<Kategori> - <Beskrivelse>` (norsk, tittelform)

Eksempler:
- `PR - Bygg, test og forhåndsvisning`
- `PR - Playwright-tester`
- `PR - Sperr ved ventende release`
- `PR - Rydd opp forhåndsvisning`
- `Release - Opprett versjons-PR`
- `Release - Opprett tag og GitHub-release`
- `Release - Publiser til npm`
- `Deploy - Dokumentasjon`
- `Sikkerhet - CodeQL-skanning`
- `Sikkerhet - Zizmor workflow-skanning`
- `Sikkerhet - Deprecate npm-pakke`

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

### Scheduled (CodeQL)
```yaml
schedule:
    - cron: '25 6 * * 2'  # tirsdager 06:25 UTC
```

### Release-event (npm-publisering)
```yaml
on:
    release:
        types: [published]
```

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

### Release-oppretting (trenger push av tags)
```yaml
permissions:
    contents: write
```

### npm-publisering med provenance
```yaml
permissions:
    contents: read
    id-token: write
```

### Tom permissions (topnivå, overstyres per job)
```yaml
permissions: {}
```

---

## Actions som brukes og versjoner (SHA-pinnet)

Alle actions er pinnet til en spesifikk commit-SHA for sikkerhet, med versjonstag i kommentar.

| Action                                  | SHA                                          | Versjon | Brukes til                        |
|-----------------------------------------|----------------------------------------------|---------|-----------------------------------|
| `actions/checkout`                      | `de0fac2e4500dabe0009e67214ff5f5447ce83dd`   | v6      | Checkout av kode                  |
| `actions/setup-node`                    | `6044e13b5dc448c55e2357c09f80417699197238`   | v6      | Node.js-oppsett                   |
| `pnpm/action-setup`                     | `fc06bc1257f339d1d5d8b3a19a8cae5388b55320`   | v4.4.0  | pnpm-installasjon                 |
| `actions/cache`                         | `cdf6c1fa76f9f475f3d7449005a359c84ca0f306`   | v5      | Caching (Docker-lag)              |
| `actions/upload-artifact`               | `b7c566a772e6b6bfb58ed0dc250532a479d7789f`   | v6      | Last opp testartefakter           |
| `Azure/static-web-apps-deploy`          | `1a947af9992250f3bc2e68ad0754c0b0c11566c9`   | v1      | Deploy til Azure Static Web Apps  |
| `docker/setup-buildx-action`            | `8d2750c68a42422c14e847fe6c8ac0403b4cbd6f`   | v3      | Docker Buildx-oppsett             |
| `docker/build-push-action`              | `10e90e3645eae34f1e60eeb005ba3a3d33f178e8`   | v6      | Bygg Docker-image                 |
| `github/codeql-action/init`             | `0c0c5dc2f136b98cb0537075ccfa21f94cd9a63e`   | codeql-bundle-v2.24.3 | Initialisere CodeQL   |
| `github/codeql-action/analyze`          | `0c0c5dc2f136b98cb0537075ccfa21f94cd9a63e`   | codeql-bundle-v2.24.3 | Kjøre CodeQL-analyse  |

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

| Tid   | Brukes til                                              |
|-------|---------------------------------------------------------|
| 5     | Enkle sjekker (release gate, npm deprecate, check-job)  |
| 10    | Sikkerhetsskanning (CodeQL, zizmor)                     |
| 30    | Bygg, test, deploy, playwright, npm-publisering         |

---

## concurrency-mønster

Brukes for å unngå parallelle kjøringer som kan krasje eller gi race conditions.

### PR-workflows (avbryt eldre kjøring)
```yaml
concurrency:
    group: pr-${{ github.head_ref || github.ref }}
    cancel-in-progress: true
```

### Deploy (avbryt eldre deploy)
```yaml
concurrency:
    group: deploy-docs
    cancel-in-progress: true
```

### Release (IKKE avbryt — release må fullføres)
```yaml
concurrency:
    group: release
    cancel-in-progress: false
```

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
  uses: pnpm/action-setup@fc06bc1257f339d1d5d8b3a19a8cae5388b55320 # v4.4.0

- name: Set up Node.js
  uses: actions/setup-node@6044e13b5dc448c55e2357c09f80417699197238 # v6
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
  uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6
  with:
      persist-credentials: false
```

Unntak — når git-operasjoner (push av branch/tags) er nødvendig, brukes `persist-credentials: true` (default) med zizmor-kommentar:
```yaml
- name: Checkout code
  # zizmor: ignore[artipacked] - persist-credentials trengs for git push av branch
  uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6
  with:
      fetch-depth: 0
```
