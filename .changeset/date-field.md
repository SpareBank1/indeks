---
"@sb1/indeks-web": minor
"@sb1/indeks-css": minor
"@sb1/indeks-react": minor
---

Legg til DateField — et datofelt der brukeren taster i norsk format (`dd.mm.åååå`) eller åpner enhetens innebygde kalender via en knapp i feltet. Verdien utad er alltid ISO (`åååå-mm-dd`), både gjennom `onChange`, `value` og ved skjema-innsending, så den amerikanske `mm/dd/åååå`-tvetydigheten unngås samtidig som datoen er maskinlesbar.

Ny `<ix-date-field>`-web component er en hybrid: den nøstes inne i `ix-field` (som `ix-combobox`) og lar `ix-field` gjøre ARIA-limet og formateringen (`data-format="date"` → normaliserer til `dd.mm.åååå` på blur; brukeren kan taste `1.1.2026` like gjerne som `01.01.2026`, og teksten står urørt mens man skriver), mens den selv genererer to instrumentelle elementer inn i `.ix-text-field` (idempotent): en kalenderknapp (`.ix-date-field__toggle`) og en overlagt gjennomsiktig native `<input type="date">` (`.ix-date-field__native`) som bærer ISO-verdien, gir `min`/`max`-validering og åpner OS-kalenderen. Komponenten synkroniserer den synlige `dd.mm.åååå`-verdien og den native ISO-verdien begge veier med guard mot event-løkke, speiler `min`/`max`/`disabled`/`readonly` til den native inputen, flytter `name` til den native inputen (så innsending gir ISO), og emitter én `change` per faktisk endring.

Kalenderen åpnes robust helt ned til nettleser-baselinen (Safari 15.4 / Firefox 100): der `showPicker()` finnes brukes den, ellers fanger den overlagte native-inputen tap/klikk direkte. På desktop er kalenderknappen et eget tab-stopp, så tastaturbrukere kan tabbe til den og åpne kalenderen med Enter/Mellomrom (i tillegg til å taste datoen direkte). På touch-enheter skjules knappen fra skjermleser og tas ut av tab-rekkefølgen (`IS_TOUCH` → `aria-hidden` + `tabindex="-1"`) så en swipe ikke treffer to mål — der er tasting og tap primærveien. Den overlagte native inputen er alltid `tabindex="-1"`.

React via `<DateField label="…" openLabel="…" />` med kontrollert (`value` + `onChange`) eller ukontrollert (`defaultValue`) verdi i ISO. CSS via `ix-date-field`/`.ix-date-field` (dual-target); den synlige inputen gjenbruker `.ix-text-field`-stilen. Ingen hardkodet tekst — `openLabel` (HTML: `data-open-label`) er påkrevd i18n-tekst for kalenderknappens tilgjengelige navn.

Kjent begrensning (fase 1): støtter `min`/`max`, men ikke sperring av enkeltdager eller helger, og bruker enhetens innebygde kalender. En egen kalendervelger for desktop er planlagt i en senere fase.
