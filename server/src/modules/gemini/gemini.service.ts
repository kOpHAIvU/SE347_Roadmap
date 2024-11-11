import { Injectable } from '@nestjs/common';
import { CreateGeminiDto } from './dto/create-gemini.dto';
import { UpdateGeminiDto } from './dto/update-gemini.dto';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {env} from '../../configs/env.config';

@Injectable()
export class GeminiService {

  async generateContent(prompt: string): Promise<string> {
    const genAI = new GoogleGenerativeAI(env.API_KEYS.GEMINI);
    const model = genAI.getGenerativeModel({ model: "RoadmapFinetuningModel" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}
