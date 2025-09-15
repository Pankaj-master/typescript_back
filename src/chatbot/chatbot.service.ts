import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ChatbotQueryDto } from './chatbot.dto';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

interface IntentResponse {
  intent: 'food_recommendation' | 'general_conversation' | 'unknown';
  parameters: {
    dosha: string | null;
    virya: string | null;
    rasa: string | null;
  };
}

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private readonly GEMINI_API_KEY: string;
  private readonly PYTHON_SERVICE_URL = 'http://127.0.0.1:5001/api/recommendations';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.GEMINI_API_KEY = this.configService.get<string>('GEMINI_API_KEY');
    if (!this.GEMINI_API_KEY) {
      this.logger.error('GEMINI_API_KEY is not set in the environment variables!');
    }
  }

  async processUserQuery(queryDto: ChatbotQueryDto) {
    // For now, assuming English. Translation logic would go here.
    const englishQuery = queryDto.message;

    const intentData = await this.getIntentFromGemini(englishQuery);
    this.logger.log(`Gemini classified intent as: ${intentData.intent}`);

    let finalResponse: string;

    if (intentData.intent === 'food_recommendation') {
      const foods = await this.getFoodRecommendations(intentData.parameters);
      if (foods.length > 0) {
        finalResponse = await this.synthesizeFoodResponse(foods);
      } else {
        finalResponse = "I couldn't find any foods that match all of your criteria. Please try a simpler request.";
      }
    } else {
      finalResponse = await this.getGeneralResponse(englishQuery);
    }
    
    return { response: finalResponse };
  }

  private async getIntentFromGemini(query: string): Promise<IntentResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.GEMINI_API_KEY}`;
    const prompt = `Analyze the user's query about Ayurvedic diet. Classify the intent and extract parameters. Return ONLY a valid JSON object. Intents: "food_recommendation", "general_conversation", "unknown". Parameters for "food_recommendation": "dosha", "virya" (potency), "rasa" (taste to avoid). User Query: "${query}"`;

    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post(url, { contents: [{ parts: [{ text: prompt }] }] }),
      );
      const rawJson = response.data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
      return JSON.parse(rawJson) as IntentResponse;
    } catch (error) {
      this.logger.error('Error getting intent from Gemini:', error.response?.data || error.message);
      return { intent: 'unknown', parameters: { dosha: null, virya: null, rasa: null } };
    }
  }

  private async getFoodRecommendations(params: IntentResponse['parameters']): Promise<any[]> {
    try {
      this.logger.log(`Calling Python service with params: ${JSON.stringify(params)}`);
      const response: AxiosResponse<any[]> = await firstValueFrom(
        this.httpService.get(this.PYTHON_SERVICE_URL, { params }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error calling Python AI service:', error.message);
      return [];
    }
  }

  private async synthesizeFoodResponse(foods: any[]): Promise<string> {
    const foodList = foods.map(f => f.food_item).join(', ');
    const prompt = `You are an Ayurvedic diet assistant. A user asked for food recommendations, and the system found: ${foodList}. Format this into a friendly, natural language response.`;
    return this.getGeneralResponse(prompt);
  }
  
  private async getGeneralResponse(prompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.GEMINI_API_KEY}`;
    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post(url, { contents: [{ parts: [{ text: prompt }] }] }),
      );
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      this.logger.error('Error getting general response from Gemini:', error.response?.data || error.message);
      return "I am sorry, I am having trouble thinking right now.";
    }
  }
}
