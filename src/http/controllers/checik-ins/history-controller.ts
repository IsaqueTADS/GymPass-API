import type { FastifyReply, FastifyRequest } from 'fastify'

import { FetchUserCheckInsHistoryQuerySchema } from '@/http/schemas/check-ins-schema.js'
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case.js'

export async function historyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { page } = FetchUserCheckInsHistoryQuerySchema.parse(request.query)

  const userId = request.user.sub

  const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

  const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
    userId,
    page,
  })

  return reply.status(200).send({ checkIns })
}
