import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;

  @IsInt()
  authorId: number;

  @IsInt()
  threadId: number;
}
