export default {
    extends: ['stylelint-config-standard'],
    plugins: ['stylelint-no-unsupported-browser-features'],
    rules: {
        'plugin/no-unsupported-browser-features': [true, {
            severity: 'warning',
            // Delvis støtte er OK — vi vil kun varsle om fullstendig manglende støtte
            ignorePartialSupport: true,
            ignore: [
                // postcss-preset-env (stage 2) transpilerer disse
                'css-nesting',
                'css-variables',
                // :where() støttes av alle targets — kun delvis i QQ Browser (ikke i scope)
                'css-matches-pseudo',
                // fit-content støttes i alle targets — plugin har false positive
                'intrinsic-width',
                // appearance støttes av alle targets — kun delvis i QQ Browser
                'css-appearance',
                // CSS mask støttes i alle targets med -webkit-prefix (autoprefixer håndterer)
                'css-masks',
                // cursor: not-allowed støttes ikke på iOS Safari — bevisst valg for desktop
                'css3-cursors',
                // overflow: clip/hidden støttes delvis i Safari 15.4 og QQ Browser — QQ ikke i scope
                'css-overflow',
                // position: sticky støttes — kun delvis i QQ Browser (ikke i scope)
                'css-sticky',
                // column-gap støttes — kun delvis i eldre Samsung/QQ/UC (ikke i scope)
                'multicolumn',
                // clamp()/min()/max() støttes av alle targets — kun QQ Browser mangler
                'css-math-functions',
            ],
        }],

        // Vår BEM-konvensjon (ix-block__element--modifier) er bevisst
        'selector-class-pattern': null,

        // postcss-import forventer string-notasjon, ikke url()
        'import-notation': 'string',

        // Vendor-prefixer brukes bevisst som resets (f.eks. -webkit-appearance: none)
        'property-no-vendor-prefix': null,

        // Dupliserte egenskaper er bevisste reset-mønstre (reset til none, så sett verdi)
        'declaration-block-no-duplicate-properties': null,

        // Bevisst bruk av gammel min-width: syntax fremfor moderne range-notation
        'media-feature-range-notation': null,

        // Token-navn bruker doble bindestreker for negative verdier (f.eks. --ii-spacing-size--10)
        'custom-property-pattern': null,

        // appearance: button brukes som CSS-reset for å matche nettleserens opprinnelige verdi
        'declaration-property-value-keyword-no-deprecated': null,

        // Formateringsregler vi ikke ønsker å håndheve via linter
        'declaration-empty-line-before': null,
        'comment-empty-line-before': null,
        'comment-whitespace-inside': null,
        'declaration-block-no-redundant-longhand-properties': null,
    },
    ignoreFiles: ['**/dist/**', '**/.build/**', '**/node_modules/**'],
};
