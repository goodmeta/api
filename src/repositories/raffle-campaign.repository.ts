import { inject, Getter } from '@loopback/core'
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository'
import { DbDataSource } from '../datasources'
import {
  RaffleCampaign,
  RaffleCampaignRelations,
  User,
  Influencer,
} from '../models'
import { UserRepository } from './user.repository'
import { InfluencerRepository } from './influencer.repository'

export class RaffleCampaignRepository extends DefaultCrudRepository<
  RaffleCampaign,
  typeof RaffleCampaign.prototype.id,
  RaffleCampaignRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof RaffleCampaign.prototype.id
  >

  public readonly influencer: BelongsToAccessor<
    Influencer,
    typeof RaffleCampaign.prototype.id
  >

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('InfluencerRepository')
    protected influencerRepositoryGetter: Getter<InfluencerRepository>,
  ) {
    super(RaffleCampaign, dataSource)
    this.influencer = this.createBelongsToAccessorFor(
      'influencer',
      influencerRepositoryGetter,
    )
    this.registerInclusionResolver(
      'influencer',
      this.influencer.inclusionResolver,
    )
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter)
    this.registerInclusionResolver('user', this.user.inclusionResolver)
  }
}
