import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function history(request: FastifyRequest, reply: FastifyReply) {
	const checkInsHistoryQuerySchema = z.object({
		page: z.coerce.number().min(1).default(1),
	})

	const { page } = checkInsHistoryQuerySchema.parse(request.query)

	const fetchUserCheckInsUseCase = makeFetchUserCheckInsHistoryUseCase()

	const { checkIns } = await fetchUserCheckInsUseCase.execute({
		userId: request.user.sub,
		page,
	})

	return reply.status(200).send({
		checkIns,
	})
}
