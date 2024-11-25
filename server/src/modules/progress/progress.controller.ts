import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';


@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('new')
  create(@Body() createProgressDto: CreateProgressDto) {
    return this.progressService.create(createProgressDto);
  }

  @Get('all/userProgress/:userId')
  findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('timelineId', ParseIntPipe) timelineId: number,
    @Body('teamId', ParseIntPipe) groupId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.progressService.findAllByUser(userId, timelineId, groupId, page, limit);
  }

  @Get('nodeItem/:nodeId')
  findOne(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('timelineId', ParseIntPipe) timelineId: number,
    @Body('teamId', ParseIntPipe) groupId: number,
    @Param('nodeId', ParseIntPipe) nodeId: number,
  ) {
    return this.progressService.findOne(userId, timelineId, groupId, nodeId);
  }

  @Delete('nodeItem/:nodeId')
  remove(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('timelineId', ParseIntPipe) timelineId: number,
    @Body('teamId', ParseIntPipe) groupId: number,
    @Param('nodeId', ParseIntPipe) nodeId: number,
  ) {
    return this.progressService.remove(userId, timelineId, groupId, nodeId);
  }
}
