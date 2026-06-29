import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      reactHooks,
      'simple-import-sort': simpleImportSort
    },
    extends: [
      js.configs.recommended,
      importPlugin.flatConfigs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      },
      // 🚫 Ignore certain modules from namespace parsing
      'import/ignore': ['node_modules', '\\.json$', '^@reduxjs/toolkit', '^@reduxjs/toolkit/query']
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-unused-vars': 'error', // or "error"
      // 'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'comma-dangle': ['error', 'never'],
      // 🚨 Import Rules
      'import/no-duplicates': 'warn',
      'import/named': 'off',
      'import/no-unresolved': 'off',
      'import/namespace': 'off',
      'react/jsx-uses-vars': 'error',
      // React Hooks
      ...reactHooks.configs.recommended.rules // reuse recommended
    }
  }
]);
