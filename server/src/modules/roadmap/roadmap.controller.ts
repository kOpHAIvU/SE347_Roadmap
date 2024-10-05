import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe  } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { JwtAuthGuard } from '../auth/common/jwt-guard';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/common/role.guard';
import { Roles } from '../role/common/role.decorator';

@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Post('new')
  create(@Body() createRoadmapDto: CreateRoadmapDto) {
    return this.roadmapService.create(createRoadmapDto);
  }

  @Get('all')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @UseGuards(AuthGuard('jwt'))
  // @Roles('admin') 
  findAll() {
    return this.roadmapService.findAll();
  }

  @Get('id/:id')
  findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.roadmapService.findOneById(+id);
  }

  @Get('code/:code')
  findOneByCode(@Param('code') code: string) {
    return this.roadmapService.findOneByCode(code);
  }

  @Patch('id/:id')
  updateById(@Param('id', ParseIntPipe) id: string, @Body() updateRoadmapDto: UpdateRoadmapDto) {
    return this.roadmapService.updateById(+id, updateRoadmapDto);
  }

  @Patch('code/:code')
  updateByCode(@Param('code') code: string, @Body() updateRoadmapDto: UpdateRoadmapDto) {
    return this.roadmapService.updateByCode(code, updateRoadmapDto);  
  }

  @Delete('id/:id')
  removeById(@Param('id', ParseIntPipe) id: number) {
    return this.roadmapService.removeById(+id);
  }

  @Delete('code/:code')
  removeByCode(@Param('code') code: string) {
    return this.roadmapService.removeByCode(code);
  }
}
