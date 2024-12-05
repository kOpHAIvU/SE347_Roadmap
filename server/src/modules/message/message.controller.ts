import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('new')
  async create(@Body() createMessageDto: CreateMessageDto) {
    return await this.messageService.create(createMessageDto);
  }

  @Get('all')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.messageService.findAll();
  }

  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return await this.messageService.findOneById(+id);
  }

  @Patch('item/:id')
  async update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return await this.messageService.update(+id, updateMessageDto);
  }

  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return await this.messageService.remove(+id);
  }
}
