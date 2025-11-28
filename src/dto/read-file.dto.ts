import { IsString, IsNotEmpty } from 'class-validator';

export class ReadFileDto {
  @IsString()
  @IsNotEmpty()
  path!: string;
}
