export class InvalidFileTypeError extends Error {
  constructor() {
    super("Formato de arquivo não permitido. Use apenas: .jpg, .jpeg ou .png'")
  }
}
