import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/service/jwt-auth.guard';
import { UsernameOrEmailDto } from './dto/username-email.dto';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wish.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const user = { ...req.user, ...updateUserDto };

    const hash = updateUserDto.password
      ? await bcrypt.hash(updateUserDto.password, 10)
      : user.password;
    await this.usersService.update(req.user.id, {
      ...user,
      password: hash,
    });
    return this.usersService.findOne(user.id);
  }

  @Post('find')
  findMany(@Body() usernameOrEmailDto: UsernameOrEmailDto): Promise<User[]> {
    return this.usersService.findMany(usernameOrEmailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  findWishes(@Req() req): Promise<Wish[]> {
    return this.wishesService.findUserWishes(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  findUser(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username/wishes')
  async findUserWishes(@Param('username') username: string) {
    const { id } = await this.usersService.findByUsername(username);
    return this.wishesService.findUserWishes(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
