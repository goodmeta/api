import { repository } from '@loopback/repository'
import { param, get, getModelSchemaRef } from '@loopback/rest'
import { RaffleWinner, RaffleCampaign } from '../models'
import { RaffleWinnerRepository } from '../repositories'

export class RaffleWinnerRaffleCampaignController {
  constructor(
    @repository(RaffleWinnerRepository)
    public raffleWinnerRepository: RaffleWinnerRepository,
  ) {}

  @get('/raffle-winners/{id}/raffle-campaign', {
    responses: {
      '200': {
        description: 'RaffleCampaign belonging to RaffleWinner',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(RaffleCampaign) },
          },
        },
      },
    },
  })
  async getRaffleCampaign(
    @param.path.string('id') id: typeof RaffleWinner.prototype.id,
  ): Promise<RaffleCampaign> {
    return this.raffleWinnerRepository.raffleCampaign(id)
  }
}
