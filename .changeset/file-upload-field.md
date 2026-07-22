---
"@sb1/indeks-css": minor
"@sb1/indeks-web": minor
"@sb1/indeks-react": minor
---

Legg til FileUploadField — filopplasting i skjema med to varianter: kompakt knapp (standard) og dra-og-slipp-dropzone (`variant="dropzone"`). Valgte filer vises i en liste med navn, størrelse og fjern-knapp.

Ny `<ix-file-upload>`-web component (DOM-generator): forfatteren skriver kun host + en native `<input type="file">`, og komponenten genererer trigger-knapp, dropzone-flate, fil-liste og en visuelt skjult polite live-region. Den native inputen forblir sannhetskilden for form-submit — komponenten holder `input.files` synk via `DataTransfer` ved fjerning og drop, uten egen JS-tilstand. Håndhever `data-max-size` (avviser for store filer og skriver `error-too-large` til `ix-field`s feilregion, som ryddes igjen når feilen ikke lenger gjelder) og forwarder `accept` til den native filvelgeren. Dra-og-slipp er kun en museforbedring på dropzone-varianten; den fokuserbare knappen inni er tastaturveien.

React via `<FileUploadField label="…" triggerLabel="…" removeLabel="…">`; `ref` går til den native inputen, og native attributter (`name`, `accept`, `multiple`, `onChange`) forwardes dit. CSS via `ix-file-upload` (dual-targeting tag + `.ix-file-upload`), mobile first med opplastingsikon/fil-ikon via `mask-image` og 44×44 px touch-mål på trigger og fjern-knapper.

Tilgjengelighet: en egen `aria-live="polite"`-region annonserer «{name} lagt til» / «{name} fjernet» — noe ingen av referansesystemene (Aksel, Carbon, Ant, Polaris, Spectrum) gjør. Fokus flyttes forutsigbart til neste fjern-knapp (eller trigger) når en fil fjernes. Ingen hardkodet tekst — `triggerLabel`/`removeLabel` er påkrevde i18n-props, `dropzoneLabel`/`addedLabel`/`removedLabel`/`errorTooLarge` sendes inn ved behov.
