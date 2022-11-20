import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(owner: User, createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    const items = await this.wishesService.findMany({
      where: { id: In(createWishlistDto.itemsId) },
    });
    return this.wishlistRepository.save({
      ...createWishlistDto,
      owner,
      items,
    });
  }

  findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: {
        items: true,
        owner: true,
      },
    });
  }

  findOne(id: number): Promise<Wishlist> {
    return this.wishlistRepository.findOne({
      relations: {
        items: true,
        owner: true,
      },
      where: { id },
    });
  }

  update(id: number, wishlist: UpdateWishlistDto) {
    return this.wishlistRepository.update({ id }, wishlist);
  }

  remove(id: number) {
    return this.wishlistRepository.delete({ id });
  }
}
