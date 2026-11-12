import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

// Kun teksten kan rettes. Forfatter og tråd ligger fast
export class UpdateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}
