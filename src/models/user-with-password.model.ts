import { model, property } from '@loopback/repository'
import { User } from './user.model'

@model()
export class UserWithPassword extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string

  constructor(data?: Partial<UserWithPassword>) {
    super(data)
  }
}

export interface UserWithPasswordRelations {
  // describe navigational properties here
}

export type UserWithPasswordWithRelations = UserWithPassword &
  UserWithPasswordRelations
