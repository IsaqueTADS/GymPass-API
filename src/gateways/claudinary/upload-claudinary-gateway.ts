import { v2 as cloudinary } from 'cloudinary'
import { env } from '@/env/index.js'
import type { UploadGateway } from '../upload-gateway.js'

export class UploadClaudinaryGateway implements UploadGateway {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_NAME,
      api_key: env.CLOUDINARY_KEY,
      api_secret: env.CLOUDINARY_SECRET,
    })
  }
  sendUploadFile(data: ): Promise<any> {
    const uploadToCloudinary = () => {
      return new Promise((resolve, rejects) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'gympass_api' },
          (error, result) => {
            if (error) rejects(error)
            else resolve(result)
          },
        )
      })
    }
  }
}
