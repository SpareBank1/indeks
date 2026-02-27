# GitHub Actions

Oversikt over alle workflows i Indeks designsystem.

## Release-flyt

```
┌─────────────────────────────────────────────────────────────────┐
│  Push til main med changesets                                   │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  release-version-pr.yml                                         │
│  Lager release PR automatisk                                    │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️  Manuell merge av release PR                                │
│  (pr-release-gate.yml blokkerer andre PR-er)                    │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  release-tag-and-publish.yml                                    │
│  Lager én GitHub release + tags per pakke                       │
│  (trigger npm-publisering automatisk)                           │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  release-npm-publish.yml                                        │
│  Publiserer alle pakker til npm (én kjøring)                    │
└─────────────────────────────────────────────────────────────────┘
```

## Workflows

### Release & Publish

| Workflow                        | Fil                   | Trigger             | Beskrivelse                                                      |
| ------------------------------- | --------------------- | ------------------- | ---------------------------------------------------------------- |
| **Release - Create Version PR** | `release-version-pr.yml`      | Push til main       | Kjører `changeset version`, lager release-branch og PR           |
| **Release Gate**                | `pr-release-gate.yml`         | PR til main         | Blokkerer merge av andre PR-er når det finnes en åpen release PR |
| **Create GitHub Release**       | `release-tag-and-publish.yml` | Merge av release PR | Oppretter én GitHub release + individuelle tags per pakke        |
| **Publish to npm**              | `release-npm-publish.yml`     | Release published   | Bygger og publiserer alle oppdaterte pakker til npm              |

### PR & Testing

| Workflow                             | Fil                    | Trigger                                        | Beskrivelse                                                  |
| ------------------------------------ | ---------------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| **PR - Build, test, deploy preview** | `pr-build-and-preview.yml` | PR til main                                    | Bygger alle pakker, Storybook, og deployer preview til Azure |
| **PR - Cleanup on close**            | `pr-cleanup.yml`           | PR lukket                                      | Rydder opp Azure preview-deployment                          |
| **Playwright Tests**                 | `pr-playwright.yml`        | PR til main (ved endringer i react/css/tokens) | Kjører Playwright screenshot-tester i Docker                 |

### Deploy

| Workflow                           | Fil                                  | Trigger                 | Beskrivelse                                                                  |
| ---------------------------------- | ------------------------------------ | ----------------------- | ---------------------------------------------------------------------------- |
| **Build and Deploy Documentation** | `deploy-docs.yml` | Push til main / manuell | Bygger og deployer docs, Storybook og eksempel-app til Azure Static Web Apps |

## Secrets som kreves

| Secret                              | Brukes av                  | Beskrivelse                             |
| ----------------------------------- | -------------------------- | --------------------------------------- |
| `NPM_TOKEN`                         | `release-npm-publish.yml`                    | npm access token for publisering        |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_*` | `pr-build-and-preview.yml`, `pr-cleanup.yml` | Azure Static Web Apps token for preview |

## Branch protection

For at release-flyten skal fungere korrekt, legg til følgende i branch protection for `main`:

- **Required status checks:**
    - `Release gate`
    - `PR - Build, test, deploy preview`
    - `Playwright Tests` (valgfritt)

Dette sikrer at:

1. Ingen PR-er kan merges når det finnes en ventende release PR
2. Alle PR-er må bygge før merge
