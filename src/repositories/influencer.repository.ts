import { inject } from '@loopback/core'
import { DefaultCrudRepository } from '@loopback/repository'
import { DbDataSource } from '../datasources'
import { Influencer, InfluencerRelations } from '../models'

export class InfluencerRepository extends DefaultCrudRepository<
  Influencer,
  typeof Influencer.prototype.id,
  InfluencerRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Influencer, dataSource)
  }
}
