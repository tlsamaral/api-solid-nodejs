import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Check In Metrics (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to get the count of check-ins', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const user = await prisma.user.findFirstOrThrow()

		const gym = await prisma.gym.create({
			data: {
				title: 'TypeScript Gym',
				description: 'Some description',
				phone: '123456',
				latitude: -22.8210747,
				longitude: -45.2074747,
			},
		})

		const checkIns = await prisma.checkIn.createMany({
			data: [
				{
					gym_id: gym.id,
					user_id: user.id,
				},
				{
					gym_id: gym.id,
					user_id: user.id,
				},
			],
		})

		const response = await request(app.server)
			.get('/check-ins/metrics')
			.set('Authorization', `Bearer ${token}`)

		expect(response.statusCode).toEqual(200)
		expect(response.body.checkInsCount).toEqual(2)
	})
})
