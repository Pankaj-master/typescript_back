import { Controller, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotQueryDto } from './chatbot.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chatbot')
export class ChatbotController {
  private readonly logger = new Logger(ChatbotController.name);

  constructor(private readonly chatbotService: ChatbotService) {}

  // This endpoint is protected and can only be accessed by authenticated users.
  @UseGuards(JwtAuthGuard)
  @Post('query')
  async handleQuery(@Body() chatbotQueryDto: ChatbotQueryDto) {
    this.logger.log(`Received query: "${chatbotQueryDto.message}" from user.`);
    return this.chatbotService.processUserQuery(chatbotQueryDto);
  }
}

