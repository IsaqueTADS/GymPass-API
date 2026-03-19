import type { MultipartFile } from '@fastify/multipart'
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'
import { env } from '@/env/index.js'
import type { UploadGateway, UploadGatewayResponse } from '../upload-gateway.js'

export class UploadClaudinaryGateway implements UploadGateway {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_NAME,
      api_key: env.CLOUDINARY_KEY,
      api_secret: env.CLOUDINARY_SECRET,
    })
  }
  async sendUploadFile(data: MultipartFile): Promise<UploadGatewayResponse> {
    const uploadToCloudinary = () => {
      return new Promise((resolve, rejects) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'gympass_api' },
          (error, result) => {
            if (error) rejects(new Error('Não foi possivel realizar o upload'))
            else resolve(result)
          },
        )
        // "Pipar" o arquivo recebido para o stream do Cloudinary
        data.file.pipe(stream)
      })
    }

    const result = (await uploadToCloudinary()) as UploadApiResponse

    return {
      url: result.url,
      public_id: result.public_id,
    }
  }
}
