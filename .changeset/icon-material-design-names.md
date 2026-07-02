---
"@sb1/indeks-react": major
"@sb1/indeks-web": major
---

Ikon: `name` bruker nå Material Design-navn direkte, norsk-alias-mappingen er fjernet

Ikoner identifiseres nå med Material Design-navnet (= SVG-filnavnet) direkte, både i `<Icon>` (React) og `<ix-icon>` (web component). Den norske alias-mappingen (`ICON_NAMES`) er fjernet.

**Migrering — bytt norsk alias til Material Design-navn:**

| Før (`name`) | Etter (`name`) |
|--------------|----------------|
| `hjem` | `home` |
| `meny` | `menu` |
| `sparing` | `savings` |
| `lukk` | `close` |
| `pil-hoyre` | `chevron_right` |
| `pil-venstre` | `chevron_left` |
| `pil-ned` | `keyboard_arrow_down` |
| `legg-til` | `add` |
| `hake` | `check` |
| `apne-ekstern` | `open_in_new` |
| `bankkonto` | `account_balance` |
| `rediger` | `edit` |
| `betalingskort` | `credit_card` |
| `slett` | `delete` |
| `last-ned` | `download` |
| `e-post` | `mail` |
| `betaling` | `payments` |
| `info` | `info_i` |
| `sok` | `search` |
| `innstillinger` | `settings` |
| `bil` | `directions_car` |
| `feil` | `error` |
| `utropstegn` | `priority_high` |

**Andre breaking changes:**

- **`materialDesignName`-propen (React) og `materialdesignname`-attributtet (web) er fjernet.** Bruk `name` — det tar nå det samme Material Design-navnet. Erstatt `materialDesignName="foo"` med `name="foo"`.
- **`ICON_NAMES` og typen `IconValue` er fjernet.** For autocomplete på de vanligste ikonene, bruk den nye `COMMON_ICON_NAMES` / `CommonIconName`. `name` godtar fortsatt hvilken som helst Material Design-streng.
- **`availableMaterialDesignIconNames` (runtime-array) er fjernet** fra `@sb1/indeks-react` (fjerner ~100 kB fra bundelen). Typen `MaterialDesignIconName` beholdes.

Typen `IconName` er nå `CommonIconName | (string & {})`: de mest brukte SB1-ikonene autofullføres, mens alle andre Material Design-navn godtas uten typefeil.
