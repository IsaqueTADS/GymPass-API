export class LateValidationCheckInsError extends Error {
  constructor() {
    super(
      'Não foi possível validar o check-in, pois já se passaram mais de 20 minutos desde a sua criação.',
    )
  }
}
