import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchNeabyGymsUseCase } from '../fetch-nearby-gyms'

export function makeFetchNearbyGymsUseCase() {
	const gymsRepository = new PrismaGymsRepository()
	const useCase = new FetchNeabyGymsUseCase(gymsRepository)

	return useCase
}
