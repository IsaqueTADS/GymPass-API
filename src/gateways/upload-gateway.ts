import type { MultipartFile } from '@fastify/multipart'

export type UploadGatewayResponse = {
  url: string
  public_id?: string
}
export interface UploadGateway {
  sendUploadFile(data: MultipartFile): Promise<UploadGatewayResponse>
}
