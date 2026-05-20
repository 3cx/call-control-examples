import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
  rules: {
    '@typescript-eslint/no-explicit-any': false,
    'no-empty': 0,
    'no-async-promise-executor': 0,
  },
  ignores: ['node_modules', 'build'],
});
