---
"@sb1/indeks-web": patch
---

Combobox: `ix-combobox` har fått `value`, så React Hook Form leser den valgte verdien (`47`) og ikke etiketten i søkefeltet (`+47`). Feilen traff felt med forhåndsvalg som brukeren ikke rørte, blant annet landkoden i PhoneNumberField, fra react-hook-form 7.89. Etiketten vises også riktig etter remontering.
