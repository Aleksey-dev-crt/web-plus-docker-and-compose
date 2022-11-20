import { IsOptional } from 'class-validator';

export class UpdateWishDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  link?: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  copied?: number;

  @IsOptional()
  raised?: number;
}
