import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Validate Check In (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to validate a check-in', async () => {
		const { token } = await createAndAuthenticateUser(app, true)

		const gym = await prisma.gym.create({
			data: {
				title: 'TypeScript Gym',
				description: 'Some description',
				phone: '123456',
				latitude: -22.8210747,
				longitude: -45.2074747,
			},
		})

		const user = await prisma.user.findFirstOrThrow()

		let checkIn = await prisma.checkIn.create({
			data: {
				gym_id: gym.id,
				user_id: user.id,
			},
		})

		const response = await request(app.server)
			.patch(`/check-ins/${checkIn.id}/validate`)
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(204)

		checkIn = await prisma.checkIn.findUniqueOrThrow({
			where: {
				id: checkIn.id,
			},
		})

		expect(checkIn.validated_at).not.toBeNull()
	})
})
