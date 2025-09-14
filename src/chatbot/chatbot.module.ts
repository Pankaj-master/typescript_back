import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';

@Module({
  // Import HttpModule to make the HttpService available for injection
  imports: [HttpModule],
  // Register the controller that handles the API routes for this module
  controllers: [ChatbotController],
  // Register the service that contains the core logic for this module
  providers: [ChatbotService],
})
export class ChatbotModule {}

