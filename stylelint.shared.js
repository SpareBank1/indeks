import stylelintNoUnsupportedBrowserFeatures from 'stylelint-no-unsupported-browser-features';

export default {
    plugins: [stylelintNoUnsupportedBrowserFeatures],
    rules: {
        'plugin/no-unsupported-browser-features': [
            true,
            {
                severity: 'error',
                ignore: [
                    // column-gap is fully supported in flex/grid; plugin misclassifies it as multi-column layout
                    'multicolumn',
                    // basic overflow values (hidden/auto/scroll/visible) are universally supported
                    'css-overflow',
                    // fit-content is supported in all target browsers from Safari 15.4
                    'intrinsic-width',
                    // basic text-decoration shorthand is universally supported
                    'text-decoration',
                    // basic text-indent: 0 is universally supported
                    'css-text-indent',
                ],
            },
        ],
    },
};
