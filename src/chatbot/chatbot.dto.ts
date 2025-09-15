import { IsString, IsNotEmpty } from 'class-validator';

export class ChatbotQueryDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  language: string; // e.g., 'en', 'hi'
}
