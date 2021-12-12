import {Entity, model, property} from '@loopback/repository';

@model()
export class Influencer extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  image: string;

  @property({
    type: 'string',
  })
  website?: string;

  @property({
    type: 'string',
  })
  twitter?: string;

  @property({
    type: 'string',
  })
  instagram?: string;

  @property({
    type: 'string',
  })
  facebook?: string;

  @property({
    type: 'string',
  })
  tiktok?: string;

  @property({
    type: 'string',
  })
  telegram?: string;

  @property({
    type: 'string',
  })
  youtube?: string;


  constructor(data?: Partial<Influencer>) {
    super(data);
  }
}

export interface InfluencerRelations {
  // describe navigational properties here
}

export type InfluencerWithRelations = Influencer & InfluencerRelations;
