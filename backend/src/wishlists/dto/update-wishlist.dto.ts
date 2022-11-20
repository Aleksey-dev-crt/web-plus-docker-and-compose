import { Wishlist } from '../entities/wishlist.entity';

export type UpdateWishlistDto = Omit<Wishlist, 'id' | 'createdAt' | 'updatedAt'>;
