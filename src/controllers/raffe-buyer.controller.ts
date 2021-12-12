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
import {RaffleBuyer} from '../models';
import {RaffleBuyerRepository} from '../repositories';

export class RaffeBuyerController {
  constructor(
    @repository(RaffleBuyerRepository)
    public raffleBuyerRepository : RaffleBuyerRepository,
  ) {}

  @post('/raffle-buyers')
  @response(200, {
    description: 'RaffleBuyer model instance',
    content: {'application/json': {schema: getModelSchemaRef(RaffleBuyer)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RaffleBuyer, {
            title: 'NewRaffleBuyer',
            exclude: ['id'],
          }),
        },
      },
    })
    raffleBuyer: Omit<RaffleBuyer, 'id'>,
  ): Promise<RaffleBuyer> {
    return this.raffleBuyerRepository.create(raffleBuyer);
  }

  @get('/raffle-buyers/count')
  @response(200, {
    description: 'RaffleBuyer model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RaffleBuyer) where?: Where<RaffleBuyer>,
  ): Promise<Count> {
    return this.raffleBuyerRepository.count(where);
  }

  @get('/raffle-buyers')
  @response(200, {
    description: 'Array of RaffleBuyer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RaffleBuyer, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RaffleBuyer) filter?: Filter<RaffleBuyer>,
  ): Promise<RaffleBuyer[]> {
    return this.raffleBuyerRepository.find(filter);
  }

  @patch('/raffle-buyers')
  @response(200, {
    description: 'RaffleBuyer PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RaffleBuyer, {partial: true}),
        },
      },
    })
    raffleBuyer: RaffleBuyer,
    @param.where(RaffleBuyer) where?: Where<RaffleBuyer>,
  ): Promise<Count> {
    return this.raffleBuyerRepository.updateAll(raffleBuyer, where);
  }

  @get('/raffle-buyers/{id}')
  @response(200, {
    description: 'RaffleBuyer model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RaffleBuyer, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(RaffleBuyer, {exclude: 'where'}) filter?: FilterExcludingWhere<RaffleBuyer>
  ): Promise<RaffleBuyer> {
    return this.raffleBuyerRepository.findById(id, filter);
  }

  @patch('/raffle-buyers/{id}')
  @response(204, {
    description: 'RaffleBuyer PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RaffleBuyer, {partial: true}),
        },
      },
    })
    raffleBuyer: RaffleBuyer,
  ): Promise<void> {
    await this.raffleBuyerRepository.updateById(id, raffleBuyer);
  }

  @put('/raffle-buyers/{id}')
  @response(204, {
    description: 'RaffleBuyer PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() raffleBuyer: RaffleBuyer,
  ): Promise<void> {
    await this.raffleBuyerRepository.replaceById(id, raffleBuyer);
  }

  @del('/raffle-buyers/{id}')
  @response(204, {
    description: 'RaffleBuyer DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.raffleBuyerRepository.deleteById(id);
  }
}
