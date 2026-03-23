import type { MultipartFile } from '@fastify/multipart'
import type { UploadFileDTO } from '@/gateways/upload-gateway.js'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js'

export async function handleMultipleUploads(
  parts: AsyncIterableIterator<MultipartFile>,
): Promise<UploadFileDTO[]> {
  const files: UploadFileDTO[] = []

  for await (const part of parts) {
    if (part.file) {
      files.push(toUploadFile(part))
    }
  }
  return files
}

export async function handleSingleUpload(
  part: MultipartFile | undefined,
): Promise<UploadFileDTO> {
  if (!part || !part.file) {
    throw new ResourceNotFoundError()
  }

  return toUploadFile(part)
}

function toUploadFile(part: MultipartFile): UploadFileDTO {
  return {
    file: part.file,
    filename: part.filename,
    mimetype: part.mimetype,
    encoding: part.encoding,
  }
}
