import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtAuthGuard } from '../auth/common/jwt-guard';
import { RoleGuard } from '../role/common/role.guard';
import { Roles } from '../role/common/role.decorator';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post('new')
    @UseGuards(JwtAuthGuard)
    async create(@Body() createMessageDto: CreateMessageDto) {
        return await this.messageService.create(createMessageDto);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
    async findAll(@Query('page', ParseIntPipe) page: number = 1, @Query('limit', ParseIntPipe) limit: number = 10) {
        return await this.messageService.findAll(page, limit);
    }

    @Get('item/:id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id', ParseIntPipe) id: string) {
        return await this.messageService.findOneById(+id);
    }

    @Get('team/:teamId')
    @UseGuards(JwtAuthGuard)
    async findMessagesByTeam(
        @Param('teamId', ParseIntPipe) teamId: string,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ) {
        return await this.messageService.findAllByTeamId(+teamId, page, limit);
    }

    @Patch('item/:id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id', ParseIntPipe) id: string, @Body() updateMessageDto: UpdateMessageDto) {
        return await this.messageService.update(+id, updateMessageDto);
    }

    @Delete('item/:id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id', ParseIntPipe) id: string) {
        return await this.messageService.remove(+id);
    }
}
