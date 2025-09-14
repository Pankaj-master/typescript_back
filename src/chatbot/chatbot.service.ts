import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ChatbotQueryDto } from './chatbot.dto';

// Defines the expected JSON structure from the Gemini intent classification
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
  // It's best practice to use environment variables for sensitive keys and URLs
  private readonly GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  private readonly PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:5001/api/recommendations';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Main method to process the entire chatbot query workflow.
   */
  async processUserQuery(queryDto: ChatbotQueryDto) {
    // Step 3 (Placeholder): Translate non-English query to English
    const englishQuery = queryDto.message; 

    // Step 4: Get intent and parameters from Gemini
    const intentData = await this.getIntentFromGemini(englishQuery);

    let finalResponse: string;

    // Step 5: Execute the correct tool based on the intent
    if (intentData.intent === 'food_recommendation' && intentData.parameters.dosha) {
      this.logger.log(`Executing tool: food_recommendation with params: ${JSON.stringify(intentData.parameters)}`);
      const foods = await this.getFoodRecommendations(intentData.parameters);
      
      // Step 6: Synthesize a friendly response from the tool's output
      if (foods && foods.length > 0) {
        finalResponse = await this.synthesizeFoodResponse(foods);
      } else {
        finalResponse = "I couldn't find any foods that match all of your criteria. Please try a simpler request.";
      }
    } else {
      // If the intent is not a food recommendation, handle as a general conversation
      this.logger.log('Executing tool: general_conversation');
      finalResponse = await this.getGeneralResponse(englishQuery);
    }
    
    // Step 6 (Placeholder): Translate the final English response back to the user's original language
    
    return { response: finalResponse };
  }

  /**
   * Calls Gemini to classify the user's intent and extract entities.
   */
  private async getIntentFromGemini(query: string): Promise<IntentResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.GEMINI_API_KEY}`;
    const prompt = `Analyze the user's query about Ayurvedic diet. Classify the intent and extract parameters. Return ONLY a valid JSON object. Valid intents are "food_recommendation", "general_conversation", "unknown". Parameters for "food_recommendation" are "dosha" (Vata, Pitta, Kapha), "virya" (Cooling, Heating), "rasa" (a taste to avoid). Query: "${query}"`;

    try {
      const response = await firstValueFrom(this.httpService.post(url, { contents: [{ parts: [{ text: prompt }] }] }));
      const rawJson = response.data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
      return JSON.parse(rawJson);
    } catch (error) {
      this.logger.error('Error getting intent from Gemini:', error.response?.data || error.message);
      return { intent: 'unknown', parameters: { dosha: null, virya: null, rasa: null } };
    }
  }

  /**
   * Calls the Python microservice to get food recommendations.
   */
  private async getFoodRecommendations(params: IntentResponse['parameters']): Promise<any[]> {
    try {
      // The 'params' object from Gemini matches the query parameters of our Python API
      const response = await firstValueFrom(this.httpService.get(this.PYTHON_SERVICE_URL, { params }));
      return response.data;
    } catch (error) {
      this.logger.error('Error calling Python AI service:', error.message);
      return []; // Return an empty array on failure
    }
  }

  /**
   * Calls Gemini to format the structured data from a tool into a friendly sentence.
   */
  private async synthesizeFoodResponse(foods: any[]): Promise<string> {
    // Extract just the food names to create a clean list for the prompt
    const foodList = foods.map(f => f.food_item.split('(')[0].trim()).join(', ');
    const prompt = `You are an Ayurvedic diet assistant. A user asked for recommendations, and the system found: ${foodList}. Format this into a friendly, natural language response.`;
    return this.getGeneralResponse(prompt);
  }
  
  /**
   * A general-purpose function to get a conversational response from Gemini.
   */
  private async getGeneralResponse(prompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.GEMINI_API_KEY}`;
    try {
       const response = await firstValueFrom(this.httpService.post(url, { contents: [{ parts: [{ text: prompt }] }] }));
       return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
       this.logger.error('Error getting general response from Gemini:', error.response?.data || error.message);
       return "I am sorry, I am having trouble thinking right now."
    }
  }
}

