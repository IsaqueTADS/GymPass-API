import type { FastifyReply, FastifyRequest } from 'fastify'
import { RegisterBodySchema } from '@/http/schemas/auth-schema.js'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case.js'
import { UserAlreadyExistsError } from '../../../use-cases/errors/user-already-exist-error.js'

export async function resgisterController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { name, email, password } = RegisterBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

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

  return reply.status(201).send()
}
