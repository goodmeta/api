import { repository } from '@loopback/repository'
import { param, get, getModelSchemaRef } from '@loopback/rest'
import { RaffleWinner, User } from '../models'
import { RaffleWinnerRepository } from '../repositories'

export class RaffleWinnerUserController {
  constructor(
    @repository(RaffleWinnerRepository)
    public raffleWinnerRepository: RaffleWinnerRepository,
  ) {}

  @get('/raffle-winners/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to RaffleWinner',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(User) },
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof RaffleWinner.prototype.id,
  ): Promise<User> {
    return this.raffleWinnerRepository.user(id)
  }
}
