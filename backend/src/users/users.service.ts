import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UsernameOrEmailDto } from './dto/username-email.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    try {
      const hash = await bcrypt.hash(user.password, 10);
      const createdUser = this.userRepository.create({
        ...user,
        password: hash,
      });
      return await this.userRepository.save(createdUser);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findMany({ query }: UsernameOrEmailDto): Promise<User[]> {
    const users = this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
    return users;
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  findByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  update(id: number, user: UpdateUserDto) {
    return this.userRepository.update({ id }, user);
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
