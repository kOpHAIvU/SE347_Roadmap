import { PartialType } from '@nestjs/mapped-types';
import { CreateGeminiDto } from './create-gemini.dto';

export class UpdateGeminiDto extends PartialType(CreateGeminiDto) {}
