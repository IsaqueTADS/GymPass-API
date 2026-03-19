export interface UploadGateway {
  sendUpload(file: any): Promise<any>
}
