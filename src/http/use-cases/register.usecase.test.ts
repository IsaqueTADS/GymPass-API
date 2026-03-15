import { verify } from 'argon2'
import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { UserAlreadyExistsError } from './errors/user-already-exist-error.js'
import { RegisterUseCase } from './register-usecase.js'

describe('Register UseCase', () => {
  it('A senha do usuário precisa estar criptografada', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()

    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository)

    const password = '1234567'

    const { user } = await registerUseCase.execute({
      name: 'Testador',
      email: 'teste@gmail.com',
      password,
    })

    const isPasswordHashValid = await verify(user.password_hash, password)

    expect(isPasswordHashValid).toBe(true)
  })

  it('O usuário não deve se cadastrar como um e-mail duplicado', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()

    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository)

    const password = '1234567'
    const email = 'teste@gmail.com'
    const name = 'Testador'

    await registerUseCase.execute({
      name,
      email,
      password,
    })

    await expect(() =>
      registerUseCase.execute({
        name,
        email,
        password,
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
  it('Deve ser possivel se cadastrar', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()

    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository)

    const password = '1234567'
    const email = 'teste@gmail.com'

    const { user } = await registerUseCase.execute({
      name: 'Testador',
      email,
      password,
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
