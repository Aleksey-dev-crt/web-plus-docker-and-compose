import { Wish } from '../entities/wish.entity';

export type CreateWishDto = Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>;
