import { Readable } from 'node:stream'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUploadGateway } from '@/gateways/in-memory/in-memory-upload-gateway.js'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { InvalidFileTypeError } from './errors/Invalid-file-type-error.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { UploadImageGymUseCase } from './upload-image-gym-use-case.js'

let gymsRepository: InMemoryGymsRepository
let uploadGateway: InMemoryUploadGateway
let sut: UploadImageGymUseCase

describe('Upload Image Gym', async () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    uploadGateway = new InMemoryUploadGateway()
    sut = new UploadImageGymUseCase(gymsRepository, uploadGateway)
  })

  it('Deve ser possivel realizar upload de uma imagem para academia', async () => {
    const content = 'fake-image-binary-content'
    const fakeStream = Readable.from([Buffer.from(content)])
    const fileMock = {
      filename: 'gymImage.png',
      mimetype: 'image/png',
      file: fakeStream,
      encoding: '7bit',
    }

    const gymData = await gymsRepository.create({
      title: 'Os marambosos progamers',
      description: 'os mais  marambassss',
      phone: '',
      longitude: -16.8495227,
      latitude: -42.0612613,
    })

    const { gym, publicId } = await sut.execute({
      data: fileMock,
      gymId: gymData.id,
    })

    expect(gym.id).toEqual(gymData.id)
    expect(publicId).toBeDefined()

    expect(uploadGateway.uploads).toHaveLength(1)
    expect(uploadGateway.uploads[0].filename).toEqual('gymImage.png')
  })

  it("Não deve ser possivel fazer upload de arquivos que o tipo não seja permitido (['image/jpeg', 'image/jpg', 'image/png'])", async () => {
    const content = 'fake-image-binary-content'
    const fakeStream = Readable.from([Buffer.from(content)])
    const fileMock = {
      filename: 'gymImage2.png',
      mimetype: 'image/gif',
      file: fakeStream,
      encoding: '7bit',
    }

    const gymData = await gymsRepository.create({
      title: 'Os marambosos progamers',
      description: 'os mais  marambassss',
      phone: '',
      longitude: -16.8495227,
      latitude: -42.0612613,
    })

    await expect(() =>
      sut.execute({
        data: fileMock,
        gymId: gymData.id,
      }),
    ).rejects.toBeInstanceOf(InvalidFileTypeError)

    expect(uploadGateway.uploads).toHaveLength(0)
  })
  it('Não deve ser possivel fazer upload de imagem para academia que não existe', async () => {
    const content = 'fake-image-binary-content'
    const fakeStream = Readable.from([Buffer.from(content)])
    const fileMock = {
      filename: 'gymImage2.png',
      mimetype: 'image/gif',
      file: fakeStream,
      encoding: '7bit',
    }

    await expect(() =>
      sut.execute({
        data: fileMock,
        gymId: 'g9klpok´k~gijgh',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
    console.log(uploadGateway.uploads[0])
    expect(uploadGateway.uploads).toHaveLength(0)
  })
})
