import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRespository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
	beforeEach(() => {
		checkInsRespository = new InMemoryCheckInsRepository()
		sut = new GetUserMetricsUseCase(checkInsRespository)
	})

	it('should be able to get check-ins count from metrics', async () => {
		await checkInsRespository.create({
			gym_id: 'gym-01',
			user_id: 'user-01',
		})

		await checkInsRespository.create({
			gym_id: 'gym-02',
			user_id: 'user-01',
		})

		const { checkInsCount } = await sut.execute({ userId: 'user-01' })

		expect(checkInsCount).toEqual(2)
	})
})
