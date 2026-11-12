import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateThreadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  // Valgfri liste af user-id'er, fx [1, 2]
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  participantIds?: number[];
}
