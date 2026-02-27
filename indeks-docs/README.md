# indeks-docs

Dokumentasjonssiden for Indeks designsystemet, bygget med [Docusaurus](https://docusaurus.io/).

## Installasjon

```bash
npm install
```

## Lokal utvikling

```bash
npm run dev
```

Starter en lokal utviklingsserver med hot reload. De fleste endringer reflekteres live uten å måtte restarte serveren.

## Bygg

```bash
npm run build
```

Genererer statisk innhold i `build`-mappen.

## Deploy

Dokumentasjonen deployes automatisk til Azure Static Web Apps via GitHub Actions (`deploy-docs.yml`) ved push til main.
