import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
	{
		ignores: ['.build/*'],
	},
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
]

// import { dirname } from 'node:path'
// import { fileURLToPath } from 'node:url'
// import { FlatCompat } from '@eslint/eslintrc'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

// const compat = new FlatCompat({
// 	baseDirectory: __dirname,
// })

// const eslintConfig = [
// 	{ files: ['**/*.{js,mjs,cjs,ts}'] },
// 	{ languageOptions: { globals: globals.node } },
// 	pluginJs.configs.recommended,
// 	...tseslint.configs.recommended,
// 	...compat.extends('@rocketseat/eslint-config/node'),
// ]

// export default eslintConfig
