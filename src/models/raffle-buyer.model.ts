import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {RaffleCampaign} from './raffle-campaign.model';

@model()
export class RaffleBuyer extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @belongsTo(() => User)
  userId: string;

  @belongsTo(() => RaffleCampaign)
  raffleCampaignId: string;

  constructor(data?: Partial<RaffleBuyer>) {
    super(data);
  }
}

export interface RaffleBuyerRelations {
  // describe navigational properties here
}

export type RaffleBuyerWithRelations = RaffleBuyer & RaffleBuyerRelations;
