# GitHub Actions

Oversikt over workflowene i Indeks. Navngiving, SHA-pinning og øvrige krav til nye workflows står i
[KONVENSJONER.md](./KONVENSJONER.md).

## Release-kjeden

Indeks publiseres til tre steder: npm, CDN (`cdn.sparebank1.no/indeks`) og dokumentasjonsnettstedet.
CDN-en bygges av et annet repo, [`sparebank1utvikling/sb1-indeks`](https://github.com/sparebank1utvikling/sb1-indeks),
som poller Releases-API-et her. Kjeden er derfor cron-basert, ikke event-basert — de to repoene ligger
i ulike organisasjoner, og en webhook ville krevd en cross-org-credential i et offentlig repo.

```
Merge av feature-PR til main
        │
        ▼
release-versjons-pr.yml                             push: main
  changeset version → PR «chore: version packages»
        │
        │   ⚠️  MENNESKE: merge versjons-PR-en. Ingenting publiseres uten.
        ▼
release-publiser.yml                                cron :05
  npm (Trusted Publishing) + git-tags + GitHub-releaser
        │
        ▼
sb1-indeks: sync-indeks-releases.yml                cron :20
  kloner nye release-tags → bygger CDN-artefakter → S3 (test + prod)
        │
        ▼
deploy-docs.yml                                     cron :40
  har CDN versjonen? → bygg fra release-taggen → Azure
```

Alle tre stegene kjører hver time `7-14 * * 1-5` UTC — altså 08–15 Oslo om vinteren, 09–16 om
sommeren:

| Klokke (UTC) | Steg               | Repo         |
| ------------ | ------------------ | ------------ |
| `:05`        | publiser til npm   | `indeks`     |
| `:20`        | bygg og synk CDN   | `sb1-indeks` |
| `:40`        | bygg og deploy docs | `indeks`     |

**Hvert steg oppdager tilstand, det antar den ikke.** Publiseringen er en no-op når versjonene
allerede ligger på npm, og docs-deployen nekter å kjøre før CDN-en faktisk svarer på de nye URL-ene.
Avstandene i tabellen er derfor ikke bærende: en forsinket eller droppet kjøring er ufarlig, og
prøver igjen neste time. Merger du etter siste vindu, går kjeden neste virkedag — bruk
`workflow_dispatch` hvis det haster.

Kjeden er selvhelende for *forsinkelser*, men ikke for *feil*. Feiler publiseringen eller synken,
stopper dokumentasjonsnettstedet stille på forrige versjon. Det er inntil videre det eneste signalet;
det finnes ingen varsling.

## Workflows

### Release

| Workflow                        | Fil                       | Trigger                                     | Beskrivelse                                                                                        |
| ------------------------------- | ------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Release - Opprett versjons-PR** | `release-versjons-pr.yml` | Push til `main`                             | Kjører `changeset version` og oppretter/oppdaterer PR-en «chore: version packages». Publiserer ikke. |
| **Release - Publiser til npm**    | `release-publiser.yml`    | `cron: '5 7-14 * * 1-5'` + manuell kjøring  | Publiserer fra nyeste versjons-commit, pusher git-tags og oppretter én GitHub-release per pakke.     |

Publiseringen gjør fire ting fordi `changeset publish` bare gjør det første:

1. **Publiserer fra versjons-commiten**, ikke `main` HEAD — ellers ville feature-PR-er som har landet
   siden bli publisert under et versjonsnummer changeloggen deres ikke står i.
2. **Publiserer til npm** med provenance.
3. **Pusher git-tags** (`changeset git-tag`). `changeset publish` tagger bare lokalt, og en tag som
   aldri ble pushet kan ikke repareres av en senere publisering — `getUnpublishedPackages()` hopper
   over alt som alt finnes på npm. CDN-kjeden kloner *by tag*, så en manglende tag betyr at versjonen
   aldri kommer på CDN.
4. **Oppretter GitHub-releaser.** `sb1-indeks` finner nye versjoner via Releases-API-et, ikke via
   tags. Uten release oppdateres CDN-en aldri, og synken avslutter med kode 0 — ingen merker det.

Manuell kjøring tar `dry_run` (viser publiseringsplanen uten å publisere) og `ref` (publiser fra en
gitt commit eller tag i stedet for nyeste versjons-commit).

> Versjons-PR-en lages av `changesets/action` med `GITHUB_TOKEN`. Events fra den tokenen trigger ikke
> workflows, så PR-en får **null statussjekker** og kan bare merges av en admin med bypass. Merge-gaten
> er altså en bypass, ikke et review — akseptert fordi endringen bare er versjonsnumre og changelogger.

### PR

| Workflow                             | Fil                        | Trigger                                                       | Beskrivelse                                                                       |
| ------------------------------------ | -------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **PR - Bygg, test og forhåndsvisning** | `pr-build-and-preview.yml` | PR til `main`                                                 | Lint, unit-tester, bygg, lisenssjekk, `npm audit`, Storybook og Azure-forhåndsvisning. |
| **PR - Playwright-tester**             | `pr-playwright.yml`        | PR til `main`                                                 | Screenshot- og tilgjengelighetstester i Docker mot Storybook.                      |
| **PR - Eksempel e2e**                  | `pr-eksempel-e2e.yml`      | PR til `main`, ved endring i eksempelappen eller pakkene den bruker | Funksjonell e2e mot eksempelappen i Docker.                                       |
| **PR - Rydd opp forhåndsvisning**      | `pr-cleanup.yml`           | PR lukket mot `main`                                          | Sletter Azure-forhåndsvisningen for PR-en.                                        |

Forhåndsvisningsjobben hopper over PR-er fra forks, siden Azure-tokenet ikke er tilgjengelig der.

### Deploy

| Workflow                   | Fil               | Trigger                                      | Beskrivelse                                                                 |
| -------------------------- | ----------------- | -------------------------------------------- | --------------------------------------------------------------------------- |
| **Deploy - Dokumentasjon** | `deploy-docs.yml` | `cron: '40 7-14 * * 1-5'` + manuell kjøring | Bygger docs, Storybook og eksempelapp fra release-taggen til Azure Static Web Apps. |

Workflowen har to jobber. `sjekk` er billig (checkout + `curl`) og avgjør om det er noe å deploye:
den finner nyeste release-tag per pakke, sjekker at CDN-en faktisk svarer på URL-ene for dem, og
sammenligner med taggen `docs/<css-versjon>` som settes etter hver deploy. `bygg-og-deploy` kjører
bare når `sjekk` sier ja.

To konsekvenser av å bygge fra release-taggen:

- **Versjonsnumrene på nettstedet kan ikke løpe foran npm og CDN.** I release-taggens tre *er*
  `package.json` den publiserte sannheten. Det var den feilen som gjorde at nettstedet en periode
  annonserte en CDN-URL som ga 403.
- **Rene tekst- og språkfikser vises ikke før neste release.** Nødutgangen er manuell kjøring med
  `commit`, som bygger innholdet fra den referansen du oppgir, men fortsatt viser de versjonsnumrene
  CDN-en er verifisert å ha. Da settes ingen `docs/`-tag, siden det som ligger ute ikke er en release.

### Sikkerhet

| Workflow                             | Fil                          | Trigger                                                                       | Beskrivelse                                                    |
| ------------------------------------ | ---------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Sikkerhet - CodeQL-skanning**        | `security-codeql.yml`        | Push og PR mot `main`, `cron: '25 6 * * 2'`, manuell kjøring                  | Statisk sikkerhetsanalyse. Funn over terskel blokkerer merge.   |
| **Sikkerhet - Zizmor workflow-skanning** | `security-zizmor.yml`      | Push og PR som endrer `.github/workflows/**` eller `.github/zizmor.yml`, manuell kjøring | Skanner workflowene for usikre mønstre. Unntak i `.github/zizmor.yml`. |
| **Sikkerhet - Deprecate npm-pakke**    | `security-npm-deprecate.yml` | Kun manuell kjøring                                                           | `npm deprecate` eller `npm unpublish` av en gitt pakkeversjon.  |

## Secrets

| Secret                                                  | Brukes av                                                            | Beskrivelse                                                   |
| ------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------- |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_LIVELY_WATER_0D2FD1F03` | `pr-build-and-preview.yml`, `pr-cleanup.yml`, `deploy-docs.yml`       | Azure Static Web Apps — forhåndsvisning og produksjon.        |
| `NPM_TOKEN`                                             | `security-npm-deprecate.yml`                                         | Klassisk npm-token. `deprecate` og `unpublish` dekkes ikke av Trusted Publishing. |
| `GITHUB_TOKEN`                                          | flere                                                                | Settes automatisk av GitHub. Ingen konfigurasjon.             |

**npm-publisering bruker ingen secret.** Den går via Trusted Publishing (OIDC), og npm-konfigurasjonen
er bundet til filstien `.github/workflows/release-publiser.yml`. Endrer du navnet på den fila, må
trusted publisher oppdateres for alle fem pakkene før neste release — ellers feiler publiseringen.

## Regler for `main`

Rulesettet `main` (id 13322104) krever:

- pull request med minst én godkjenning, code owner-review, at siste push er godkjent av en annen, og
  at alle review-tråder er løst
- statussjekkene `Bygg, test og deploy` (fra `pr-build-and-preview.yml`) og `playwright-tests` (fra
  `pr-playwright.yml`)
- ingen CodeQL-funn av alvorlighet `error` / `high`

Repo-admin har alltid bypass. `PR - Eksempel e2e` er *ikke* en påkrevd sjekk, siden den bare kjører
ved endringer i utvalgte mapper og en påkrevd sjekk som ikke starter blokkerer merge for alltid.

Tag-rulesettet `Release tags` (id 13323012) er **disabled**. Det er grunnen til at publiseringsjobben
kan pushe `@sb1/<pakke>@<versjon>`-tags direkte uten bypass.
