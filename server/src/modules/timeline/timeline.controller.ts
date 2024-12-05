import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';

@Controller('timeline')

export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Post('new')
  async create(@Body() createTimelineDto: CreateTimelineDto) {
    return await this.timelineService.create(createTimelineDto);
  }

  @Get('all')
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.timelineService.findAll(page, limit);
  }

  @Get('item/:id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return await this.timelineService.findOneById(+id);
  }

  @Get("user/:userId")
  async findTimelinesByUserId(
    @Param('userId', ParseIntPipe) idUser: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.timelineService.findTimelinesByUserId(idUser, page, limit);
  }
        
  @Patch('item/:id')
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateTimelineDto: UpdateTimelineDto) {
    return await this.timelineService.update(+id, updateTimelineDto);
  }

  @Delete('item/:id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    return await this.timelineService.remove(+id);
  }
}
