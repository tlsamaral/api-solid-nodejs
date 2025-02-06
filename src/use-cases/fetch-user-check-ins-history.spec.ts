import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRespository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check-in Use Case', () => {
	beforeEach(() => {
		checkInsRespository = new InMemoryCheckInsRepository()
		sut = new FetchUserCheckInsHistoryUseCase(checkInsRespository)

		// gymsRepository.create({
		// 	id: 'gym-01',
		// 	title: 'JavaScript Gym',
		// 	description: '',
		// 	phone: '',
		// 	latitude: new Decimal(-22.8399416),
		// 	longitude: new Decimal(-45.2337389),
		// })
	})

	it('should be able to fetch chack-in history', async () => {
		await checkInsRespository.create({
			gym_id: 'gym-01',
			user_id: 'user-01',
		})

		await checkInsRespository.create({
			gym_id: 'gym-02',
			user_id: 'user-01',
		})

		const { checkIns } = await sut.execute({ userId: 'user-01', page: 1 })

		expect(checkIns).toHaveLength(2)
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: 'gym-01' }),
			expect.objectContaining({ gym_id: 'gym-02' }),
		])
	})

	it('should be able to fetch paginated check-ins history', async () => {
		for (let i = 1; i <= 22; i++) {
			await checkInsRespository.create({
				gym_id: `gym-${i}`,
				user_id: 'user-01',
			})
		}

		const { checkIns } = await sut.execute({ userId: 'user-01', page: 2 })

		expect(checkIns).toHaveLength(2)
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: 'gym-21' }),
			expect.objectContaining({ gym_id: 'gym-22' }),
		])
	})
})
