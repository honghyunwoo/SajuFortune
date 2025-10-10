module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      // 서버 코드에서 @/lib/* import 금지 (레이어 경계 보호)
      files: ['server/**/*.{ts,tsx,js,jsx}'],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [
            {
              group: ['@/lib/*', '@/lib', '@/*'],
              message: '❌ 서버 코드에서는 @shared/* 또는 상대 경로를 사용하세요. @/lib는 클라이언트 전용입니다.',
            },
          ],
        }],
      },
    },
  ],
};
