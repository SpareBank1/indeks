# Diskusjon: white-space: nowrap på Button

Akseptansekriteriet sier: "Tekst skal ikke brytes over flere linjer uten eksplisitt støtte for dette."

## Mulige utfordringer

**Overflow og avskjæring**
`white-space: nowrap` hindrer linjebryting, men uten `overflow: hidden` og `text-overflow: ellipsis` vil lang tekst skyve knappen utenfor sin container. Med ellipsis forsvinner deler av knappeteksten — som er problematisk siden den er den tilgjengelige labelen.

**Fleksibel bredde i trange layouts**
I smale kolonner (sidepanel, mobilvisning med grid) vil en knapp med lang tekst og `nowrap` bryte ut av sin container i stedet for å tilpasse seg. `width="full"` hjelper ikke — den strekker til container-bredden, men teksten går fortsatt over.

**Konflikt med full-bredde-knapper i skjema**
`width="full"` + `nowrap` på en submit-knapp i et smalt skjema vil aldri bryte, men kan overskride containeren på svært smale viewports.

## Alternativ tilnærming

La konsumenten håndtere bredde og overflow. Dokumenter at knappetekst bør holdes kort (allerede i retningslinjene). Ikke tving `nowrap` i CSS — heller en guideline enn en hard constraint.

## Spørsmål til diskusjon

- Skal `nowrap` bare gjelde `sm`/`md` og ikke `lg`?
- Skal vi tillate en `wrap`-prop for eksplisitt flerlinjestøtte?
- Er kravet ment som en visuell guideline eller en teknisk hård regel?
