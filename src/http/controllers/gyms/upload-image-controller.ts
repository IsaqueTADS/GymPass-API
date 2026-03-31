import type { FastifyReply, FastifyRequest } from 'fastify'
import { UploadImageParamsSchema } from '@/http/schemas/gyms-schema.js'
import { handleSingleUpload } from '@/http/utils/upload-handler.js'
import { FailedUploadError } from '@/use-cases/errors/failed-upload-error.js'
import { InvalidFileTypeError } from '@/use-cases/errors/Invalid-file-type-error.js'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js'
import { makeUploadImageGymUseCase } from '@/use-cases/factories/make-upload-image-gym-use-case.js'

export async function uploadImageController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { gymId } = UploadImageParamsSchema.parse(request.params)
  const file = await request.file()

  try {
    const data = await handleSingleUpload(file)
    const uploadImageGymUseCase = makeUploadImageGymUseCase()

    const { gym } = await uploadImageGymUseCase.execute({ data, gymId })

    return reply.status(200).send({ gym })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof InvalidFileTypeError) {
      return reply.status(415).send({ message: err.message })
    }
    if (err instanceof FailedUploadError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
