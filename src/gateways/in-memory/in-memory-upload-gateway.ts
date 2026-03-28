import { randomUUID } from 'node:crypto'

import type {
  UploadFileDTO,
  UploadGateway,
  UploadGatewayResponse,
} from '../upload-gateway.js'

export class InMemoryUploadGateway implements UploadGateway {
  public uploads: any[] = []
  async sendUploadFile(data: UploadFileDTO): Promise<UploadGatewayResponse> {
    const publicId = `gympass-fake-${randomUUID()}`

    
    for await (const _chunk of data.file) {
      // apenas consumindo o stream
    }

    const response = {
      url: `http://fake-api.com/uploads/${publicId}.png`,
      public_id: publicId,
    }

   
    this.uploads.push({ ...data, ...response })

    return response
  }
}
