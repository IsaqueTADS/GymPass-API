import type { FastifyReply, FastifyRequest } from 'fastify'

import { SearchGymsQuerySchema } from '@/http/schemas/gyms-schema.js'

import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case.js'

export async function searchController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { query, page } = SearchGymsQuerySchema.parse(request.params)

  const searchGymsUseCase = makeSearchGymsUseCase()

  const { gyms } = await searchGymsUseCase.execute({ query, page })

  return reply.status(201).send({ gyms })
}
