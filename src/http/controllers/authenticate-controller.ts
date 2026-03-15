import type { FastifyReply, FastifyRequest } from 'fastify'
import { AuthenticateBodySchema } from '@/http/schemas/auth-schema.js'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { AuthenticateUseCase } from '../../use-cases/authenticate-usecase.js'
import { InvalidCredentialsError } from '../../use-cases/errors/invalid-credentials-error.js'

export async function authenticateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = AuthenticateBodySchema.parse(request.body)

  try {
    const userRepository = new PrismaUserRepository()
    const authenticateUseCase = new AuthenticateUseCase(userRepository)

    await authenticateUseCase.execute({
      email,
      password,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

  return reply.status(200).send()
}
