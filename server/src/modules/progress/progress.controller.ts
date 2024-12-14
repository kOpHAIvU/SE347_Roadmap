import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { JwtAuthGuard } from '../auth/common/jwt-guard';
import { RoleGuard } from '../role/common/role.guard';
import { Roles } from '../role/common/role.decorator';


@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('new')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createProgressDto: CreateProgressDto) {
    return await this.progressService.create(createProgressDto);
  }

  @Get('all/userProgress/:userId')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('timelineId', ParseIntPipe) timelineId: number,
    @Body('teamId', ParseIntPipe) groupId: number,
    @Param('nodeId', ParseIntPipe) nodeId: number,
  ) {
    return await this.progressService.findOne(userId, timelineId, groupId, nodeId);
  }

  @Delete('nodeItem/:nodeId')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('timelineId', ParseIntPipe) timelineId: number,
    @Body('teamId', ParseIntPipe) groupId: number,
    @Param('nodeId', ParseIntPipe) nodeId: number,
  ) {
    return await this.progressService.remove(userId, timelineId, groupId, nodeId);
  }
}
