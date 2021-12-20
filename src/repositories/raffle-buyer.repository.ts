import { inject, Getter } from '@loopback/core'
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository'
import { DbDataSource } from '../datasources'
import {
  RaffleBuyer,
  RaffleBuyerRelations,
  User,
  RaffleCampaign,
} from '../models'
import { UserRepository } from './user.repository'
import { RaffleCampaignRepository } from './raffle-campaign.repository'

export class RaffleBuyerRepository extends DefaultCrudRepository<
  RaffleBuyer,
  typeof RaffleBuyer.prototype.id,
  RaffleBuyerRelations
> {
  public readonly user: BelongsToAccessor<User, typeof RaffleBuyer.prototype.id>

  public readonly raffleCampaign: BelongsToAccessor<
    RaffleCampaign,
    typeof RaffleBuyer.prototype.id
  >

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('RaffleCampaignRepository')
    protected raffleCampaignRepositoryGetter: Getter<RaffleCampaignRepository>,
  ) {
    super(RaffleBuyer, dataSource)
    this.raffleCampaign = this.createBelongsToAccessorFor(
      'raffleCampaign',
      raffleCampaignRepositoryGetter,
    )
    this.registerInclusionResolver(
      'raffleCampaign',
      this.raffleCampaign.inclusionResolver,
    )
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter)
    this.registerInclusionResolver('user', this.user.inclusionResolver)
  }
}
