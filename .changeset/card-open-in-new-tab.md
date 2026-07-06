---
"@sb1/indeks-react": patch
---

Card har ny `openInNewTab`-prop som åpner href-lenken i ny fane (`target="_blank"` + `rel="noopener noreferrer"`). Dokumentasjonens "Eget chevron-ikon"-eksempel var misvisende — det viste `open_in_new`-ikon uten faktisk ny-fane-oppførsel, og er nå rettet. HTML-eksempel for statisk vs. klikkbart bruker `ix-stack` i stedet for inline flex.
