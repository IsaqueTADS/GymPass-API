import type { FastifyReply, FastifyRequest } from 'fastify'

import {
  CreateCheckInBodySchema,
  CreateCheckInParamsSchema,
} from '@/http/schemas/check-ins-schema.js'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case.js'

export async function createController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { gymId } = CreateCheckInParamsSchema.parse(request.params)
  const { userLatitude, userLongitude } = CreateCheckInBodySchema.parse(
    request.body,
  )

  const userId = request.user.sub

  const checkInUseCase = makeCheckInUseCase()

  const { checkIn } = await checkInUseCase.execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  })

  return reply.status(201).send({ checkIn })
}
