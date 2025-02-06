import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it, test } from 'vitest'
import { CreateGymUseCase } from './create-gym'
import { Decimal } from '@prisma/client/runtime/library'

// Unit Tests

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Register Use Case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new CreateGymUseCase(gymsRepository)
	})

	it('should be able to create gym', async () => {
		const { gym } = await sut.execute({
			title: 'TypeScript Gym',
			description: '',
			phone: '',
			latitude: -22.8210747,
			longitude: -45.2074747,
		})

		expect(gym.id).toEqual(expect.any(String))
	})
})
