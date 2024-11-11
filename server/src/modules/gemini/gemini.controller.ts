import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { CreateGeminiDto } from './dto/create-gemini.dto';
import { UpdateGeminiDto } from './dto/update-gemini.dto';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Get('/prompt')
  findAll(
    @Body('prompt') prompt: string,
  ) {
    return this.geminiService.generateContent(prompt);
  }

}
