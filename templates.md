# Templates

Vi bruker [plop](https://github.com/plopjs/plop) for å generere komponenter fra templates

for å lage en ny komponent kjør `npm run create-component` fra indeks-react.

## Baked-In Helpers

There are a few helpers that I have found useful enough to include with plop. They are mostly case modifiers, but here is the complete list.

    camelCase: changeFormatToThis
    snakeCase: change_format_to_this
    dashCase/kebabCase: change-format-to-this
    dotCase: change.format.to.this
    pathCase: change/format/to/this
    properCase/pascalCase: ChangeFormatToThis
    lowerCase: change format to this
    sentenceCase: Change format to this,
    constantCase: CHANGE_FORMAT_TO_THIS
    titleCase: Change Format To This
    pkg: look up a property from a package.json file in the same folder as the plopfile.

Eksempelrepo som en kan ta inspirasjon fra: https://github.com/enzoferey/react-plop-example/tree/master
