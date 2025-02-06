import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchNeabyGymsUseCase } from './fetch-nearby-gyms'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNeabyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new FetchNeabyGymsUseCase(gymsRepository)
	})

	it('should be able to fetch nearby gyms', async () => {
		await gymsRepository.create({
			title: 'Near Gym',
			description: '',
			phone: '',
			latitude: -22.8210747,
			longitude: -45.2074747,
		})

		await gymsRepository.create({
			title: 'Far Gym',
			description: '',
			phone: '',
			latitude: -23.0144261,
			longitude: -45.5517424,
		})

		const { gyms } = await sut.execute({
			userLatitude: -22.8399416,
			userLongitude: -45.2337389,
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
	})
})
