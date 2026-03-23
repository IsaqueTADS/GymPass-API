export class FailedUploadError extends Error {
  constructor() {
    super('Falha ao realizar o upload do arquivo')
  }
}
