import { Model, model, property } from '@loopback/repository'

@model()
export class EmailTemplate extends Model {
  @property({
    type: 'string',
  })
  from: 'no_reply@shilly.io'

  @property({
    type: 'string',
    required: true,
  })
  to: string

  @property({
    type: 'string',
    required: true,
  })
  subject: string

  @property({
    type: 'string',
    required: true,
  })
  html: string

  @property({
    type: 'string',
    required: true,
  })
  text: string

  constructor(data?: Partial<EmailTemplate>) {
    super(data)
  }
}

export interface EmailTemplateRelations {
  // describe navigational properties here
}

export type EmailTemplateWithRelations = EmailTemplate & EmailTemplateRelations
