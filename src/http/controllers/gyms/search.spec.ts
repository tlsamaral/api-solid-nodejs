import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Gyms (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to search gyms by query', async () => {
		const { token } = await createAndAuthenticateUser(app, true)
		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'TypeScript Gym',
				description: 'Some description',
				phone: '123456',
				latitude: -22.8210747,
				longitude: -45.2074747,
			})

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'JavaScript Gym',
				description: 'Some description',
				phone: '123456',
				latitude: -22.8210747,
				longitude: -45.2074747,
			})

		const response = await request(app.server)
			.get('/gyms/search')
			.set('Authorization', `Bearer ${token}`)
			.query({
				q: 'JavaScript',
			})

		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms).toEqual([
			expect.objectContaining({ title: 'JavaScript Gym' }),
		])
	})
})
