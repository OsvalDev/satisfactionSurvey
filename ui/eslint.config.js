import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import love from 'eslint-config-love'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    ...love,
    extends: [js.configs.recommended, ...tseslint.configs.recommended ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      "no-console": "error",
      "semi": ["error", "always"],
      "no-trailing-spaces": ["error"],
      "quotes": ["error", "single"],
      "indent" : ["error", 2],
      "eol-last": ["error", "always"]
    },
  },
)