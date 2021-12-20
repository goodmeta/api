import { repository } from '@loopback/repository'
import { param, get, getModelSchemaRef } from '@loopback/rest'
import { RaffleBuyer, User } from '../models'
import { RaffleBuyerRepository } from '../repositories'

export class RaffleBuyerUserController {
  constructor(
    @repository(RaffleBuyerRepository)
    public raffleBuyerRepository: RaffleBuyerRepository,
  ) {}

  @get('/raffle-buyers/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to RaffleBuyer',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(User) },
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof RaffleBuyer.prototype.id,
  ): Promise<User> {
    return this.raffleBuyerRepository.user(id)
  }
}
