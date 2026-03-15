import type { FastifyReply, FastifyRequest } from 'fastify'
import { RegisterBodySchema } from '@/http/schemas/auth-schema.js'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { UserAlreadyExistsError } from '../use-cases/errors/user-already-exist-error.js'
import { RegisterUseCase } from '../use-cases/register-usecase.js'

export async function resgisterController(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = RegisterBodySchema.parse(request.body)

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

    throw err
  }

  return reply.send()
}
