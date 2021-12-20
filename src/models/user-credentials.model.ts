import { Entity, model, property } from '@loopback/repository'

@model()
export class UserCredentials extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  password: string

  @property({
    type: 'string',
    required: true,
  })
  userId: string

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string

  constructor(data?: Partial<UserCredentials>) {
    super(data)
  }
}

export interface UserCredentialsRelations {
  // describe navigational properties here
}

export type UserCredentialsWithRelations = UserCredentials &
  UserCredentialsRelations