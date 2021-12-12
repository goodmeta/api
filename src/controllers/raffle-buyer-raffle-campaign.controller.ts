import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  RaffleBuyer,
  RaffleCampaign,
} from '../models';
import {RaffleBuyerRepository} from '../repositories';

export class RaffleBuyerRaffleCampaignController {
  constructor(
    @repository(RaffleBuyerRepository)
    public raffleBuyerRepository: RaffleBuyerRepository,
  ) { }

  @get('/raffle-buyers/{id}/raffle-campaign', {
    responses: {
      '200': {
        description: 'RaffleCampaign belonging to RaffleBuyer',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(RaffleCampaign)},
          },
        },
      },
    },
  })
  async getRaffleCampaign(
    @param.path.string('id') id: typeof RaffleBuyer.prototype.id,
  ): Promise<RaffleCampaign> {
    return this.raffleBuyerRepository.raffleCampaign(id);
  }
}
