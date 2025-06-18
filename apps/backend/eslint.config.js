import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist'],
  },
  {
    files: ['**/*.ts'],
    plugins: {},
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {},
  },
);
