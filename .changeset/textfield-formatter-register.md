---
"@sb1/indeks-react": minor
---

`TextField` i formatter-modus (`format`/`formatPattern`) fungerer nå med React Hook Form `register()`, ikke bare `<Controller>`.

Et formatert felt bindes nå identisk med et uformatert — spre `{...register('felt')}` rett på `<TextField>`. Tidligere krevde formatering `<Controller>` fordi den underliggende `ix-field` eier den synlige DOM-verdien og den rå verdien lever i en skjult mirror.

For å få dette til videresender `TextField` i formatter-modus et lite **proxy-objekt** til `ref` i stedet for den native `<input>`: proxyens `value` er alltid den rå verdien (så RHF leser/validerer rå), `set value` re-formaterer via `ix-field` (så `reset`/`setValue`/defaultValues virker), og `focus()` delegerer til den synlige inputen (fokus-ved-feil). `onChange`/`onBlur` er syntetiske events der verdien ligger i `event.target.value` under det opprinnelige feltnavnet.

**Breaking (React):** I formatter-modus er den videresendte `ref` nå et proxy-objekt (`{ value, focus(), name }`), ikke `<input>`-elementet. Trenger du verdien selv, les den via `onChange` eller `ix-field.rawValue` — ikke `ref.value` direkte. Uformaterte felt er uendret (`ref` er fortsatt den native `<input>`).
