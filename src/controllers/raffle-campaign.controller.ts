import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {RaffleCampaign} from '../models';
import {RaffleCampaignRepository} from '../repositories';

export class RaffleCampaignController {
  constructor(
    @repository(RaffleCampaignRepository)
    public raffleCampaignRepository : RaffleCampaignRepository,
  ) {}

  @post('/raffle-campaigns')
  @response(200, {
    description: 'RaffleCampaign model instance',
    content: {'application/json': {schema: getModelSchemaRef(RaffleCampaign)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RaffleCampaign, {
            title: 'NewRaffleCampaign',
            exclude: ['id'],
          }),
        },
      },
    })
    raffleCampaign: Omit<RaffleCampaign, 'id'>,
  ): Promise<RaffleCampaign> {
    return this.raffleCampaignRepository.create(raffleCampaign);
  }

  @get('/raffle-campaigns/count')
  @response(200, {
    description: 'RaffleCampaign model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RaffleCampaign) where?: Where<RaffleCampaign>,
  ): Promise<Count> {
    return this.raffleCampaignRepository.count(where);
  }

  @get('/raffle-campaigns')
  @response(200, {
    description: 'Array of RaffleCampaign model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RaffleCampaign, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RaffleCampaign) filter?: Filter<RaffleCampaign>,
  ): Promise<RaffleCampaign[]> {
    return this.raffleCampaignRepository.find(filter);
  }

  @patch('/raffle-campaigns')
  @response(200, {
    description: 'RaffleCampaign PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RaffleCampaign, {partial: true}),
        },
      },
    })
    raffleCampaign: RaffleCampaign,
    @param.where(RaffleCampaign) where?: Where<RaffleCampaign>,
  ): Promise<Count> {
    return this.raffleCampaignRepository.updateAll(raffleCampaign, where);
  }

  @get('/raffle-campaigns/{id}')
  @response(200, {
    description: 'RaffleCampaign model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RaffleCampaign, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(RaffleCampaign, {exclude: 'where'}) filter?: FilterExcludingWhere<RaffleCampaign>
  ): Promise<RaffleCampaign> {
    return this.raffleCampaignRepository.findById(id, filter);
  }

  @patch('/raffle-campaigns/{id}')
  @response(204, {
    description: 'RaffleCampaign PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RaffleCampaign, {partial: true}),
        },
      },
    })
    raffleCampaign: RaffleCampaign,
  ): Promise<void> {
    await this.raffleCampaignRepository.updateById(id, raffleCampaign);
  }

  @put('/raffle-campaigns/{id}')
  @response(204, {
    description: 'RaffleCampaign PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() raffleCampaign: RaffleCampaign,
  ): Promise<void> {
    await this.raffleCampaignRepository.replaceById(id, raffleCampaign);
  }

  @del('/raffle-campaigns/{id}')
  @response(204, {
    description: 'RaffleCampaign DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.raffleCampaignRepository.deleteById(id);
  }
}
