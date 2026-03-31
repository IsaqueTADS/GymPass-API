import type { Readable } from 'node:stream'
import { createGympassFileName } from '@/utils/create-gympass-file-name.js'

export interface UploadFileDTO {
  file: Readable
  filename: string
  mimetype: string
  encoding: string
}

export type Folder = 'profiles' | 'gyms_images'

export type GympassFileName = `gympass-${string}--${string}-${string}`

export interface UploadGatewayResponse {
  url: string
  public_id?: string
}

export interface UploadGateway {
  /**
   * @param fileName - O nome formatado do arquivo.
   * **Importante:** Deve seguir o padrão `gympass-{id}--{uuid}-{data}`.
   * Utilize {@link createGympassFileName} para gerar este valor.
   */
  sendUploadFile(
    data: UploadFileDTO,
    fileName: GympassFileName,
    folder?: Folder,
  ): Promise<UploadGatewayResponse>
}
