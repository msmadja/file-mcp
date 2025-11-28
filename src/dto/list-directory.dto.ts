import { IsString, IsOptional } from 'class-validator';

export class ListDirectoryDto {
  @IsString()
  @IsOptional()
  path?: string;
}
