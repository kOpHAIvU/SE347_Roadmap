import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';


@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('new')
  async create(@Body() createProgressDto: CreateProgressDto) {
    return await this.progressService.create(createProgressDto);
  }

  @Get('all/userProgress/:userId')
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('timelineId', ParseIntPipe) timelineId: number,
    @Body('teamId', ParseIntPipe) groupId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.progressService.findAllByUser(userId, timelineId, groupId, page, limit);
  }

  @Get('nodeItem/:nodeId')
  async findOne(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('timelineId', ParseIntPipe) timelineId: number,
    @Body('teamId', ParseIntPipe) groupId: number,
    @Param('nodeId', ParseIntPipe) nodeId: number,
  ) {
    return await this.progressService.findOne(userId, timelineId, groupId, nodeId);
  }

  @Delete('nodeItem/:nodeId')
  async remove(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('timelineId', ParseIntPipe) timelineId: number,
    @Body('teamId', ParseIntPipe) groupId: number,
    @Param('nodeId', ParseIntPipe) nodeId: number,
  ) {
    return await this.progressService.remove(userId, timelineId, groupId, nodeId);
  }
}
