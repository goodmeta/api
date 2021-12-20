import { Entity, hasOne, model, property } from '@loopback/repository'
import { UserCredentials } from './user-credentials.model'
import { UserResetCredential } from './user-reset-credential.model'

@model({
  settings: {
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string

  @property({
    type: 'string',
    required: true,
  })
  name: string

  @property({
    type: 'string',
  })
  avatar?: string

  @property({
    type: 'number',
    required: true,
  })
  gid: number

  @property({
    type: 'string',
    required: true,
  })
  email: string

  @property({
    type: 'string',
  })
  phone?: string

  @property({
    type: 'string',
  })
  nonce?: string

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials

  @hasOne(() => UserResetCredential)
  userResetCredential?: UserResetCredential

  constructor(data?: Partial<User>) {
    super(data)
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations
