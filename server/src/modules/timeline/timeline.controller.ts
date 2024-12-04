import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';

@Controller('timeline')

export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Post('new')
  create(@Body() createTimelineDto: CreateTimelineDto) {
    return this.timelineService.create(createTimelineDto);
  }

  @Get('all')
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.timelineService.findAll(page, limit);
  }

  @Get('item/:id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.timelineService.findOneById(+id);
  }
        
  @Patch('item/:id')
  update(@Param('id', ParseIntPipe) id: string, @Body() updateTimelineDto: UpdateTimelineDto) {
    return this.timelineService.update(+id, updateTimelineDto);
  }

  @Delete('item/:id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.timelineService.remove(+id);
  }
}
