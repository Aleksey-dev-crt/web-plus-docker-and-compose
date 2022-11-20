import { Offer } from '../entities/offer.entity';

export type UpdateOfferDto = Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>;
