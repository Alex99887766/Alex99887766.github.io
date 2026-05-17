import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                console: 'readonly',
                alert: 'readonly',
                FormData: 'readonly',
                fetch: 'readonly',
                localStorage: 'readonly',
                import: 'readonly'
            },
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-console': 'off',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single']
        }
    },
    {
        ignores: ['dist/**', 'node_modules/**', 'vite.config.js', 'playwright-report/**', 'test-results/**', 'coverage/**', 'test-results/**']
    }
];