import type { FastifyReply, FastifyRequest } from 'fastify'
import { FailedUploadError } from '@/use-cases/errors/failed-upload-error.js'
import { InvalidFileTypeError } from '@/use-cases/errors/Invalid-file-type-error.js'
import { makeUpdateUserAvatar } from '@/use-cases/factories/make-update-user-avatar-use-case.js'
import { handleSingleUpload } from '../utils/upload-handler.js'

export async function uploadUserAvatarController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateUserAvatarUseCase = makeUpdateUserAvatar()
  const data = await request.file()
  const userId = request.user.sub

  try {
    const fileUpload = await handleSingleUpload(data)
    const result = await updateUserAvatarUseCase.execute({
      userId,
      data: fileUpload,
    })

    return reply.status(201).send({ ...result.user, password_hash: undefined })
  } catch (err) {
    if (err instanceof FailedUploadError) {
      return reply.status(400).send({ message: err.message })
    }
    if (err instanceof InvalidFileTypeError) {
      return reply.status(415).send({ message: err.message })
    }

    throw err
  }
}
