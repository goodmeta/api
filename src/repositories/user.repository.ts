import { Getter, inject } from '@loopback/core'
import {
  DefaultCrudRepository,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository'
import { DbDataSource } from '../datasources'
import {
  User,
  UserCredentials,
  UserRelations,
  UserResetCredential,
} from '../models'
import { UserCredentialsRepository } from './user-credentials.repository'
import { UserResetCredentialRepository } from './user-reset-credential.repository'

export type Credentials = {
  email: string
  password: string
}

export type WalletCredentials = {
  publicAddress: string
  signature: string
}

export type WalletInformation = {
  publicAddress: string
}

export type WalletConnect = {
  publicAddress: string
  nonce: string
}

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >
  public readonly userResetCredential: HasOneRepositoryFactory<
    UserResetCredential,
    typeof User.prototype.id
  >

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialRepositoryGetter: Getter<UserResetCredentialRepository>,
  ) {
    super(User, dataSource)

    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    )
    this.userResetCredential = this.createHasOneRepositoryFactoryFor(
      'userResetCredential',
      userCredentialRepositoryGetter,
    )
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get()
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined
      }
      throw err
    }
  }

  async findResetCredential(
    userId: typeof User.prototype.id,
  ): Promise<UserResetCredential | undefined> {
    try {
      return await this.userResetCredential(userId).get()
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined
      }
      throw err
    }
  }
}
