---
'@sb1/indeks-react': minor
'@sb1/indeks-css': patch
'@sb1/indeks-web': patch
---

`CheckboxOption` kan nå ha eget `name`

En checkbox-gruppe er en visuell gruppering, ikke et gjensidig utelukkende valg, så hver checkbox kan være sitt eget felt i skjemaet. `<ix-checkbox-group>` har alltid støttet dette (uten `name` på host lar den forfatterens egne input-navn stå), og `<CheckboxButton>` kunne få `name` direkte. Bruker du `options`-propen, fantes det ingen vei dit — typen hadde bare `value` og `label`.

```tsx
<CheckboxGroup
    legend="Hvilke tjenester vil du ha?"
    {...register('tjenester')}
    options={[
        { value: 'on', label: 'Nettbank', name: 'nettbank' },
        { value: 'on', label: 'Mobilbank', name: 'mobilbank' },
    ]}
/>
// sender inn nettbank=on&mobilbank=on i stedet for tjenester=nettbank&tjenester=mobilbank
```

`name` på gruppen gjør det motsatte: alle valgene sendes som flere verdier under ett felt. Modellene kan ikke kombineres, fordi web-komponenten overskriver alle input-navn med gruppens ved mount. Setter du begge, sier komponenten det nå i dev i stedet for å la per-valg-navnene forsvinne uten spor.

To presiseringer i samme slengen:

- `<CheckboxButton name>` slår gruppens navn eksplisitt. Det virket før også, men som en bieffekt av at propen havnet i rest-spreaden og ble spredt sist på `<input>`. Presedensen er nå skrevet ut i koden og låst med test.
- Kontrollert og ukontrollert modus sporer avkryssing på `value`, så to valg med samme verdi toggler i takt. Det gir også en dev-advarsel nå, siden per-valg-`name` frister til `value="on"` overalt. Med `register()` eier React Hook Form `checked`, og da er like verdier trygt.

`RadioGroup` får ikke det samme. Radio må dele `name` for at nettleseren skal håndheve at bare ett valg er aktivt.
