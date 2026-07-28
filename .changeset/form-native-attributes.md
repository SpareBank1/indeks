---
"@sb1/indeks-react": minor
---

`Form` godtar nå native `<form>`-attributter (`onSubmit`, `noValidate`, `id`, `aria-*`, ...) via props. Komponenten videresendte disse til `<form>` allerede, men typen tillot bare `children`/`className`. `FormProps` utvides nå med `FormHTMLAttributes<HTMLFormElement>` slik at f.eks. `onSubmit={handleSubmit(...)}` fra React Hook Form kan brukes uten typefeil.
