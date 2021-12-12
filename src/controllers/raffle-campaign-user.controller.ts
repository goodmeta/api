import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  RaffleCampaign,
  User,
} from '../models';
import {RaffleCampaignRepository} from '../repositories';

export class RaffleCampaignUserController {
  constructor(
    @repository(RaffleCampaignRepository)
    public raffleCampaignRepository: RaffleCampaignRepository,
  ) { }

  @get('/raffle-campaigns/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to RaffleCampaign',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof RaffleCampaign.prototype.id,
  ): Promise<User> {
    return this.raffleCampaignRepository.user(id);
  }
}
