export interface UploadGateway {
  sendUploadFile(file: any): Promise<any>
}
