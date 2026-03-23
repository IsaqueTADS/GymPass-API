import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'
import { env } from '@/env/index.js'
import type {
  UploadFileDTO,
  UploadGateway,
  UploadGatewayResponse,
} from '../upload-gateway.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log(__filename)
console.log(__dirname)

export class InMemoryUploadGateway implements UploadGateway {
  async sendUploadFile(data: UploadFileDTO): Promise<UploadGatewayResponse> {
    const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads')
    const publicId = `gympass-${new Date().toISOString().replace(/:/g, '-')}-${randomUUID()}`
    const fileName = `${publicId}}.${data.mimetype.split('/')[1]}`
    const pathComplete = path.join(uploadDir, fileName)
    const url = `${env.API_URL}/uploads/${fileName}`

    fs.mkdirSync(uploadDir, { recursive: true })

    await pipeline(data.file, fs.createWriteStream(pathComplete))

    return {
      url,
      public_id: publicId,
    }
  }
}
