---
'@sb1/indeks-react': patch
---

Button setter ikke lenger `type="button"` når den rendres som lenke

`<Button as="a">` sendte `type="button"` videre til `<a>`-elementet. Attributtet er ikke gyldig på et anker, så markupen ble flagget av HTML-validatorer, og det kunne ikke fjernes fra utsiden: `type={undefined}` traff default-verdien i komponenten og attributtet kom likevel med.

`type` settes nå bare når komponenten faktisk rendrer et `<button>`. Samme mønster som `Chip` allerede bruker.

Ingen funksjonell endring: en `<button>` får fortsatt `type="button"` som før, og nettlesere ignorerte allerede det ugyldige attributtet på anker — rollen var `link` hele veien.
