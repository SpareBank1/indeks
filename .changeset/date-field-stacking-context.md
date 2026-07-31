---
"@sb1/indeks-css": patch
---

Fiks: kalenderikonet i DateField stakk opp OVER en åpen Combobox-nedtrekksliste når datofeltet lå under comboboxen i skjemaet. Både comboboxens liste og datofeltets kalenderknapp lå på `--ix-z-index-overlay` i samme (rot-)stacking-kontekst, så DOM-rekkefølgen avgjorde hvem som malte øverst. `.ix-date-field` får nå `isolation: isolate`, som holder feltets interne z-index (kalenderknapp + overlagt native-input) inne i feltet; en søsken-komponent med positivt z-index maler nå korrekt over hele datofeltet. Intern rekkefølge (native-input over knapp) er upåvirket.
