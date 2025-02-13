import type { Environment } from 'vitest'

export default (<Environment>{
	name: 'prisma',
	transformMode: 'ssr',
	async setup() {
		console.log('executou setup')

		return {
			teardown() {},
		}
	},
})
