import { belongsTo, Entity, model, property } from '@loopback/repository'
import { User } from './user.model'

@model()
export class UserResetCredential extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string
  @property({
    type: 'string',
  })
  resetKey?: string

  @property({
    type: 'number',
  })
  resetCount: number

  @property({
    type: 'string',
  })
  resetTimestamp: string

  @property({
    type: 'string',
  })
  resetKeyTimestamp: string

  @belongsTo(() => User)
  userId: string

  constructor(data?: Partial<UserResetCredential>) {
    super(data)
  }
}

export interface UserResetCredentialRelations {
  // describe navigational properties here
}

export type UserResetCredentialWithRelations = UserResetCredential &
  UserResetCredential
