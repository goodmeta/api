import { repository } from '@loopback/repository'
import { param, get, getModelSchemaRef } from '@loopback/rest'
import { Wallet, User } from '../models'
import { WalletRepository } from '../repositories'

export class WalletUserController {
  constructor(
    @repository(WalletRepository)
    public walletRepository: WalletRepository,
  ) {}

  @get('/wallets/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Wallet',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(User) },
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Wallet.prototype.id,
  ): Promise<User> {
    return this.walletRepository.user(id)
  }
}
