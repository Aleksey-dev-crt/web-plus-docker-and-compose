import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  create(owner: User, createWishDto: CreateWishDto): Promise<Wish> {
    return this.wishRepository.save({
      ...createWishDto,
      owner,
    });
  }

  findLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  findTop(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 20,
      order: { copied: 'DESC' },
    });
  }

  findOne(id: number): Promise<Wish> {
    return this.wishRepository.findOne({
      relations: {
        owner: { wishes: true, wishlists: true, offers: true },
        offers: { user: true },
      },
      where: { id },
    });
  }

  findMany(ids: FindManyOptions<Wish>): Promise<Wish[]> {
    return this.wishRepository.find(ids);
  }

  findUserWishes(id: number): Promise<Wish[]> {
    return this.wishRepository.find({
      where: { owner: { id } },
    });
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return this.wishRepository.update(id, updateWishDto);
  }

  remove(id: number) {
    return this.wishRepository.delete({ id });
  }
}
