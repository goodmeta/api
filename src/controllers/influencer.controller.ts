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
import {Influencer} from '../models';
import {InfluencerRepository} from '../repositories';

export class InfluencerController {
  constructor(
    @repository(InfluencerRepository)
    public influencerRepository : InfluencerRepository,
  ) {}

  @post('/influencers')
  @response(200, {
    description: 'Influencer model instance',
    content: {'application/json': {schema: getModelSchemaRef(Influencer)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Influencer, {
            title: 'NewInfluencer',
            exclude: ['id'],
          }),
        },
      },
    })
    influencer: Omit<Influencer, 'id'>,
  ): Promise<Influencer> {
    return this.influencerRepository.create(influencer);
  }

  @get('/influencers/count')
  @response(200, {
    description: 'Influencer model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Influencer) where?: Where<Influencer>,
  ): Promise<Count> {
    return this.influencerRepository.count(where);
  }

  @get('/influencers')
  @response(200, {
    description: 'Array of Influencer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Influencer, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Influencer) filter?: Filter<Influencer>,
  ): Promise<Influencer[]> {
    return this.influencerRepository.find(filter);
  }

  @patch('/influencers')
  @response(200, {
    description: 'Influencer PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Influencer, {partial: true}),
        },
      },
    })
    influencer: Influencer,
    @param.where(Influencer) where?: Where<Influencer>,
  ): Promise<Count> {
    return this.influencerRepository.updateAll(influencer, where);
  }

  @get('/influencers/{id}')
  @response(200, {
    description: 'Influencer model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Influencer, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Influencer, {exclude: 'where'}) filter?: FilterExcludingWhere<Influencer>
  ): Promise<Influencer> {
    return this.influencerRepository.findById(id, filter);
  }

  @patch('/influencers/{id}')
  @response(204, {
    description: 'Influencer PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Influencer, {partial: true}),
        },
      },
    })
    influencer: Influencer,
  ): Promise<void> {
    await this.influencerRepository.updateById(id, influencer);
  }

  @put('/influencers/{id}')
  @response(204, {
    description: 'Influencer PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() influencer: Influencer,
  ): Promise<void> {
    await this.influencerRepository.replaceById(id, influencer);
  }

  @del('/influencers/{id}')
  @response(204, {
    description: 'Influencer DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.influencerRepository.deleteById(id);
  }
}
