import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {RaffleWinner, RaffleWinnerRelations, User, RaffleCampaign} from '../models';
import {UserRepository} from './user.repository';
import {RaffleCampaignRepository} from './raffle-campaign.repository';

export class RaffleWinnerRepository extends DefaultCrudRepository<
  RaffleWinner,
  typeof RaffleWinner.prototype.id,
  RaffleWinnerRelations
> {

  public readonly user: BelongsToAccessor<User, typeof RaffleWinner.prototype.id>;

  public readonly raffleCampaign: BelongsToAccessor<RaffleCampaign, typeof RaffleWinner.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('RaffleCampaignRepository') protected raffleCampaignRepositoryGetter: Getter<RaffleCampaignRepository>,
  ) {
    super(RaffleWinner, dataSource);
    this.raffleCampaign = this.createBelongsToAccessorFor('raffleCampaign', raffleCampaignRepositoryGetter,);
    this.registerInclusionResolver('raffleCampaign', this.raffleCampaign.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
