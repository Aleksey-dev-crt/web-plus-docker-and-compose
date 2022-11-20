import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly emailSenderService: EmailSenderService,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto): Promise<Offer> {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);

    if (wish.raised + createOfferDto.amount > wish.price) {
      throw new BadRequestException('Сумма заявки больше чем осталось собрать');
    }
    if (user.id === wish.owner.id) {
      throw new BadRequestException('Нельзя скидываться на свои подарки');
    }

    await this.wishesService.update(wish.id, {
      raised: wish.raised + createOfferDto.amount,
    });
    const updatedWish = await this.wishesService.findOne(wish.id);
    const offeredUsers = [...new Set(updatedWish.offers.map((offer) => offer.user.email))];

    if (updatedWish.raised === wish.price) {
      await this.emailSenderService.sendEmail(wish, offeredUsers);
    }

    return this.offerRepository.save({
      ...createOfferDto,
      user,
      item: updatedWish,
    });
  }

  findAll(): Promise<Offer[]> {
    return this.offerRepository.find({
      relations: {
        item: true,
        user: true,
      },
    });
  }

  findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOne({
      relations: {
        item: true,
        user: true,
      },
      where: { id },
    });
  }
}
