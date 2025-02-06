import { randomUUID } from 'node:crypto'
import type { CheckIn, Prisma, User } from '@prisma/client'
import dayjs from 'dayjs'
import type { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
	public items: CheckIn[] = []

	async findByUserIdOnDate(
		userId: string,
		date: Date,
	): Promise<CheckIn | null> {
		const startOfTheDay = dayjs(date).startOf('date')
		const endOfTheDay = dayjs(date).endOf('date')

		const checkOnSameDate = this.items.find((checkIn) => {
			const checkInDate = dayjs(checkIn.created_at)
			const isOnSameDate =
				checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

			return checkIn.user_id === userId && isOnSameDate
		})

		if (!checkOnSameDate) {
			return null
		}

		return checkOnSameDate
	}

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn = {
			id: randomUUID(),
			user_id: data.user_id,
			gym_id: data.gym_id,
			validated_at: data.validated_at ? new Date() : null,
			created_at: new Date(),
		}

		this.items.push(checkIn)

		return checkIn
	}

	async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
		return this.items
			.filter((item) => item.user_id === userId)
			.slice((page - 1) * 20, page * 20)
	}

	async countByUserId(userId: string): Promise<number> {
		return this.items.filter((item) => item.user_id === userId).length
	}
}
