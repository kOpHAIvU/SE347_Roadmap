import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query, UseInterceptors, UploadedFile  } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';

@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Post('new_roadmap')
  async create(@Body() createRoadmapDto: CreateRoadmapDto) {
    return await this.roadmapService.create(createRoadmapDto);
  }

  @Get('all')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @UseGuards(AuthGuard('jwt'))
  // @Roles('admin') 
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 100,
  ) {
    return await this.roadmapService.findAll(page, limit);
  }

  @Get('id/:id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.roadmapService.findOneById(+id);
  }

  @Get('code/:code')
  async findOneByCode(@Param('code') code: string) {
    return await this.roadmapService.findOneByCode(code);
  }

  @Get('type/:type')
  async findRoadmapByType(
    @Param('type', ParseIntPipe) type: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 100,
  ) {
    return await this.roadmapService.findRoadmapsByType(type, page, limit);
  }

  @Get('owner/:owner')
  async findRoadmapByOwner(
    @Param('owner', ParseIntPipe) owner: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 100,
  ) {
    return await this.roadmapService.findRoadmapsByOwner(owner, page, limit);
  }

  @Patch('id/:id')
  async updateById(@Param('id', ParseIntPipe) id: string, @Body() updateRoadmapDto: UpdateRoadmapDto) {
    return await this.roadmapService.updateById(+id, updateRoadmapDto);
  }

  @Patch('code/:code')
  async updateByCode(@Param('code') code: string, @Body() updateRoadmapDto: UpdateRoadmapDto) {
    return await this.roadmapService.updateByCode(code, updateRoadmapDto);  
  }

  @Delete('id/:id')
  async removeById(@Param('id', ParseIntPipe) id: number) {
    return await this.roadmapService.removeById(+id);
  }

  @Delete('code/:code')
  async removeByCode(@Param('code') code: string) {
    return await this.roadmapService.removeByCode(code);
  }
}
