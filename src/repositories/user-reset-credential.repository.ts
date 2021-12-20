import { inject, Getter } from '@loopback/core'
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository'
import { DbDataSource } from '../datasources'
import {
  UserResetCredential,
  UserResetCredentialRelations,
  User,
} from '../models'
import { UserRepository } from './user.repository'

export class UserResetCredentialRepository extends DefaultCrudRepository<
  UserResetCredential,
  typeof UserResetCredential.prototype.id,
  UserResetCredentialRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof UserResetCredential.prototype.id
  >

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(UserResetCredential, dataSource)
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter)
    this.registerInclusionResolver('user', this.user.inclusionResolver)
  }
}
