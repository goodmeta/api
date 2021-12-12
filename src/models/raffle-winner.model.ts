import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {RaffleCampaign} from './raffle-campaign.model';

@model()
export class RaffleWinner extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => User)
  userId: string;

  @belongsTo(() => RaffleCampaign)
  raffleCampaignId: string;

  constructor(data?: Partial<RaffleWinner>) {
    super(data);
  }
}

export interface RaffleWinnerRelations {
  // describe navigational properties here
}

export type RaffleWinnerWithRelations = RaffleWinner & RaffleWinnerRelations;
