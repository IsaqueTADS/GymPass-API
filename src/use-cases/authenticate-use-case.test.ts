import { hash } from 'argon2'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { AuthenticateUseCase } from './authenticate-use-case.js'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.js'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })
  it('Deve ser possivel se autenticar', async () => {
    const password = '1234567'
    const email = 'teste@gmail.com'

    await usersRepository.create({
      name: 'Testador',
      email,
      password_hash: await hash(password),
    })

    const { user } = await sut.execute({
      email,
      password,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('Não deve ser possivel autenticar com email inválido', async () => {
    const password = '1234567'
    const email = 'teste@gmail.com'

    await expect(() =>
      sut.execute({
        email,
        password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Não deve ser possivel autenticar com senha inválida', async () => {
    const password = '1234567'
    const email = 'teste@gmail.com'

    await usersRepository.create({
      name: 'Testador',
      email,
      password_hash: await hash(password),
    })

    await expect(() =>
      sut.execute({
        email,
        password: 'pçhblsiuatgf9',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
