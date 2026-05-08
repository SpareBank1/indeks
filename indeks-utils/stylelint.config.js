import sharedConfig from '../stylelint.shared.js';

export default {
    ...sharedConfig,
    ignoreFiles: ['dist/**', '.build/**'],
};
