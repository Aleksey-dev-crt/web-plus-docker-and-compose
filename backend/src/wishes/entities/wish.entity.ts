import { IsUrl, Length, IsOptional } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl(undefined, { message: 'URL is not valid.' })
  link: string;

  @Column()
  @IsUrl(undefined, { message: 'URL is not valid.' })
  image: string;

  @Column({
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({
    scale: 2,
    default: 0,
    nullable: true,
  })
  @IsOptional()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column({
    default: 0,
    nullable: true,
  })
  @IsOptional()
  copied: number;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
