// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

// apps/client 의 FSD 규칙: 아래 레이어에서 위 레이어를 import 하면 오류로 막는다. 고치는 방법은 apps/client/AGENTS.md 에 있다
const FSD_LAYERS = ['shared', 'entities', 'features', 'widgets', 'pages', 'app'];
const fsdLayerRules = FSD_LAYERS.slice(0, -1).map((layer, index) => ({
  files: [`apps/client/src/${layer}/**/*.{ts,tsx}`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: FSD_LAYERS.slice(index + 1).map(upper => ({
          group: [`@/${upper}/*`, `**/${upper}/*`],
          message: `FSD: ${layer} 레이어에서는 ${upper} 레이어를 import 할 수 없습니다. 고치는 방법은 apps/client/AGENTS.md 의 '위 레이어 코드가 필요할 때'에 있습니다.`,
        })),
      },
    ],
  },
}));

export default tseslint.config({ ignores: ['dist', 'public'] }, {
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
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
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
}, storybook.configs["flat/recommended"], storybook.configs["flat/recommended"], ...fsdLayerRules);
