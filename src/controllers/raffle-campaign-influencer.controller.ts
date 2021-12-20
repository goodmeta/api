import { repository } from '@loopback/repository'
import { param, get, getModelSchemaRef } from '@loopback/rest'
import { RaffleCampaign, Influencer } from '../models'
import { RaffleCampaignRepository } from '../repositories'

export class RaffleCampaignInfluencerController {
  constructor(
    @repository(RaffleCampaignRepository)
    public raffleCampaignRepository: RaffleCampaignRepository,
  ) {}

  @get('/raffle-campaigns/{id}/influencer', {
    responses: {
      '200': {
        description: 'Influencer belonging to RaffleCampaign',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Influencer) },
          },
        },
      },
    },
  })
  async getInfluencer(
    @param.path.string('id') id: typeof RaffleCampaign.prototype.id,
  ): Promise<Influencer> {
    return this.raffleCampaignRepository.influencer(id)
  }
}
