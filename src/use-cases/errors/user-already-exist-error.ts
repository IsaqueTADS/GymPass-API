export class UserAlreadyExistsError extends Error {
  constructor() {
    super('Email já está em uso')
  }
}
