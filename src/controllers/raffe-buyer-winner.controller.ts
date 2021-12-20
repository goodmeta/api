import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository'
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
} from '@loopback/rest'
import { RaffleWinner } from '../models'
import { RaffleWinnerRepository } from '../repositories'

export class RaffeBuyerWinnerController {
  constructor(
    @repository(RaffleWinnerRepository)
    public raffleWinnerRepository: RaffleWinnerRepository,
  ) {}

  @post('/raffle-winners')
  @response(200, {
    description: 'RaffleWinner model instance',
    content: {
      'application/json': { schema: getModelSchemaRef(RaffleWinner) },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RaffleWinner, {
            title: 'NewRaffleWinner',
            exclude: ['id'],
          }),
        },
      },
    })
    raffleWinner: Omit<RaffleWinner, 'id'>,
  ): Promise<RaffleWinner> {
    return this.raffleWinnerRepository.create(raffleWinner)
  }

  @get('/raffle-winners/count')
  @response(200, {
    description: 'RaffleWinner model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(RaffleWinner) where?: Where<RaffleWinner>,
  ): Promise<Count> {
    return this.raffleWinnerRepository.count(where)
  }

  @get('/raffle-winners')
  @response(200, {
    description: 'Array of RaffleWinner model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RaffleWinner, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(RaffleWinner) filter?: Filter<RaffleWinner>,
  ): Promise<RaffleWinner[]> {
    return this.raffleWinnerRepository.find(filter)
  }

  @patch('/raffle-winners')
  @response(200, {
    description: 'RaffleWinner PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RaffleWinner, { partial: true }),
        },
      },
    })
    raffleWinner: RaffleWinner,
    @param.where(RaffleWinner) where?: Where<RaffleWinner>,
  ): Promise<Count> {
    return this.raffleWinnerRepository.updateAll(raffleWinner, where)
  }

  @get('/raffle-winners/{id}')
  @response(200, {
    description: 'RaffleWinner model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RaffleWinner, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(RaffleWinner, { exclude: 'where' })
    filter?: FilterExcludingWhere<RaffleWinner>,
  ): Promise<RaffleWinner> {
    return this.raffleWinnerRepository.findById(id, filter)
  }

  @patch('/raffle-winners/{id}')
  @response(204, {
    description: 'RaffleWinner PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RaffleWinner, { partial: true }),
        },
      },
    })
    raffleWinner: RaffleWinner,
  ): Promise<void> {
    await this.raffleWinnerRepository.updateById(id, raffleWinner)
  }

  @put('/raffle-winners/{id}')
  @response(204, {
    description: 'RaffleWinner PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() raffleWinner: RaffleWinner,
  ): Promise<void> {
    await this.raffleWinnerRepository.replaceById(id, raffleWinner)
  }

  @del('/raffle-winners/{id}')
  @response(204, {
    description: 'RaffleWinner DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.raffleWinnerRepository.deleteById(id)
  }
}
