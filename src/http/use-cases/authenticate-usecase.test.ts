import { hash } from 'argon2'
import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { AuthenticateUseCase } from './authenticate-usecase.js'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.js'

describe('Authenticate UseCase', () => {
  it('Deve ser possivel se autenticar', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()

    const sut = new AuthenticateUseCase(inMemoryUsersRepository)

    const password = '1234567'
    const email = 'teste@gmail.com'

    await inMemoryUsersRepository.create({
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
    const inMemoryUsersRepository = new InMemoryUsersRepository()

    const sut = new AuthenticateUseCase(inMemoryUsersRepository)

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
    const inMemoryUsersRepository = new InMemoryUsersRepository()

    const sut = new AuthenticateUseCase(inMemoryUsersRepository)

    const password = '1234567'
    const email = 'teste@gmail.com'

    await inMemoryUsersRepository.create({
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
