import type { FastifyReply, FastifyRequest } from 'fastify'

import { FetchNearbyGymsQuerySchema } from '@/http/schemas/gyms-schema.js'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case.js'

export async function nearbyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userLatitude, userLongitude } = FetchNearbyGymsQuerySchema.parse(
    request.query,
  )

  const FetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await FetchNearbyGymsUseCase.execute({
    userLatitude,
    userLongitude,
  })

  return reply.status(201).send({ gyms })
}
