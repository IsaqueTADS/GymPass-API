import type { FastifyReply, FastifyRequest } from 'fastify'
import { AuthenticateBodySchema } from '@/http/schemas/auth-schema.js'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case.js'
import { InvalidCredentialsError } from '../../../use-cases/errors/invalid-credentials-error.js'

export async function authenticateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = AuthenticateBodySchema.parse(request.body)

  const authenticateUseCase = makeAuthenticateUseCase()

  try {
    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })
    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )
    return reply.status(200).send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
