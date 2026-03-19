import type { UploadGateway } from '../upload-gateway.js'

export class UploadClaudinaryGateway implements UploadGateway {
  sendUpload(file: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
