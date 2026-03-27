import type { FastifyReply, FastifyRequest } from 'fastify'
import { ValidateCheckInParamsSchema } from '@/http/schemas/check-ins-schema.js'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case.js'

export async function validateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { checkInId } = ValidateCheckInParamsSchema.parse(request.body)

  const validateCheckInUseCase = makeValidateCheckInUseCase()

  const { checkIn } = await validateCheckInUseCase.execute({
    checkId: checkInId,
  })

  return reply.status(200).send({ checkIn })
}
