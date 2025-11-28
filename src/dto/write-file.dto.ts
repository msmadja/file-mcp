import { IsString, IsNotEmpty } from 'class-validator';

export class WriteFileDto {
  @IsString()
  @IsNotEmpty()
  path!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}
