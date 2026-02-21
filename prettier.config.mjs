/** @type {import('prettier').Config} */
const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/app/(.*)$',
    '^@/pages/(.*)$',
    '^@/widgets/(.*)$',
    '^@/features/(.*)$',
    '^@/entities/(.*)$',
    '^@/shared/(.*)$',
    '',
    '^@/(.*)$',
    '',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  tailwindFunctions: ['cn'],
}

export default config
