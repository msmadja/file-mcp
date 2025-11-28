import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SearchFilesDto {
  @IsString()
  @IsNotEmpty()
  pattern!: string;

  @IsString()
  @IsOptional()
  path?: string;
}
