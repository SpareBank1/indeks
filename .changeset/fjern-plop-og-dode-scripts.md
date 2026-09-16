---
'@sb1/indeks-react': patch
---

Fjern avsnittet om komponentgeneratoren fra READMEen.

Generatoren er slettet. Den var ikke bare ubrukt, den var ødelagt: tre av fire
maler var tomme filer, og den fjerde importerte en pakke som ikke er en
avhengighet. Avsnittet beskrev den dessuten feil på to punkter — det hevdet at
generatoren lagde en story, og at filene havnet i `lib/components/` når malen
skrev til `lib/ui/components/`.

Ingen kode i pakken er endret, og `create-component` var det eneste scriptet som
forsvant.
