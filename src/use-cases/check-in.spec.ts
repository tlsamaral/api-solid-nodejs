import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'

let checkInsRespository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
	beforeEach(() => {
		checkInsRespository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		sut = new CheckInUseCase(checkInsRespository, gymsRepository)

		gymsRepository.items.push({
			id: 'gym-01',
			title: 'JavaScript Gym',
			description: '',
			phone: '',
			latitude: new Decimal(-22.8399416),
			longitude: new Decimal(-45.2337389),
		})

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to check in', async () => {
		vi.setSystemTime(new Date(2024, 1, 6, 8, 0, 0))

		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -22.8399416,
			userLongitude: -45.2337389,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	// TDD - Test Driven Development -> Desenvolvimento orientado a testes

	// Red (Erro) - Green (Sucesso) - Refactor (Refatoração)

	it('should not be able to check in in twice in the same day', async () => {
		vi.setSystemTime(new Date(2024, 1, 6, 8, 0, 0))

		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -22.8399416,
			userLongitude: -45.2337389,
		})

		await expect(() =>
			sut.execute({
				gymId: 'gym-01',
				userId: 'user-01',
				userLatitude: -22.8399416,
				userLongitude: -45.2337389,
			}),
		).rejects.toBeInstanceOf(Error)
	})

	it('should be able to check in in twice but in different days', async () => {
		vi.setSystemTime(new Date(2024, 1, 6, 8, 0, 0))

		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -22.8399416,
			userLongitude: -45.2337389,
		})

		vi.setSystemTime(new Date(2024, 1, 7, 8, 0, 0))

		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -22.8399416,
			userLongitude: -45.2337389,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in on distant gym', async () => {
		gymsRepository.items.push({
			id: 'gym-02',
			title: 'TypeScript Gym',
			description: '',
			phone: '',
			latitude: new Decimal(-22.8210747),
			longitude: new Decimal(-45.2074747),
		})

		await expect(() =>
			sut.execute({
				gymId: 'gym-02',
				userId: 'user-01',
				userLatitude: -22.8399416,
				userLongitude: -45.2337389,
			}),
		).rejects.toBeInstanceOf(Error)
	})
})
