module.exports = function (plop) {
    plop.setGenerator('component', {
        description: 'React component generator',
        prompts: [
            {
                type: 'input',
                name: 'componentName',
                message: "component name please. E.g. 'Button' or 'FormInput'.",
            },
            {
                type: 'input',
                name: 'componentFolder',
                message: "Name of the folder where the component will be created. E.g. 'Form' or 'Button'.",
                default: 'Form',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'lib/ui/components/{{componentFolder}}/index.ts',
                templateFile: 'templates/Component/index.ts.hbs',
                skipIfExists: true,
            },

            {
                type: 'modify',
                path: 'lib/ui/components/{{componentFolder}}/index.ts',
                pattern: /(^[\s\S]*$)/, // Matches the whole file
                template: `$1
export { {{componentName}} } from "./{{componentName}}/{{componentName}}.tsx";`,
            },
            {
                type: 'add',
                path: 'lib/ui/components/{{componentFolder}}/{{componentName}}/{{componentName}}.tsx',
                templateFile: 'templates/Component/Component.tsx.hbs',
            },
            {
                type: 'add',
                path: 'lib/ui/components/{{componentFolder}}/{{componentName}}/{{componentName}}.stories.tsx',
                templateFile: 'templates/Component/Component.stories.tsx.hbs',
            },
            {
                type: 'add',
                path: 'lib/ui/components/{{componentFolder}}/{{componentName}}/{{componentName}}.test.ts',
                templateFile: 'templates/Component/Component.test.ts.hbs',
            },
            {
                type: 'add',
                path: '../indeks-css/css/components/{{kebabCase componentFolder}}/index.css',
                templateFile: 'templates/Component/Component.css.hbs',
                skipIfExists: true,
            },
            {
                type: 'modify',
                path: '../indeks-css/css/components/{{kebabCase componentFolder}}/index.css',
                pattern: /(^[\s\S]*$)/, // Matches the whole file
                template: `$1
@import "./{{kebabCase componentName}}.css";`,
            },
            {
                type: 'add',
                path: '../indeks-css/css/components/{{kebabCase componentFolder}}/{{kebabCase componentName}}.css',
                templateFile: 'templates/Component/Component.css.hbs',
            },
        ],
    });
};
