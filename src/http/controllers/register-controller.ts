import type { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaUserRepository } from '@/repositories/prisma-users-repository.js'
import { registerBodySchema } from '../routes.js'
import { RegisterUseCase } from '../use-cases/resgister-usecase.js'

export async function resgister(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const userRepository = new PrismaUserRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    return reply.status(409).send(err)
  }

  return reply.send()
}
