import { hash } from 'argon2'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/lib/prisma.js'
import { registerBodySchema } from '../routes.js'
import { registerUseCase } from '../use-cases/resgister.usecase.js'

export async function resgister(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    await registerUseCase({
      name,
      email,
      password,
    })
  } catch (err) {
    return reply.status(409).send(err)
  }

  return reply.send()
}
