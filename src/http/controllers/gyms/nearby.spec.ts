import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Nearby Gyms (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to list nearby gyms', async () => {
		const { token } = await createAndAuthenticateUser(app)

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Far Gym',
				description: '',
				phone: '',
				latitude: -23.0144261,
				longitude: -45.5517424,
			})

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Near Gym',
				description: '',
				phone: '',
				latitude: -22.8210747,
				longitude: -45.2074747,
			})

		const response = await request(app.server)
			.get('/gyms/nearby')
			.set('Authorization', `Bearer ${token}`)
			.query({
				latitude: -22.8399416,
				longitude: -45.2337389,
			})

		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms).toEqual([
			expect.objectContaining({ title: 'Near Gym' }),
		])
	})
})
