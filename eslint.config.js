import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                // Додаємо стандартні об'єкти браузера
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                console: 'readonly',
                // Виправляємо твої помилки:
                alert: 'readonly',
                FormData: 'readonly',
                // Додаємо про всяк випадок для майбутніх лаб
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
        ignores: ['dist/**', 'node_modules/**', 'vite.config.js']
    }
];