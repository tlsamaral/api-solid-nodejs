import type { CheckInsRepository } from '@/repositories/check-ins-repository'
import type { GymsRepository } from '@/repositories/gyms-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import type { CheckIn, Gym, User } from '@prisma/client'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface SearchGymUseCaseRequest {
	query: string
	page: number
}

interface SearchGymUseCaseResponse {
	gyms: Gym[]
}

export class SearchGymsUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		query,
		page,
	}: SearchGymUseCaseRequest): Promise<SearchGymUseCaseResponse> {
		const gyms = await this.gymsRepository.searchMany(query, page)

		return {
			gyms,
		}
	}
}
