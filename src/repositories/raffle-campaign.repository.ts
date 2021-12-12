import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {RaffleCampaign, RaffleCampaignRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class RaffleCampaignRepository extends DefaultCrudRepository<
  RaffleCampaign,
  typeof RaffleCampaign.prototype.id,
  RaffleCampaignRelations
> {

  public readonly user: BelongsToAccessor<User, typeof RaffleCampaign.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(RaffleCampaign, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
