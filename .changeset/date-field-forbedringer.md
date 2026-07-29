---
"@sb1/indeks-web": minor
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

Forbedringer i DateField og live input-formatering.

**Separator dukker opp med én gang gruppen er full (live-formatene).** Den delte pattern-formatteren (`data-format` for `phone`, `ssn`, `account`, `orgnr`) setter nå inn separatoren så snart gruppen foran er fylt — `24` → `24.`, `2412` → `24.12.` — i stedet for å vente på neste siffer. Det gjør at brukeren aldri trenger å taste skilletegnet selv (å taste `.` blir en ufarlig no-op), og fjerner den forvirrende «henger ett tegn etter»-følelsen. Separatoren dobles ikke ved innliming av allerede formatert tekst, og dikter seg ikke opp for en halvfylt gruppe. Markøren hopper forbi den auto-innsatte separatoren når en gruppe fylles, så neste tegn havner rett — mens sletting (backspace) fortsatt kommer forbi separatoren som før.

**`date` godtar fleksibel inntasting og formaterer på blur.** `data-format="date"` er ikke lenger en live posisjonsmaske, men en skilletegn-bevisst formatter i blur-modus: brukeren kan taste `1.1.2026` like gjerne som `01.01.2026` (eller `01012026` uten skilletegn), teksten står urørt mens man skriver, og feltet normaliserer/nullutfyller til `dd.mm.åååå` når det mister fokus. Det tastede punktumet tolkes som en meningsfull segment-grense — ingen tegn strippes eller omrokeres — så `1.1.2026` blir korrekt `01.01.2026`, ikke `11.20.26`. Fullt 4-sifret år kreves for at datoen regnes som komplett; ufullstendige/tvetydige verdier (`1.1.`, `1.1.26`, `112026`) vises verbatim og gir ingen ISO-verdi. `phone`/`ssn`/`account`/`orgnr`/`amount` er fast-bredde og formaterer fortsatt live.

**Kalenderknappen virker nå i Firefox med peker.** På desktop lar den gjennomsiktige native date-inputen pekeren gå gjennom til knappen (`pointer-events: none`), som kaller `showPicker()`. Firefox åpner ikke kalenderen ved klikk i «kroppen» av en `opacity:0` date-input, så knappen var tidligere effektivt utilgjengelig for peker der. Web-komponenten reflekterer nå touch-plattform som `data-touch` på verten; på touch beholdes tap-på-native-overlay som før.

**Nytt opt-in-flagg `nativePickerOnMobile` (HTML: `data-native-picker-mobile`).** Lar et tapp hvor som helst i feltet åpne enhetens innebygde datovelger. Kun aktivt på touch-enheter; standard av, så desktop og eksisterende bruk er uendret.

**Feltet kappes til innholdsbredde.** Datoen har fast lengde (`dd.mm.åååå`), så `.ix-date-field` har nå et `max-width`-tak i stedet for å flyte ut i full bredde med mye luft. I en smalere beholder krymper feltet fortsatt, og konsumenten kan overstyre med egen `width`/`max-width` (React: `className`).

Docs: eksemplene ligger i en stack, og et nytt mobilvelger-eksempel er lagt til.
