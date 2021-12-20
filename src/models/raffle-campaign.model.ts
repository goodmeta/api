import { Entity, model, property, belongsTo } from '@loopback/repository'
import { User } from './user.model'
import { Influencer } from './influencer.model'

@model()
export class RaffleCampaign extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string

  @property({
    type: 'string',
  })
  name?: string

  @property({
    type: 'string',
  })
  image?: string

  @property({
    type: 'string',
  })
  description?: string

  @property({
    type: 'number',
    required: true,
  })
  startAt: string

  @property({
    type: 'number',
    required: true,
  })
  endAt: string

  @property({
    type: 'number',
    required: true,
  })
  price: number

  @property({
    type: 'string',
    required: true,
  })
  paymentMethod: string

  @property({
    type: 'number',
    required: true,
  })
  walletQuantity: number

  @property({
    type: 'number',
    required: true,
  })
  totalTicket: number

  @property({
    type: 'number',
    required: true,
  })
  numberOfWinners: number

  @property({
    type: 'boolean',
    required: true,
  })
  status: boolean

  @property({
    type: 'boolean',
    required: true,
  })
  isFeature: boolean

  @belongsTo(() => User)
  userId: string

  @belongsTo(() => Influencer)
  influencerId: string

  constructor(data?: Partial<RaffleCampaign>) {
    super(data)
  }
}

export interface RaffleCampaignRelations {
  // describe navigational properties here
}

export type RaffleCampaignWithRelations = RaffleCampaign &
  RaffleCampaignRelations
