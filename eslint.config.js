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
        files: [
            'src/**/*.js',
            'test/**/*.js',
        ],
        rules: {
            '@stylistic/indent': [
                'error',
                4,
                {
                    ignoredNodes: ['LogicalExpression > *'],
                    MemberExpression: 'off',
                    SwitchCase: 1,
                },
            ],
            '@stylistic/new-parens': 'error',
            '@stylistic/no-extra-semi': 'error',
            '@stylistic/space-infix-ops': 'error',
            'eqeqeq': ['error', 'always', { null: 'ignore' }],
            'object-shorthand': 'error',
            'prefer-arrow-callback': 'error',
        },
    },
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
