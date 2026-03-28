import type { FastifyReply, FastifyRequest } from 'fastify'

import { CreateGymsBodySchema } from '@/http/schemas/gyms-schema.js'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case.js'

export async function createController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { title, description, phone, latitude, longitude } =
    CreateGymsBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymUseCase()

  const { gym } = await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send({ gym })
}
