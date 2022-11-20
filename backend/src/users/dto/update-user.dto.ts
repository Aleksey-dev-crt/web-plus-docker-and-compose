import { User } from '../entities/user.entity';

export type UpdateUserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
