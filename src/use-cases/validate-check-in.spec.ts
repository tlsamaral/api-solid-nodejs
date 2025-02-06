import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ValidateCheckInUseCase } from './validate-check-in'

let checkInsRespository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
	beforeEach(() => {
		checkInsRespository = new InMemoryCheckInsRepository()
		sut = new ValidateCheckInUseCase(checkInsRespository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to validate the check in', async () => {
		const createdCheckIn = await checkInsRespository.create({
			gym_id: 'gym-01',
			user_id: 'user-01',
		})

		const { checkIn } = await sut.execute({
			checkInId: createdCheckIn.id,
		})

		expect(checkIn.validated_at).toEqual(expect.any(Date))
		expect(checkInsRespository.items[0].validated_at).toEqual(expect.any(Date))
	})

	it('should not be able to validate an inexistent check in', async () => {
		expect(() =>
			sut.execute({
				checkInId: 'inexistent-check-in-id',
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
		vi.setSystemTime(new Date(2022, 0, 1, 13, 40))

		const createdCheckIn = await checkInsRespository.create({
			gym_id: 'gym-01',
			user_id: 'user-01',
		})

		const twentyOneMinutesInMs = 1000 * 60 * 21

		vi.advanceTimersByTime(twentyOneMinutesInMs)

		expect(() =>
			sut.execute({
				checkInId: createdCheckIn.id,
			}),
		).rejects.toBeInstanceOf(LateCheckInValidationError)
	})
})
