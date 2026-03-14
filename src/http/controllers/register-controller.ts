import type { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { registerBodySchema } from '../routes.js'
import { UserAlreadyExistsError } from '../use-cases/errors/user-already-exist-error.js'
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
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    return reply.status(500).send() // Uma hora qualquer ae eu penso em resolver esse BO aqui ;-)
  }

  return reply.send()
}
