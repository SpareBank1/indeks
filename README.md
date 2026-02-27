# indeks

## Arkitektur oversikt

```mermaid
graph TD
    %% Eksterne repositorier
    subgraph "Eksterne repositorier"
        SB1_LOGOS[sb1-logos<br/>Statiske filer]
        SB1_FONTS[sb1-fonts<br/>Statiske filer]
        SB1_ICONS[sb1-icons<br/>Statiske filer]
    end

    %% Hovedrepositoriet indeks
    subgraph "Indeks repositorium"
        TOKENS[indeks-tokens<br/>Design tokens]
        CSS[indeks-css<br/>CSS bibliotek]
        REACT[indeks-react<br/>React komponenter]
        DOCS[indeks-docs<br/>Dokumentasjon]
        EKSEMPEL[indeks-eksempel<br/>Eksempler]
    end

    %% Publiseringsdestinasjoner
    subgraph "CDN (cdn.sparebank1.no)"
        CDN_LOGOS[Statiske logoer]
        CDN_FONTS[Statiske fonter]
        CDN_ICONS[Statiske ikoner]
        CDN_CSS[CSS filer]
    end

    subgraph "GitHub Pages (design.sparebank1.no)"
        DOCS_SITE[Dokumentasjonsside<br/>/]
        EKSEMPEL_SITE[Eksempelside<br/>/eksempel]
        STORYBOOK_SITE[Storybook<br/>/storybook]
    end

    subgraph "NPM Registry"
        NPM_TOKENS[indeks-tokens<br/>npm pakke]
        NPM_REACT[indeks-react<br/>npm pakke]
    end

    %% Publiseringsflyt
    SB1_LOGOS -->|GitHub Actions| CDN_LOGOS
    SB1_FONTS -->|GitHub Actions| CDN_FONTS
    SB1_ICONS -->|GitHub Actions| CDN_ICONS

    CSS -->|GitHub Actions| CDN_CSS
    DOCS -->|GitHub Pages| DOCS_SITE
    EKSEMPEL -->|GitHub Pages| EKSEMPEL_SITE
    REACT -->|Storybook bygg| STORYBOOK_SITE

    TOKENS -->|npm publisering| NPM_TOKENS
    REACT -->|npm publisering| NPM_REACT

    %% Avhengigheter
    TOKENS -->|byggavhengighet| CSS
    CSS -->|avhengighet| EKSEMPEL
    REACT -->|avhengighet| EKSEMPEL
    CSS -->|avhengighet| DOCS
    REACT -->|avhengighet| DOCS
    CSS -->|avhengighet| STORYBOOK_SITE

    %% Styling
    classDef external fill:#e1f5fe
    classDef indeks fill:#f3e5f5
    classDef cdn fill:#e8f5e8
    classDef github fill:#fff3e0
    classDef npm fill:#fce4ec

    class SB1_LOGOS,SB1_FONTS,SB1_ICONS external
    class TOKENS,CSS,REACT,DOCS,EKSEMPEL indeks
    class CDN_LOGOS,CDN_FONTS,CDN_ICONS,CDN_CSS cdn
    class DOCS_SITE,EKSEMPEL_SITE,STORYBOOK_SITE github
    class NPM_TOKENS,NPM_REACT npm
```

## Repositoriestruktur

Dette monorepoet inneholder flere pakker som jobber sammen for å tilby SpareBank 1 sitt designsystem:

-   **indeks-tokens**: Design tokens (farger, spacing, typografi) publisert som npm pakke
-   **indeks-css**: CSS bibliotek bygget fra tokens, publisert til CDN
-   **indeks-react**: React komponentbibliotek publisert som npm pakke
-   **indeks-docs**: Dokumentasjonsside publisert til GitHub Pages
-   **indeks-eksempel**: Eksempelimplementasjoner publisert til GitHub Pages

## Kjøre opp prosjektet

Prosjektet bruker pnpm workspaces for å gjøre det enkelt å utvikle.
For å starte å utvikle installerer du prosjektet med:

`pnpm install`

kjør så

`pnpm build`

for å bygge de statiske resursene. På sikt vil de også tilby en dev alternativ så en slipper dette steget.

`pnpm dev` starter opp docs, eksempel og storybook.

`pnpm update-packages` gir deg en `ncu` interactiv view for å oppdatere pakker.

## Versjonering og Release

Prosjektet bruker [Changesets](https://github.com/changesets/changesets) for versjonshåndtering og publisering.

### Lokalt: Legge til endringer

Når du har gjort endringer som skal publiseres:

```bash
pnpm changeset
```

Dette starter en interaktiv wizard som:

1. Lar deg velge hvilke pakker som er endret
2. Velge bump-type (major, minor, patch)
3. Skrive en kort beskrivelse av endringen

Changesets lagres i `.changeset/` mappen og committes til git.

### Lokalt: Publisere en release

For å publisere en ny versjon (krever npm-tilgang):

```bash
pnpm release
```

Dette kjører:

1. `changeset version` - Oppdaterer versjonsnumre i package.json basert på changesets
2. `pnpm build` - Bygger alle pakker med de nye versjonsnumrene
3. `changeset publish` - Publiserer til npm og oppretter git tags

**Viktig:** CSS-pakken bygges med `CDN_BUILD=true` for å injisere korrekte CDN-URLer med versjonsnumre.

### GitHub Actions (automatisert)

Når endringer pushes til main branch:

-   Bygger alle pakker
-   Deployer dokumentasjon til GitHub Pages
-   Deployer Storybook til GitHub Pages
-   (Fremtidig) Publiserer CSS til CDN (cdn.sparebank1.no)

Versjonsbumping og npm-publisering gjøres manuelt lokalt for kontroll.

### Versjoneringsregler

-   **indeks-tokens** og **indeks-utils**: Independent versioning (kan ha ulike versjoner)
-   **indeks-css** og **indeks-react**: Fixed versioning (alltid samme versjon)
-   Linked dependencies: Når tokens/utils oppdateres, bumpes også css automatisk

