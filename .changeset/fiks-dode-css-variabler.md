---
'@sb1/indeks-css': patch
---

Rett `var()`-referanser som pekte på tokennavn som ikke finnes.

Seks steder i CSS-en refererte navn som aldri defineres. En slik `var()` feiler
stille: deklarasjonen blir ugyldig ved beregning av verdien, og egenskapen faller
til arv eller initialverdi, uten konsollfeil og uten at stylelint sier noe.

To av dem endrer utseende, fordi de nå faktisk virker. En deaktivert checkbox i
delvis avkrysset tilstand fikk ingen fyllfarge og står nå grå, og beskrivelsen i
en Modal var like mørk som brødteksten og er nå dempet. Den readonly
radio-knappen ser uendret ut — den arvet allerede riktig farge gjennom
`currentColor`, og nå står den fargen skrevet ned.

Spinneren og Popover mistet en deklarasjon hver. Spinneren skulle hatt et dempet
spor bak buen og Popover en skygge, men systemet har verken en dempet
border-farge eller en shadow-skala å gi dem. Ingen av dem er malt i dag, så
fjerningen endrer ingenting visuelt — den gjør bare intensjonen ærlig, slik at
den kan tas som et designvalg senere.

Tooltip-pilen leser to variabler som settes fra JavaScript. De har nå samme
fallback som Popover alt hadde, så pilen står midtstilt i stedet for å miste
posisjonen sin hvis stilen rekker frem før skriptet.
