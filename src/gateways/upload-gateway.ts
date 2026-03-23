import type { Readable } from 'node:stream'

export interface UploadFileDTO {
  file: Readable
  filename: string
  mimetype: string
  encoding: string
}
export interface UploadGatewayResponse {
  url: string
  public_id?: string
}
export interface UploadGateway {
  sendUploadFile(data: UploadFileDTO): Promise<UploadGatewayResponse>
}
