import frostConfig, { browserConfig, nodeConfig } from '@fr0st/eslint-config';

export default [
    {
        ignores: [
            '.tmp/**',
            'coverage/**',
            'dist/**',
            'playwright-report/**',
            'test-results/**',
        ],
    },
    frostConfig,
    browserConfig,
    {
        ...nodeConfig,
        files: [
            '*.config.js',
            'test/support/server/**/*.js',
        ],
    },
    {
        name: '@fr0st/query/browser-globals',
        files: [
            'src/**/*.js',
            'test/**/*.js',
        ],
        languageOptions: {
            globals: {
                $: 'readonly',
            },
        },
    },
];
