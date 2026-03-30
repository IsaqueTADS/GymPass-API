import type { FastifyReply, FastifyRequest } from 'fastify'
import { ValidateCheckInParamsSchema } from '@/http/schemas/check-ins-schema.js'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case.js'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js'
import { LateValidationCheckInsError } from '@/use-cases/errors/late-validation-check-ins-error.js'

export async function validateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { checkInId } = ValidateCheckInParamsSchema.parse(request.params)

  const validateCheckInUseCase = makeValidateCheckInUseCase()

  try{
    const { checkIn } = await validateCheckInUseCase.execute({
    checkId: checkInId,
  })

  return reply.status(200).send({ checkIn })
    
  }catch(err){
    if(err instanceof ResourceNotFoundError ){
       return reply.status(404).send({ message: err.message })
    }
    if( err instanceof LateValidationCheckInsError ){
        return reply.status(400).send({ message: err.message })
    }
    throw err
  }

}
