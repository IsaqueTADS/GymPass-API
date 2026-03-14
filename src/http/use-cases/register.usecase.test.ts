import { verify } from 'argon2'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register-usecase.js'

describe('Register UseCase', () => {
  it('A senha do usuário precisa estar criptografada', async () => {
    const registerUseCase = new RegisterUseCase({
      async findByEmail(_email) {
        return null
      },
      async create(data) {
        return {
          id: 'gbytjfdaskhjdapHJDPai',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
      },
    })

    const password = '1234567'

    const { user } = await registerUseCase.execute({
      name: 'Testador',
      email: 'teste@gmail.com',
      password,
    })

    const isPasswordHashValid = await verify(user.password_hash, password)

    expect(isPasswordHashValid).toBe(true)
  })
})
